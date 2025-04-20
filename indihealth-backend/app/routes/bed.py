from flask import Blueprint, jsonify, request
from supabase import create_client
from datetime import UTC, datetime
from apscheduler.schedulers.background import BackgroundScheduler
from flask import Blueprint, request, jsonify
from app.config import SUPABASE_URL, SUPABASE_KEY

# Blueprint setup for routes
bp = Blueprint('bed', __name__)
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Mapping for categorical values to numeric weights
priority_weights = {'high': 3, 'medium': 2, 'low': 1}
proximity_weights = {'high': 3, 'medium': 2, 'low': 1}

# Function to get the load of a department
def get_department_load(department):
    total_beds = supabase.table('beds').select('bed_id').eq('department', department).execute().data
    occupied_beds = supabase.table('beds').select('bed_id').eq('department', department).eq('available', False).execute().data
    return len(occupied_beds) / len(total_beds) if total_beds else 1

# Function to calculate priority based on severity
def calculate_priority(severity):
    severity = severity.lower()
    return priority_weights.get(severity, 1)  # Default to 1 if not found

# Route to allocate a bed
@bp.route('/allocate_bed', methods=['POST'])
def allocate_bed():
    data = request.json
    patient_id = data.get('patient_id')
    severity = data.get('severity')
    equipment_needed = data.get('equipment', '').split(',')
    room_type_needed = data.get('room_type', 'shared')
    isolation_needed = data.get('isolation', 'False')
    deallocate_date = data.get('deallocate_date')  # Deallocate date should be in ISO format (YYYY-MM-DD)
    
    try:
        deallocate_datetime = datetime.fromisoformat(deallocate_date).date()  # Store only the date
    except ValueError:
        return jsonify({'message': 'Invalid deallocation date format. Use YYYY-MM-DD format.'}), 400
    
    severity_priority = calculate_priority(severity)  # Convert severity to priority weight
    beds = supabase.table('beds').select('*').eq('available', True).execute().data  # Fetch all available beds

    # Try to find suitable beds based on patient-specific needs
    suitable_beds = [
        bed for bed in beds
        if priority_weights.get(bed['priority'], 1) >= severity_priority
        and all(equip in (bed.get('equipment', '') or '').split(',') for equip in equipment_needed if equip)
        and bed['room_type'] == room_type_needed
        and bed['isolation'] == isolation_needed
    ]
    
    # If no suitable beds are found, allocate any available bed
    if not suitable_beds:
        suitable_beds = sorted(beds, key=lambda x: (
            0 if x['proximity'] == 'high' else 1,
            x['bed_id']
        ))

    # Sort suitable beds by priority and proximity
    suitable_beds.sort(key=lambda x: (
        priority_weights.get(x['priority'], 1), 
        proximity_weights.get(x['proximity'], 1), 
        get_department_load(x['department'])
    ))

    if suitable_beds:
        allocated_bed = suitable_beds[0]
        supabase.table('beds').update({'available': False}).eq('bed_id', allocated_bed['bed_id']).execute()

        current_date = datetime.now(UTC).date()  # Get only the current date

        supabase.table('admissions').insert({
            'patient_id': patient_id,
            'bed_id': allocated_bed['bed_id'],
            'admission_date': current_date.isoformat(),
            'deallocate_date': deallocate_datetime.isoformat(),
            'status': 'active'  # Admission status is 'active' during allocation
        }).execute()

        return jsonify({
            'message': f"Bed {allocated_bed['bed_id']} in {allocated_bed['department']} with priority {allocated_bed['priority']} "
                       f"and proximity {allocated_bed['proximity']} has been allocated. It will be deallocated on {deallocate_datetime.isoformat()}."
        })

    return jsonify({'message': "No suitable beds available."}), 404

# Function to deallocate beds
def deallocate_beds():
    admissions = supabase.table('admissions').select('*').eq('status', 'active').execute().data
    current_date = datetime.now(UTC).date()

    for admission in admissions:
        if 'deallocate_date' in admission:
            deallocate_date = datetime.fromisoformat(admission['deallocate_date']).date()
            if current_date >= deallocate_date:
                supabase.table('beds').update({'available': True}).eq('bed_id', admission['bed_id']).execute()
                supabase.table('admissions').update({
                    'discharge_date': current_date.isoformat(),
                    'status': 'discharged'
                }).eq('bed_id', admission['bed_id']).eq('status', 'active').execute()

# Schedule deallocation to run daily
def schedule_deallocation():
    scheduler = BackgroundScheduler()
    scheduler.add_job(deallocate_beds, 'interval', days=1, next_run_time=datetime.now(UTC))
    scheduler.start()

# Route to check bed status
@bp.route('/bed_status/<int:bed_id>', methods=['GET'])
def bed_status(bed_id):
    bed = supabase.table('beds').select('*').eq('bed_id', bed_id).execute().data
    if bed:
        bed[0]['admission_date'] = bed[0]['admission_date'].isoformat()  # Convert to ISO format
        return jsonify(bed[0])
    return jsonify({'message': 'Bed not found.'}), 404

# Route to get all available beds
@bp.route('/available_beds', methods=['GET'])
def available_beds():
    beds = supabase.table('beds').select('*').execute().data
    if beds:
        return jsonify(beds), 200
    return jsonify({'message': 'No available beds found.'}), 404

# Route to get available departments
@bp.route('/departments', methods=['GET'])
def get_departments():
    beds = supabase.table('beds').select('department').eq('available', True).execute().data
    unique_departments = {bed['department'] for bed in beds}
    departments_list = [{'department': dept} for dept in unique_departments]
    return jsonify(departments_list), 200

# Route to get available and occupied beds in a department
@bp.route('/beds', methods=['GET'])
def get_beds_by_department():
    department = request.args.get('department')
    if not department:
        return jsonify({'message': 'Department query parameter is required.'}), 400

    beds = supabase.table('beds').select('*').eq('department', department).execute().data

    if beds:
        available_beds = [bed for bed in beds if bed['available']]
        occupied_beds = [bed for bed in beds if not bed['available']]

        return jsonify({
            'available_beds_count': len(available_beds),
            'occupied_beds_count': len(occupied_beds),
            'beds': beds
        }), 200
    else:
        return jsonify([]), 500


