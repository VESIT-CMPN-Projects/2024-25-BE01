from flask import Blueprint, jsonify
from datetime import datetime, UTC, timedelta, timezone
from supabase import create_client

from app.config import SUPABASE_URL, SUPABASE_KEY

bp = Blueprint("kpi", __name__)
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Route for Admissions Today
@bp.route("/admissions_today", methods=["GET"])
def admissions_today():
    today = datetime.now(UTC).date().isoformat()
    admissions = supabase.table("admissions").select("id").eq("admission_date", today).execute().data
    return jsonify({"Admissions Today": len(admissions)})

@bp.route("/active_counters", methods=["GET"])
def active_counters():
    counters = supabase.table("counters").select("enabled").execute().data

    if not counters:
        return jsonify({"Active Counters": 0})

    active_count = sum(1 for counter in counters if counter["enabled"])

    return jsonify({"Active Counters": active_count})

# Route for Bed Occupancy Rate
@bp.route("/bed_occupancy_rate", methods=["GET"])
def bed_occupancy_rate():
    total_beds = supabase.table("beds").select("bed_id").execute().data
    occupied_beds = supabase.table("beds").select("bed_id").eq("available", False).execute().data
    rate = (len(occupied_beds) / len(total_beds)) * 100 if total_beds else 0
    return jsonify({"Bed Occupancy Rate": round(rate, 2)})

@bp.route("/average_wait_time", methods=["GET"])
def average_wait_time():
    counters = supabase.table("counters").select("service_type", "allocated_tokens", "expected_time").execute().data

    if not counters:
        return jsonify({"Average Wait Time per Service (mins)": {}})

    service_wait_times = {}
    all_services = set()  # To ensure all services appear in the response

    for counter in counters:
        service_type = counter["service_type"]
        all_services.add(service_type)  # Track all unique services

        allocated_tokens = len(counter["allocated_tokens"]) if counter["allocated_tokens"] else 0
        expected_time = counter["expected_time"] if counter["expected_time"] else 0

        if allocated_tokens > 0 and expected_time > 0:
            total_wait_time = allocated_tokens * expected_time  # Estimate total wait time
            if service_type in service_wait_times:
                service_wait_times[service_type].append(total_wait_time)
            else:
                service_wait_times[service_type] = [total_wait_time]

    # Compute average wait time per service type (Include all services)
    avg_wait_times = {
        service: round(sum(service_wait_times[service]) / len(service_wait_times[service]), 2) if service in service_wait_times else 0
        for service in all_services
    }

    return jsonify({"Average Wait Time per Service (mins)": avg_wait_times})

@bp.route("/patient_turnaround_time", methods=["GET"])
def patient_turnaround_time():
    admissions = supabase.table("admissions").select("admission_date, deallocate_date").execute().data
    
    if not admissions:
        return jsonify({"Patient Turnaround Time (days)": "-"})

    turnaround_times = [
        (datetime.fromisoformat(a["deallocate_date"]) - datetime.fromisoformat(a["admission_date"])).days
        for a in admissions if a.get("deallocate_date")
    ]

    if not turnaround_times:
        return jsonify({"Patient Turnaround Time (days)": "-"})

    avg_turnaround_time = round(sum(turnaround_times) / len(turnaround_times), 2)

    return jsonify({"Patient Turnaround Time (days)": avg_turnaround_time})


# Route for Average Length of Stay (days)
@bp.route("/average_length_of_stay", methods=["GET"])
def average_length_of_stay():
    stays = supabase.table("admissions").select("admission_date, deallocate_date").execute().data
    if not stays:
        return jsonify({"Average Length of Stay (days)": 0})
    
    lengths = [
        (datetime.fromisoformat(s["deallocate_date"]) - datetime.fromisoformat(s["admission_date"])).days
        for s in stays if s.get("deallocate_date")
    ]
    return jsonify({"Average Length of Stay (days)": round(sum(lengths) / len(lengths), 2)})

# Route for Bed Availability (Pie Chart)
@bp.route("/bed_availability_pie", methods=["GET"])
def bed_availability_pie():
    beds = supabase.table("beds").select("department, available").execute().data
    department_counts = {}
    
    for bed in beds:
        dept = bed["department"]
        department_counts.setdefault(dept, {"Available": 0, "Occupied": 0})
        key = "Available" if bed["available"] else "Occupied"
        department_counts[dept][key] += 1

    return jsonify(department_counts)

# Route for Patients Waiting (Bar Chart)
@bp.route("/patients_waiting_bar", methods=["GET"])
def patients_waiting_bar():
    patients = supabase.table("appointments").select("department_id").eq("status", "scheduled").execute().data
    department_counts = {}

    for p in patients:
        dept = p["department_id"]
        department_counts[dept] = department_counts.get(dept, 0) + 1

    return jsonify(department_counts)

# Route for Admission Trend (Line Graph)
@bp.route("/admission_trend", methods=["GET"])
def admission_trend():
    last_week = (datetime.now(UTC) - timedelta(days=7)).date().isoformat()
    admissions = supabase.table("admissions").select("admission_date").gte("admission_date", last_week).execute().data
    trend = {}

    for a in admissions:
        date = a["admission_date"]
        trend[date] = trend.get(date, 0) + 1

    return jsonify(trend)
