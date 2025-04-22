import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button'; // Adjust path if needed

// Assume themeColors and helpers are defined or imported
const themeColors = { brandPurple: '#5a239e', /* ... */ };
const formatDate = (dateString) => { /* ... */ };

// Simple Pagination Component (Example)
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;
    const pages = [];
    for (let i = 1; i <= totalPages; i++) { pages.push(i); }

    return (
        <div className="mt-4 flex justify-center items-center space-x-1">
            <Button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1} variant="outlineSm" className="text-xs px-2 py-1">Prev</Button>
            {/* Consider showing only a subset of page numbers for many pages */}
            {pages.map(p => (
                <Button key={p} onClick={() => onPageChange(p)} variant={p === currentPage ? 'brand' : 'outlineSm'} className="text-xs px-2 py-1 w-7 h-7">
                    {p}
                </Button>
            ))}
            <Button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages} variant="outlineSm" className="text-xs px-2 py-1">Next</Button>
        </div>
    );
};


const AllTasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('pending'); // Default to pending
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const pageSize = 15; // Items per page

    const fetchTasks = useCallback(async () => {
        setIsLoading(true); setError(null);
        const token = localStorage.getItem('authToken');
        if (!token) { setError("Authentication error"); setIsLoading(false); return; }

        const params = new URLSearchParams();
        if (statusFilter !== 'all') params.append('status', statusFilter);
        params.append('page', currentPage.toString());
        params.append('limit', pageSize.toString());

        try {
            const response = await fetch(`https://api.goclientwise.com/api/tasks?${params.toString()}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch tasks');
            const data = await response.json(); // Expect PaginatedResponse
            setTasks(data.items || []);
            setTotalItems(data.totalItems || 0);
            setCurrentPage(data.currentPage || 1);
            setTotalPages(data.totalPages || 1);
        } catch (err) { setError(err.message); setTasks([]); }
        finally { setIsLoading(false); }
    }, [statusFilter, currentPage, pageSize]); // Refetch on filter/page change

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleStatusChange = (e) => {
        setStatusFilter(e.target.value);
        setCurrentPage(1); // Reset to page 1 when filter changes
    };

    // Placeholder
    const handleCompleteTask = (taskId) => {
        alert(`Complete Task ${taskId} - Not Implemented`);
        // TODO: Implement API call (e.g., PUT /api/tasks/{taskId}/complete) and refresh
    };

    return (
        <div style={{'--brand-purple': themeColors.brandPurple}}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">All Tasks</h2>
                <Link to="/dashboard" className="text-sm text-purple-600 hover:underline"> Back to Dashboard </Link>
            </div>

             {/* Filters */}
             <div className="mb-4 flex items-center space-x-2">
                 <label htmlFor="status-filter" className="text-sm font-medium text-gray-700">Show:</label>
                 <select
                    id="status-filter"
                    value={statusFilter}
                    onChange={handleStatusChange}
                    className="form-select rounded-md shadow-sm text-sm py-1"
                    disabled={isLoading}
                 >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="all">All</option>
                 </select>
            </div>

            {isLoading && <div className="text-center p-6"><i className="fas fa-spinner fa-spin text-2xl text-[--brand-purple]"></i></div>}
            {error && <div className="text-red-600 bg-red-100 p-3 rounded">{error}</div>}

            {!isLoading && !error && (
                <>
                <div className="bg-white rounded-lg shadow overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                         <thead>
                            <tr className="bg-gray-50">
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client ID</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                         <tbody className="divide-y divide-gray-200">
                            {tasks.length === 0 ? (
                                <tr><td colSpan="5" className="text-center py-10 text-gray-500 italic">No tasks found matching filters.</td></tr>
                            ) : (
                                tasks.map(task => (
                                    <tr key={task.id} className={`hover:bg-gray-50 ${task.isCompleted ? 'opacity-60' : ''}`}>
                                        <td className={`px-4 py-3 whitespace-normal text-sm ${task.isUrgent && !task.isCompleted ? 'font-medium text-red-700' : 'text-gray-800'}`}>
                                            {task.isUrgent && !task.isCompleted && <i className="fas fa-exclamation-circle mr-1 text-red-500"></i>}
                                            {task.description}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                            {task.clientId ? <Link to={`/dashboard/clients/${task.clientId}`} className="text-purple-600 hover:underline">{task.clientId}</Link> : 'N/A'}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{formatDate(task.dueDate?.String)}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                            {task.isCompleted ? <span className="text-green-700">Completed</span> : <span className="text-yellow-700">Pending</span>}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                                            {!task.isCompleted && (
                                                <Button onClick={() => handleCompleteTask(task.id)} variant="outlineSm" className="text-xs text-green-600 border-green-300 hover:bg-green-50">
                                                    Mark Done
                                                </Button>
                                            )}
                                            {/* Add Edit/Delete later */}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                </>
            )}
        </div>
    );
};

export default AllTasksPage;
