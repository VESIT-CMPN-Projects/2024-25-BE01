"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
} from "recharts"
import axios from "axios" // Import axios for HTTP requests

const Dashboard = () => {
  const [kpiData, setKpiData] = useState({
    admissionsToday: 0,
    activeCounters: 0,
    bedOccupancyRate: 0,
    averageWaitTime: {},
    patientTurnaroundTime: 0,
    averageLengthOfStay: 0,
  })
  const [bedAvailability, setBedAvailability] = useState({})
  const [patientsWaiting, setPatientsWaiting] = useState({})
  const [admissionTrend, setAdmissionTrend] = useState({})
  const router = useRouter()

  useEffect(() => {
    const token = Cookies.get("access_token")
    if (!token) {
      router.push("/auth/login")
      return
    }

    const fetchData = async () => {
      try {
        const [
          admissionsToday,
          activeCounters,
          bedOccupancyRate,
          averageWaitTime,
          patientTurnaroundTime,
          averageLengthOfStay,
          bedAvailabilityPie,
          patientsWaitingBar,
          admissionTrendLine,
        ] = await Promise.all([
          axios.get("http://127.0.0.1:5000/admissions_today"),
          axios.get("http://127.0.0.1:5000/active_counters"),
          axios.get("http://127.0.0.1:5000/bed_occupancy_rate"),
          axios.get("http://127.0.0.1:5000/average_wait_time"),
          axios.get("http://127.0.0.1:5000/patient_turnaround_time"),
          axios.get("http://127.0.0.1:5000/average_length_of_stay"),
          axios.get("http://127.0.0.1:5000/bed_availability_pie"),
          axios.get("http://127.0.0.1:5000/patients_waiting_bar"),
          axios.get("http://127.0.0.1:5000/admission_trend"),
        ])

        setKpiData({
          admissionsToday: admissionsToday.data["Admissions Today"],
          activeCounters: activeCounters.data["Active Counters"],
          bedOccupancyRate: bedOccupancyRate.data["Bed Occupancy Rate"],
          averageWaitTime: averageWaitTime.data["Average Wait Time per Service (mins)"],
          patientTurnaroundTime: patientTurnaroundTime.data["Patient Turnaround Time (days)"],
          averageLengthOfStay: averageLengthOfStay.data["Average Length of Stay (days)"],
        })

        setBedAvailability(bedAvailabilityPie.data)
        setPatientsWaiting(patientsWaitingBar.data)
        setAdmissionTrend(admissionTrendLine.data)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [router]) // Added router to the dependency array

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

  const formatBedAvailabilityData = () => {
    return Object.entries(bedAvailability).map(([department, data]) => ({
      department,
      ...data,
    }))
  }

  const formatPatientsWaitingData = () => {
    return Object.entries(patientsWaiting).map(([department, count]) => ({
      department,
      count,
    }))
  }

  const formatAdmissionTrendData = () => {
    return Object.entries(admissionTrend).map(([date, count]) => ({
      date,
      count,
    }))
  }

  return (
    <div className="p-6 space-y-6">
      {/* Critical Alerts & High-Level KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-md p-4 border-2 border-blue-300 rounded-md">
          <h3 className="text-xl font-semibold text-gray-700">Admissions Today</h3>
          <p className="text-3xl font-bold text-blue-600">{kpiData.admissionsToday}</p>
        </div>
        <div className="bg-white shadow-md p-4 border-2 border-red-300 rounded-md">
          <h3 className="text-xl font-semibold text-gray-700">Bed Occupancy Rate</h3>
          <p className="text-3xl font-bold text-red-600">{kpiData.bedOccupancyRate}%</p>
        </div>
        <div className="bg-white shadow-md p-4 border-2 border-green-300 rounded-md">
          <h3 className="text-xl font-semibold text-gray-700">Active Counters</h3>
          <p className="text-3xl font-bold text-green-600">{kpiData.activeCounters}</p>
        </div>
        <div className="bg-white shadow-md p-4 border-2 border-purple-300 rounded-md">
          <h3 className="text-xl font-semibold text-gray-700">Patient Turnaround Time</h3>
          <p className="text-3xl font-bold text-purple-600">{kpiData.patientTurnaroundTime} days</p>
        </div>
        <div className="bg-white shadow-md p-4 border-2 border-orange-300 rounded-md">
          <h3 className="text-xl font-semibold text-gray-700">Average Length of Stay</h3>
          <p className="text-3xl font-bold text-orange-600">{kpiData.averageLengthOfStay} days</p>
        </div>
      </div>

      {/* Two visualizations in a row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Patients Waiting */}
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">Patients Waiting</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={formatPatientsWaitingData()}>
              <XAxis dataKey="department" />
              <YAxis />
              <Bar dataKey="count" fill="#8884d8" />
              <Tooltip />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bed Availability */}
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">Bed Availability</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={formatBedAvailabilityData()}
                dataKey="Available"
                nameKey="department"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {formatBedAvailabilityData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Admission Trend */}
      <div className="bg-white shadow-lg rounded-lg p-4">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Admission Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formatAdmissionTrendData()}>
            <XAxis dataKey="date" />
            <YAxis />
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
            <Tooltip />
            <Legend />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Average Wait Time per Service */}
      <div className="bg-white shadow-lg rounded-lg p-4">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Average Wait Time per Service</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={Object.entries(kpiData.averageWaitTime).map(([service, time]) => ({ service, time }))}>
            <XAxis dataKey="service" />
            <YAxis />
            <Bar dataKey="time" fill="#82ca9d" />
            <Tooltip />
            <Legend />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default Dashboard

