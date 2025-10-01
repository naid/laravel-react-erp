import React, { useState, useEffect } from "react";

interface TimeEntry {
    id: number;
    employee_id: number;
    employee_name: string;
    project_id: number;
    project_name: string;
    task_description: string;
    start_time: string;
    end_time: string;
    duration: number; // in minutes
    date: string;
    status: "draft" | "submitted" | "approved" | "rejected";
    notes: string;
}

const TimeTracking: React.FC = () => {
    const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterProject, setFilterProject] = useState("all");
    const [currentTimer, setCurrentTimer] = useState<{
        isRunning: boolean;
        startTime: Date | null;
        projectId: number | null;
        taskDescription: string;
    }>({
        isRunning: false,
        startTime: null,
        projectId: null,
        taskDescription: "",
    });

    // Mock data for demonstration
    useEffect(() => {
        const mockTimeEntries: TimeEntry[] = [
            {
                id: 1,
                employee_id: 1,
                employee_name: "John Doe",
                project_id: 1,
                project_name: "E-commerce Website Redesign",
                task_description: "Frontend development for product catalog",
                start_time: "09:00",
                end_time: "12:00",
                duration: 180,
                date: "2024-01-15",
                status: "approved",
                notes: "Completed user interface components",
            },
            {
                id: 2,
                employee_id: 1,
                employee_name: "John Doe",
                project_id: 1,
                project_name: "E-commerce Website Redesign",
                task_description: "API integration testing",
                start_time: "13:00",
                end_time: "17:00",
                duration: 240,
                date: "2024-01-15",
                status: "submitted",
                notes: "Tested all API endpoints",
            },
            {
                id: 3,
                employee_id: 2,
                employee_name: "Jane Smith",
                project_id: 2,
                project_name: "Mobile App Development",
                task_description: "UI/UX design review",
                start_time: "10:00",
                end_time: "14:00",
                duration: 240,
                date: "2024-01-15",
                status: "approved",
                notes: "Reviewed design mockups with client",
            },
        ];
        setTimeEntries(mockTimeEntries);
        setLoading(false);
    }, []);

    const filteredEntries = timeEntries.filter((entry) => {
        const matchesSearch =
            entry.employee_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            entry.project_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            entry.task_description
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

        const matchesStatus =
            filterStatus === "all" || entry.status === filterStatus;
        const matchesProject =
            filterProject === "all" ||
            entry.project_id.toString() === filterProject;

        return matchesSearch && matchesStatus && matchesProject;
    });

    const projects = Array.from(
        new Set(
            timeEntries.map((entry) => ({
                id: entry.project_id,
                name: entry.project_name,
            }))
        )
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case "draft":
                return "bg-gray-100 text-gray-800";
            case "submitted":
                return "bg-yellow-100 text-yellow-800";
            case "approved":
                return "bg-green-100 text-green-800";
            case "rejected":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    const totalHours =
        timeEntries.reduce((sum, entry) => sum + entry.duration, 0) / 60;
    const pendingEntries = timeEntries.filter(
        (entry) => entry.status === "submitted"
    ).length;
    const todayEntries = timeEntries.filter(
        (entry) => entry.date === new Date().toISOString().split("T")[0]
    );

    const startTimer = () => {
        if (currentTimer.projectId && currentTimer.taskDescription) {
            setCurrentTimer({
                isRunning: true,
                startTime: new Date(),
                projectId: currentTimer.projectId,
                taskDescription: currentTimer.taskDescription,
            });
        }
    };

    const stopTimer = () => {
        if (currentTimer.isRunning && currentTimer.startTime) {
            const duration = Math.floor(
                (new Date().getTime() - currentTimer.startTime.getTime()) /
                    60000
            );
            // Here you would typically save the time entry
            console.log("Time entry saved:", {
                projectId: currentTimer.projectId,
                taskDescription: currentTimer.taskDescription,
                duration: duration,
            });

            setCurrentTimer({
                isRunning: false,
                startTime: null,
                projectId: null,
                taskDescription: "",
            });
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Time Tracking
                        </h2>
                        <p className="text-gray-600 mt-1">
                            Track time spent on projects and tasks
                        </p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="mt-4 sm:mt-0 bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-700 hover:to-red-700 transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center space-x-2"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                        </svg>
                        <span>Add Entry</span>
                    </button>
                </div>
            </div>

            {/* Timer Section */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Quick Timer
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Project
                        </label>
                        <select
                            value={currentTimer.projectId || ""}
                            onChange={(e) =>
                                setCurrentTimer((prev) => ({
                                    ...prev,
                                    projectId: parseInt(e.target.value) || null,
                                }))
                            }
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                        >
                            <option value="">Select Project</option>
                            {projects.map((project) => (
                                <option key={project.id} value={project.id}>
                                    {project.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Task Description
                        </label>
                        <input
                            type="text"
                            placeholder="What are you working on?"
                            value={currentTimer.taskDescription}
                            onChange={(e) =>
                                setCurrentTimer((prev) => ({
                                    ...prev,
                                    taskDescription: e.target.value,
                                }))
                            }
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                        />
                    </div>
                    <div className="flex items-end">
                        {!currentTimer.isRunning ? (
                            <button
                                onClick={startTimer}
                                disabled={
                                    !currentTimer.projectId ||
                                    !currentTimer.taskDescription
                                }
                                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <span>Start Timer</span>
                            </button>
                        ) : (
                            <button
                                onClick={stopTimer}
                                className="w-full bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 flex items-center justify-center space-x-2"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <span>Stop Timer</span>
                            </button>
                        )}
                    </div>
                </div>
                {currentTimer.isRunning && currentTimer.startTime && (
                    <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-orange-800">
                                    Currently tracking:
                                </p>
                                <p className="text-lg font-semibold text-orange-900">
                                    {currentTimer.taskDescription}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-orange-600">
                                    Started at:
                                </p>
                                <p className="text-lg font-mono text-orange-900">
                                    {currentTimer.startTime.toLocaleTimeString()}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Search
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg
                                    className="h-5 w-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search entries..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status
                        </label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                        >
                            <option value="all">All Status</option>
                            <option value="draft">Draft</option>
                            <option value="submitted">Submitted</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Project
                        </label>
                        <select
                            value={filterProject}
                            onChange={(e) => setFilterProject(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                        >
                            <option value="all">All Projects</option>
                            {projects.map((project) => (
                                <option key={project.id} value={project.id}>
                                    {project.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-orange-100">
                            <svg
                                className="w-6 h-6 text-orange-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">
                                Total Hours
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {totalHours.toFixed(1)}h
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-yellow-100">
                            <svg
                                className="w-6 h-6 text-yellow-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">
                                Pending Approval
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {pendingEntries}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100">
                            <svg
                                className="w-6 h-6 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">
                                Today's Entries
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {todayEntries.length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100">
                            <svg
                                className="w-6 h-6 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">
                                Approved Entries
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {
                                    timeEntries.filter(
                                        (entry) => entry.status === "approved"
                                    ).length
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Time Entries Table */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Time Entries
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Employee
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Project
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Task
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Duration
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredEntries.map((entry) => (
                                <tr key={entry.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                                                <span className="text-xs font-medium text-white">
                                                    {entry.employee_name
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")}
                                                </span>
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {entry.employee_name}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {entry.project_name}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">
                                            {entry.task_description}
                                        </div>
                                        {entry.notes && (
                                            <div className="text-sm text-gray-500 mt-1">
                                                {entry.notes}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(
                                            entry.date
                                        ).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatDuration(entry.duration)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                                entry.status
                                            )}`}
                                        >
                                            {entry.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => {
                                                    setEditingEntry(entry);
                                                    setShowModal(true);
                                                }}
                                                className="text-orange-600 hover:text-orange-900"
                                            >
                                                Edit
                                            </button>
                                            <button className="text-red-600 hover:text-red-900">
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Time Entry Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                {editingEntry
                                    ? "Edit Time Entry"
                                    : "Add New Time Entry"}
                            </h3>
                            <form className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Project
                                        </label>
                                        <select
                                            defaultValue={
                                                editingEntry?.project_id || ""
                                            }
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                                        >
                                            <option value="">
                                                Select Project
                                            </option>
                                            {projects.map((project) => (
                                                <option
                                                    key={project.id}
                                                    value={project.id}
                                                >
                                                    {project.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Date
                                        </label>
                                        <input
                                            type="date"
                                            defaultValue={
                                                editingEntry?.date ||
                                                new Date()
                                                    .toISOString()
                                                    .split("T")[0]
                                            }
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Task Description
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="What did you work on?"
                                        defaultValue={
                                            editingEntry?.task_description || ""
                                        }
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Start Time
                                        </label>
                                        <input
                                            type="time"
                                            defaultValue={
                                                editingEntry?.start_time || ""
                                            }
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            End Time
                                        </label>
                                        <input
                                            type="time"
                                            defaultValue={
                                                editingEntry?.end_time || ""
                                            }
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Notes
                                    </label>
                                    <textarea
                                        defaultValue={editingEntry?.notes || ""}
                                        rows={3}
                                        placeholder="Additional notes..."
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Status
                                    </label>
                                    <select
                                        defaultValue={
                                            editingEntry?.status || "draft"
                                        }
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="submitted">
                                            Submitted
                                        </option>
                                        <option value="approved">
                                            Approved
                                        </option>
                                        <option value="rejected">
                                            Rejected
                                        </option>
                                    </select>
                                </div>
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false);
                                            setEditingEntry(null);
                                        }}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700"
                                    >
                                        {editingEntry ? "Update" : "Add"} Entry
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TimeTracking;
