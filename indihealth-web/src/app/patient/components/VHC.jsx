import Image from 'next/image';

const VHC = ({ patient }) => {
    return (
        <div className="relative h-[250px] bg-[#f9f9f0] rounded-xl overflow-hidden items-center">
            {/* Watermark Logo */}
            <div className="absolute inset-0 flex justify-center items-center">
                <Image
                    src="/logo.svg" // Replace with your logo URL
                    alt="Logo Watermark"
                    layout="fill"
                    objectFit="contain"
                    className="opacity-10" // Adjust opacity here
                />
            </div>
            <div className="absolute w-[55px] h-full top-0 right-0 bg-teal-600"></div>
            <div className="absolute bottom-3 right-16">
                <p className="text-3xl font-bold mb-4">{patient.patient_id}</p>
            </div>
            <div className="absolute top-4 right-4 w-[100px] h-[100px]">
                <div className="relative w-full h-full">
                    <Image
                        src="https://images.pexels.com/photos/4067753/pexels-photo-4067753.jpeg?auto=compress&cs=tinysrgb&w=600"
                        alt="Profile Icon"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-full border-4 border-teal-600 w-40"
                    />
                </div>
            </div>
            <div className="absolute top-24 right-5">
                {/* QR code will be added later */}
            </div>
            <div className="p-4 flex flex-col items-start space-y-2">
                <p className="text-xl font-bold ">IndiHealth Virtual Card</p>
                <p className="text-lg font-semibold underline">{patient.name}</p>
                <p className="text-lg font-semibold ">Gender: {patient.gender}</p>
                {/* <p className="text-lg">DOB: {patient.dob.split('T')[0]}</p> */}
                <p className="text-lg font-semibold ">Contact: {patient.phone}</p>
            </div>
            <div className="absolute bottom-2 left-2">
                <p className="text-xs text-gray-500">**For HealthCare use only</p>
            </div>
        </div>
    );
};

export default VHC;
