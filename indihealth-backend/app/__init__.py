# app/__init__.py
from flask import Flask
from app.routes import auth, todos, connection, bed, kpi
import os
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "*"}}) 
    
    # Configuration for Supabase
    app.config['SUPABASE_URL'] = os.getenv('SUPABASE_URL')
    app.config['SUPABASE_KEY'] = os.getenv('SUPABASE_KEY')

    # Register blueprints with unique URL prefixes
    app.register_blueprint(auth.bp)
    app.register_blueprint(todos.bp)        # Prefix for todos: '/todos'
    app.register_blueprint(connection.bp)   # Prefix for connection: '/connection'
    app.register_blueprint(bed.bp)          # Prefix for connection: '/bed'
    app.register_blueprint(kpi.bp)          # Prefix for connection: '/bed'

    return app
