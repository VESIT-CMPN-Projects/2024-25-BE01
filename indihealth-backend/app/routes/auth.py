from flask import Blueprint, request, jsonify
from supabase import create_client
from app.config import SUPABASE_URL, SUPABASE_KEY
import re
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

bp = Blueprint('auth', __name__)
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
limiter = Limiter(key_func=get_remote_address)

# Password strength validation function
def is_password_strong(password):
    if len(password) < 8:
        return False, "Password must be at least 8 characters long."
    if not re.search(r'[A-Za-z]', password):
        return False, "Password must contain letters."
    if not re.search(r'[0-9]', password):
        return False, "Password must contain numbers."
    if not re.search(r'[!@#$%^&*]', password):
        return False, "Password must contain special characters."
    return True, None

@bp.route('/signup', methods=['POST'])
def signup():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    is_strong, message = is_password_strong(password)
    if not is_strong:
        return jsonify({"error": message}), 400

    try:
        # Attempt to sign up the user
        response = supabase.auth.sign_up({"email":email, "password":password})
        
        # Access the user object and check if it exists
        if not hasattr(response, 'user') or response.user is None:
            error_message = getattr(response, 'error', {}).get('message', 'Sign-up failed')
            return jsonify({"error": error_message}), 400

        # Email verification check
        if not response.user.confirmed_at:
            return jsonify({"message": "Please confirm your email to proceed."}), 400

        # Return success response if sign-up was successful
        return jsonify({
            "message": "User signed up successfully",
            "user": {
                "id": response.user.id,
                "email": response.user.email,
                "created_at": response.user.created_at,
                "confirmed_at": response.user.confirmed_at
            }
        }), 201

    except Exception as e:
        return jsonify({"error": "An error occurred during sign-up", "details": str(e)}), 500

# Rate limiting login attempts (5 per minute)
@bp.route('/login', methods=['POST'])
@limiter.limit("5 per minute")
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    try:
        # Sign in with Supabase Auth
        response = supabase.auth.sign_in_with_password({ "email": email, "password": password })

        # Extract the necessary data from the response
        user = response.user
        session = response.session
        access_token = session.access_token

        return jsonify({
            "message": "Login successful",
            "access_token": access_token,
            "user": {
                "id": user.id,
                "email": user.email,
                "created_at": user.created_at.isoformat() if user.created_at else None,
                "confirmed_at": user.confirmed_at.isoformat() if user.confirmed_at else None,
                "last_sign_in_at": user.last_sign_in_at.isoformat() if user.last_sign_in_at else None,
                "role": user.role
            },
            "token_type": "bearer"
        }), 200

    except Exception as e:
        return jsonify({"error": "An error occurred during login", "details": str(e)}), 500

@bp.route('/logout', methods=['POST'])
def logout():
    try:
        supabase.auth.sign_out()
        return jsonify({"message": "Logged out successfully"}), 200
    except Exception as e:
        return jsonify({"error": "Logout failed", "details": str(e)}), 400

# Password reset route
@bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.json
    email = data.get('email')

    if not email:
        return jsonify({"error": "Email is required"}), 400

    try:
        response = supabase.auth.api.reset_password_for_email(email)
        return jsonify({"message": "Password reset email sent"}), 200

    except Exception as e:
        return jsonify({"error": "Failed to send password reset email", "details": str(e)}), 500

# Refresh token route
@bp.route('/refresh-token', methods=['POST'])
def refresh_token():
    data = request.json
    refresh_token = data.get('refresh_token')

    if not refresh_token:
        return jsonify({"error": "Refresh token is required"}), 400

    try:
        response = supabase.auth.api.refresh_access_token(refresh_token)
        access_token = response.session.access_token

        return jsonify({
            "message": "Token refreshed successfully",
            "access_token": access_token,
            "token_type": "bearer"
        }), 200

    except Exception as e:
        return jsonify({"error": "Failed to refresh token", "details": str(e)}), 500

# Account deletion route
@bp.route('/delete-account', methods=['DELETE'])
def delete_account():
    data = request.json
    user_id = data.get('user_id')

    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    try:
        response = supabase.auth.api.delete_user(user_id)
        return jsonify({"message": "User deleted successfully"}), 200

    except Exception as e:
        return jsonify({"error": "Failed to delete user", "details": str(e)}), 500
