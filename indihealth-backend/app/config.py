# config.py
import os

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

print("Supa url :", SUPABASE_URL)
print("Supa key :", SUPABASE_KEY)
