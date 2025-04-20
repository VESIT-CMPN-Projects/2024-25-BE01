from flask import Flask, jsonify, request
from supabase import create_client, Client
from datetime import UTC, datetime
from apscheduler.schedulers.background import BackgroundScheduler
from flask_cors import CORS  # Add this import

app = Flask(__name__)
CORS(app) 

# Supabase configuration
url = "https://saleyspprskkitiyltmz.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhbGV5c3BwcnNra2l0aXlsdG16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ5Mzk4MzYsImV4cCI6MjA0MDUxNTgzNn0.fSl-Ljdx3u3gds14m7BysuqU94Xf0s9hN-KEEz_eXOI"

supabase: Client = create_client(url, key)

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
    if severity == 'high':
        return 3
    elif severity == 'medium':
        return 2
    else:  # Assuming 'low'
        return 1

# Endpoint to allocate a bed based on severity, patient-specific needs, and department load balancing
@app.route('/allocate_bed', methods=['POST'])  # Changed to POST method
def allocate_bed():
    # Retrieve data from the JSON body
    data = request.json
    patient_id = data.get('patient_id')
    severity = data.get('severity')
    equipment_needed = data.get('equipment', '').split(',')
    room_type_needed = data.get('room_type', 'shared')
    isolation_needed = data.get('isolation', 'False')
    deallocate_date = data.get('deallocate_date')  # Deallocate date should be provided in ISO format (YYYY-MM-DD)
    
    try:
        deallocate_datetime = datetime.fromisoformat(deallocate_date).date()  # Store only the date
    except ValueError:
        return jsonify({'message': 'Invalid deallocation date format. Use YYYY-MM-DD format.'}), 400
    
    severity_priority = calculate_priority(severity)  # Convert severity to priority weight
    
    # Fetch all available beds
    beds = supabase.table('beds').select('*').eq('available', True).execute().data

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
        # If severity is high, prioritize beds close to ICU
        suitable_beds = sorted(beds, key=lambda x: (
            0 if x['proximity'] == 'high' else 1,  # High proximity beds first
            x['bed_id']  # Secondary sort by bed_id (arbitrary)
        ))

    # Sort suitable beds (if any were found) by priority and proximity
    suitable_beds.sort(key=lambda x: (
        priority_weights.get(x['priority'], 1), 
        proximity_weights.get(x['proximity'], 1), 
        get_department_load(x['department'])
    ))

    if suitable_beds:
        allocated_bed = suitable_beds[0]
        # Mark the bed as occupied
        supabase.table('beds').update({
            'available': False
        }).eq('bed_id', allocated_bed['bed_id']).execute()

        # Insert into admissions table with allocation and deallocation date
        current_date = datetime.now(UTC).date()  # Get only the current date
        
        # Ensure valid status values before insertion
        valid_status = 'active'  # Ensure that 'active' is a valid status
        if valid_status not in ['active', 'discharged']:  # Update this list based on your valid statuses
            return jsonify({'message': 'Invalid admission status.'}), 400

        supabase.table('admissions').insert({
            'patient_id': patient_id,
            'bed_id': allocated_bed['bed_id'],
            'admission_date': current_date.isoformat(),  # Convert to ISO format
            'deallocate_date': deallocate_datetime.isoformat(),  # Convert to ISO format
            'status': valid_status  # Admission status is 'active' during allocation
        }).execute()

        return jsonify({
            'message': f"Bed {allocated_bed['bed_id']} in {allocated_bed['department']} with priority {allocated_bed['priority']} "
                       f"and proximity {allocated_bed['proximity']} has been allocated. It will be deallocated on {deallocate_datetime.isoformat()}."
        })

    return jsonify({'message': "No suitable beds available."}), 404

# Function to deallocate beds after the specified date has passed
def deallocate_beds():
    admissions = supabase.table('admissions').select('*').eq('status', 'active').execute().data
    current_date = datetime.now(UTC).date()  # Get only the current date

    for admission in admissions:
        if 'deallocate_date' in admission:
            deallocate_date = datetime.fromisoformat(admission['deallocate_date']).date()  # Store only the date
            if current_date >= deallocate_date:
                # Deallocate bed
                supabase.table('beds').update({'available': True}).eq('bed_id', admission['bed_id']).execute()

                # Update the admissions table for the bed being deallocated
                supabase.table('admissions').update({
                    'discharge_date': current_date.isoformat(),  # Convert to ISO format
                    'status': 'discharged'  # Update status to 'discharged' once bed is deallocated
                }).eq('bed_id', admission['bed_id']).eq('status', 'active').execute()

                print(f"Bed {admission['bed_id']} has been deallocated and corresponding admission record updated.")

# Function to automatically schedule deallocation to run once a day
def schedule_deallocation():
    scheduler = BackgroundScheduler()
    # Run the deallocation process every day at midnight (UTC)
    scheduler.add_job(deallocate_beds, 'interval', days=1, next_run_time=datetime.now(UTC))
    scheduler.start()

# Endpoint to check the status of a specific bed
@app.route('/bed_status/<int:bed_id>', methods=['GET'])
def bed_status(bed_id):
    bed = supabase.table('beds').select('*').eq('bed_id', bed_id).execute().data
    if bed:
        bed[0]['admission_date'] = bed[0]['admission_date'].isoformat()  # Convert to ISO format
        return jsonify(bed[0])
    return jsonify({'message': 'Bed not found.'}), 404

# Endpoint to get all available beds
@app.route('/available_beds', methods=['GET'])
def available_beds():
    # Fetch all available beds from the database
    beds = supabase.table('beds').select('*').execute().data
    if beds:
        return jsonify(beds), 200
    return jsonify({'message': 'No available beds found.'}), 404

# Endpoint to fetch available departments
@app.route('/departments', methods=['GET'])
def get_departments():
    # Fetch available beds from the beds table
    beds = supabase.table('beds').select('department').eq('available', True).execute().data
    
    # Use a set to get unique departments
    unique_departments = {bed['department'] for bed in beds}  # Using a set comprehension to filter unique departments

    # Convert the set back to a list of dictionaries
    departments_list = [{'department': dept} for dept in unique_departments]
    
    return jsonify(departments_list), 200

# Endpoint to fetch available beds in a specific department
@app.route('/beds', methods=['GET'])
def get_beds_by_department():
    department = request.args.get('department')

    if not department:
        return jsonify({'message': 'Department query parameter is required.'}), 400

    # Fetch available beds in the specified department
    beds = supabase.table('beds').select('*').eq('available', True).eq('department', department).execute().data
    
    if beds:
        return jsonify(beds), 200
    else:
        return jsonify([]), 500  # Return an empty list if no beds found


if __name__ == '__main__':
    # Start the scheduler when the app starts
    schedule_deallocation()
    app.run(debug=True, port=5000)
