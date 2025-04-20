export const getDepartmentData = async () => {
    // Simulating an API call
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([
                {
                    id: 'dept1',
                    name: 'Cardiology',
                    doctorsAvailable: 5,
                    opdDone: 50,
                    opdTotal: 100,
                    appointmentDone: 30,
                    appointmentTotal: 80,
                    waitingOpd: 10,
                    waitingAppointment: 15
                },
                {
                    id: 'dept2',
                    name: 'Neurology',
                    doctorsAvailable: 3,
                    opdDone: 40,
                    opdTotal: 60,
                    appointmentDone: 20,
                    appointmentTotal: 40,
                    waitingOpd: 5,
                    waitingAppointment: 8
                },
                // Add more departments as needed
            ]);
        }, 500);
    });
};
