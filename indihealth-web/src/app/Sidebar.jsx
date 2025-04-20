'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
    ChevronDown,
    ChevronUp,
    Home,
    Users,
    Bed,
    ClipboardList,
    Package,
    Pill,
    BarChart,
    FileText,
    Settings,
    User,
    Key,
} from 'lucide-react'

export default function Sidebar() {
    const [openSection, setOpenSection] = useState(null)

    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section)
    }

    return (
        <aside className="fixed top-0 left-0 h-screen w-64 bg-white text-foreground flex flex-col border-r border-border">
            <div className="px-6 py-4 flex items-center border-b border-border">
                <Image
                    src="/logo.svg"
                    alt="IndiHealth Logo"
                    width={100}
                    height={50}
                />
                <span className="text-[#008080] font-bold text-[22px]">indiHealth</span>
            </div>
            <nav className="flex-1 overflow-y-auto">
                <ul className="space-y-1 p-4">
                    <li>
                        <Link href="/" className="flex items-center py-2 px-4 text-foreground hover:bg-accent rounded-md">
                            <Home className="mr-2 h-4 w-4" />Dashboard Home
                        </Link>
                    </li>
                    <li>
                        <Link href="/patient/all" className="flex item s-center py-2 px-4 text-foreground hover:bg-accent rounded-md">
                            <User className="mr-2 h-4 w-4" />All Patients
                        </Link>
                    </li>
                    <li>
                        <Link href="/token" className="flex item s-center py-2 px-4 text-foreground hover:bg-accent rounded-md">
                            <Key className="mr-2 h-4 w-4" />Tokens
                        </Link>
                    </li>
                    <li>
                        <button
                            className="w-full text-left flex items-center py-2 px-4 text-foreground hover:bg-accent rounded-md"
                            onClick={() => toggleSection('Bed-Allocation')}
                        >
                            <Bed className="mr-2 h-4 w-4" />
                            <span className="flex-1 text-left">Bed Allocation</span>
                            {openSection === 'Bed-Allocation' ? (
                                <ChevronUp className="h-4 w-4" />
                            ) : (
                                <ChevronDown className="h-4 w-4" />
                            )}
                        </button>
                        <motion.ul
                            className="space-y-1 pl-6 overflow-hidden"
                            initial={{ maxHeight: 0 }}
                            animate={{ maxHeight: openSection === 'Bed-Allocation' ? 200 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <li>
                                <Link href="/bedallocation" className="flex items-center py-2 px-4 text-foreground hover:bg-accent rounded-md">
                                    Available beds
                                </Link>
                            </li>
                            <li>
                                <Link href="/bedallocation/new" className="flex items-center py-2 px-4 text-foreground hover:bg-accent rounded-md">
                                    New Allotment
                                </Link>
                            </li>
                        </motion.ul>
                    </li>
                    <li>
                        <button
                            className="w-full text-left flex items-center py-2 px-4 text-foreground hover:bg-accent rounded-md"
                            onClick={() => toggleSection('admissions')}
                        >
                            <ClipboardList className="mr-2 h-4 w-4" />
                            <span className="flex-1 text-left">Appointments</span>
                            {openSection === 'admissions' ? (
                                <ChevronUp className="h-4 w-4" />
                            ) : (
                                <ChevronDown className="h-4 w-4" />
                            )}
                        </button>
                        <motion.ul
                            className="space-y-1 pl-6 overflow-hidden"
                            initial={{ maxHeight: 0 }}
                            animate={{ maxHeight: openSection === 'admissions' ? 200 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <li>
                                <Link href="/admission/" className="flex items-center py-2 px-4 text-foreground hover:bg-accent rounded-md">
                                    Appointments Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link href="/admission/new" className="flex items-center py-2 px-4 text-foreground hover:bg-accent rounded-md">
                                    New Appointment
                                </Link>
                            </li>
                        </motion.ul>
                    </li>
                    {/* <li>
                        <button
                            className="w-full text-left flex items-center py-2 px-4 text-foreground hover:bg-accent rounded-md"
                            onClick={() => toggleSection('inventory')}
                        >
                            <Package className="mr-2 h-4 w-4" />
                            <span className="flex-1 text-left">Inventory</span>
                            {openSection === 'inventory' ? (
                                <ChevronUp className="h-4 w-4" />
                            ) : (
                                <ChevronDown className="h-4 w-4" />
                            )}
                        </button>
                        <motion.ul
                            className="space-y-1 pl-6 overflow-hidden"
                            initial={{ maxHeight: 0 }}
                            animate={{ maxHeight: openSection === 'inventory' ? 300 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <li>
                                <Link href="/inventory/dashboard" className="flex items-center py-2 px-4 text-foreground hover:bg-accent rounded-md">
                                    Visual Summary
                                </Link>
                            </li>
                            <li>
                                <Link href="/inventory/incoming" className="flex items-center py-2 px-4 text-foreground hover:bg-accent rounded-md">
                                    Incoming Inventory
                                </Link>
                            </li>
                            <li>
                                <Link href="/inventory/outgoing" className="flex items-center py-2 px-4 text-foreground hover:bg-accent rounded-md">
                                    Outgoing Inventory
                                </Link>
                            </li>
                        </motion.ul>
                    </li> */}
                    {/* <li>
                        <Link href="/dispensation" className="flex items-center py-2 px-4 text-foreground hover:bg-accent rounded-md">
                            <Pill className="mr-2 h-4 w-4" />Dispensation
                        </Link>
                    </li>
                    <li>
                        <Link href="/integration-status" className="flex items-center py-2 px-4 text-foreground hover:bg-accent rounded-md">
                            <BarChart className="mr-2 h-4 w-4" />Integration Status
                        </Link>
                    </li>
                    <li>
                        <Link href="/reports" className="flex items-center py-2 px-4 text-foreground hover:bg-accent rounded-md">
                            <FileText className="mr-2 h-4 w-4" />Reports
                        </Link>
                    </li> */}
                    <li>
                        <Link href="/settings" className="flex items-center py-2 px-4 text-foreground hover:bg-accent rounded-md">
                            <Settings className="mr-2 h-4 w-4" />Settings
                        </Link>
                    </li>
                </ul>
            </nav>
        </aside>
    )
}
