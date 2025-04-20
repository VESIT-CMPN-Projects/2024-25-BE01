import React, { useState, useMemo } from 'react';
import Pagination from 'react-paginate';
import StatusBadge from './StatusBadge';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';


const statusOptions = ['registered', 'confirmed', 'waiting', 'completed', 'cancelled'];

const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
        case 'registered':
            return 'bg-yellow-100 text-yellow-800';
        case 'confirmed':
            return 'bg-green-100 text-green-800';
        case 'waiting':
            return 'bg-blue-100 text-blue-800';
        case 'completed':
            return 'bg-gray-100 text-gray-800';
        case 'cancelled':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const OpdsSection = ({
    departmentInfo,
    showOpds,
    setShowOpds,
    handleInputChange,
    handleStatusChange
}) => {
    const [currentOpdPage, setCurrentOpdPage] = useState(0);
    const [searchOpds, setSearchOpds] = useState('');
    const postsPerPage = 5;

    const paginateOpds = ({ selected }) => {
        setCurrentOpdPage(selected);
    };

    // Filter OPDs based on search query
    const filteredOpds = useMemo(() => departmentInfo.opds.filter(opd =>
        opd.pname.toLowerCase().includes(searchOpds.toLowerCase()) ||
        opd.pid.includes(searchOpds) ||
        opd.doctorId.toLowerCase().includes(searchOpds.toLowerCase()) ||
        opd.status.toLowerCase().includes(searchOpds.toLowerCase())
    ), [departmentInfo.opds, searchOpds]);

    const indexOfLastOpd = (currentOpdPage + 1) * postsPerPage;
    const indexOfFirstOpd = indexOfLastOpd - postsPerPage;
    const currentOpds = filteredOpds.slice(indexOfFirstOpd, indexOfLastOpd);

    return (
        <div className="p-4 rounded-lg shadow-md bg-zinc-100">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowOpds(!showOpds)}>
                <h2 className="text-xl font-semibold">OPDs</h2>
                {showOpds ? (
                    <ChevronUpIcon className="h-6 w-6 text-gray-500" />
                ) : (
                    <ChevronDownIcon className="h-6 w-6 text-gray-500" />
                )}
            </div>
            {showOpds && (
                <>
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Search in OPDs..."
                            value={searchOpds}
                            onChange={(e) => setSearchOpds(e.target.value)}
                            className="border border-gray-300 rounded-md px-2 py-1 w-full mt-2"
                        />
                    </div>
                    <table className="min-w-full divide-y divide-gray-200 mt-4">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OPD ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Triage Level</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentOpds.map((opd, index) => (
                                <tr key={opd.id} className='hover:bg-zinc-100'>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{opd.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <input
                                            type="text"
                                            value={opd.pname}
                                            onChange={(e) => handleInputChange(e, 'opds', indexOfFirstOpd + index, 'pname')}
                                            className="border border-gray-300 rounded-md px-2 py-1"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <input
                                            type="text"
                                            value={opd.pid}
                                            onChange={(e) => handleInputChange(e, 'opds', indexOfFirstOpd + index, 'pid')}
                                            className="border border-gray-300 rounded-md px-2 py-1"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <input
                                            type="text"
                                            value={opd.doctorId}
                                            onChange={(e) => handleInputChange(e, 'opds', indexOfFirstOpd + index, 'doctorId')}
                                            className="border border-gray-300 rounded-md px-2 py-1"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <select
                                            value={opd.status}
                                            onChange={(e) => handleStatusChange(e, 'opds', indexOfFirstOpd + index)}
                                            className={`border border-gray-300 rounded-md px-2 py-1 ${getStatusColor(opd.status)}`}
                                        >
                                            {statusOptions.map((statusOption) => (
                                                <option key={statusOption} value={statusOption}>{statusOption}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{opd.triageLevel}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{opd.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{opd.time}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{opd.createdAt}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pagination
                        pageCount={Math.ceil(filteredOpds.length / postsPerPage)}
                        onPageChange={paginateOpds}
                        containerClassName="pagination"
                        pageClassName="page-item"
                        pageLinkClassName="page-link"
                        previousClassName="page-item"
                        previousLinkClassName="page-link"
                        nextClassName="page-item"
                        nextLinkClassName="page-link"
                        activeClassName="active"
                    />
                </>
            )}
        </div>
    );
};

export default OpdsSection;
