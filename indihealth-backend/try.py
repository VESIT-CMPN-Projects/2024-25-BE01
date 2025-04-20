import numpy as np
import random
import matplotlib.pyplot as plt

# Parameters
num_patients = 20
num_counters = 4
service_times = [5, 10, 15, 20]  # Service times for each counter (in seconds)

# Simulate patient arrivals (randomly within 0 to 100 seconds)
arrival_times = np.sort(np.random.uniform(0, 100, num_patients))

def simulate_dynamic_greedy(arrival_times, service_times):
    queue = []  # To keep track of patients waiting
    counters = [{'current_time': 0, 'queue': []} for _ in range(num_counters)]  # Initialize counters
    wait_times = []
    
    for arrival_time in arrival_times:
        # Find the counter with the least load
        counter_load = [(i, c['current_time']) for i, c in enumerate(counters)]
        selected_counter_idx, _ = min(counter_load, key=lambda x: x[1])
        
        # Assign patient to the selected counter
        start_time = max(arrival_time, counters[selected_counter_idx]['current_time'])
        service_time = service_times[selected_counter_idx]
        wait_time = start_time - arrival_time
        wait_times.append(wait_time)
        
        # Update counter's next available time
        counters[selected_counter_idx]['current_time'] = start_time + service_time
    
    return wait_times

def simulate_randomized_allocation(arrival_times, service_times):
    queue = []  # To keep track of patients waiting
    counters = [{'current_time': 0, 'queue': []} for _ in range(num_counters)]  # Initialize counters
    wait_times = []
    
    for arrival_time in arrival_times:
        # Randomly select a counter
        selected_counter_idx = random.randint(0, num_counters - 1)
        
        # Assign patient to the selected counter
        start_time = max(arrival_time, counters[selected_counter_idx]['current_time'])
        service_time = service_times[selected_counter_idx]
        wait_time = start_time - arrival_time
        wait_times.append(wait_time)
        
        # Update counter's next available time
        counters[selected_counter_idx]['current_time'] = start_time + service_time
    
    return wait_times

# Run simulations
dynamic_greedy_wait_times = simulate_dynamic_greedy(arrival_times, service_times)
randomized_wait_times = simulate_randomized_allocation(arrival_times, service_times)

# Calculate statistics
avg_dynamic_greedy_wait_time = np.mean(dynamic_greedy_wait_times)
avg_randomized_wait_time = np.mean(randomized_wait_times)

print(f"Average Wait Time (Dynamic Greedy): {avg_dynamic_greedy_wait_time:.2f} seconds")
print(f"Average Wait Time (Randomized): {avg_randomized_wait_time:.2f} seconds")

# Plotting the results
plt.figure(figsize=(12, 6))
plt.hist(dynamic_greedy_wait_times, bins=range(0, 31, 5), alpha=0.5, label='Dynamic Greedy', color='blue')
plt.hist(randomized_wait_times, bins=range(0, 31, 5), alpha=0.5, label='Randomized Allocation', color='red')
plt.xlabel('Wait Time (seconds)')
plt.ylabel('Number of Patients')
plt.title('Wait Time Distribution')
plt.legend(loc='upper right')
plt.grid(True)
plt.show()
