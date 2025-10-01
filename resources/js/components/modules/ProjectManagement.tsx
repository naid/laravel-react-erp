import React, { useState, useEffect } from "react";

interface Project {
    id: number;
    name: string;
    description: string;
    client_id: number;
    client_name: string;
    manager_id: number;
    manager_name: string;
    status: "planning" | "in_progress" | "on_hold" | "completed" | "cancelled";
    priority: "low" | "medium" | "high" | "urgent";
    start_date: string;
    end_date: string;
    budget: number;
    progress: number;
    team_members: string[];
}

const ProjectManagement: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterPriority, setFilterPriority] = useState("all");

    // Mock data for demonstration
    useEffect(() => {
        const mockProjects: Project[] = [
            {
                id: 1,
                name: "E-commerce Website Redesign",
                description:
                    "Complete redesign of the company's e-commerce platform with modern UI/UX",
                client_id: 1,
                client_name: "TechCorp Solutions",
                manager_id: 1,
                manager_name: "John Doe",
                status: "in_progress",
                priority: "high",
                start_date: "2024-01-01",
                end_date: "2024-03-31",
                budget: 50000,
                progress: 65,
                team_members: ["John Doe", "Jane Smith", "Mike Johnson"],
            },
            {
                id: 2,
                name: "Mobile App Development",
                description: "Native mobile app for iOS and Android platforms",
                client_id: 2,
                client_name: "Global Manufacturing Inc",
                manager_id: 2,
                manager_name: "Jane Smith",
                status: "planning",
                priority: "medium",
                start_date: "2024-02-01",
                end_date: "2024-06-30",
                budget: 75000,
                progress: 15,
                team_members: ["Jane Smith", "Mike Johnson"],
            },
            {
                id: 3,
                name: "Data Analytics Dashboard",
                description:
                    "Real-time analytics dashboard for business intelligence",
                client_id: 3,
                client_name: "Creative Agency Ltd",
                manager_id: 1,
                manager_name: "John Doe",
                status: "completed",
                priority: "low",
                start_date: "2023-10-01",
                end_date: "2023-12-31",
                budget: 30000,
                progress: 100,
                team_members: ["John Doe", "Mike Johnson"],
            },
        ];
        setProjects(mockProjects);
        setLoading(false);
    }, []);

    const filteredProjects = projects.filter((project) => {
        const matchesSearch =
            project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.description
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            project.client_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            project.manager_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

        const matchesStatus =
            filterStatus === "all" || project.status === filterStatus;
        const matchesPriority =
            filterPriority === "all" || project.priority === filterPriority;

        return matchesSearch && matchesStatus && matchesPriority;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case "planning":
                return "bg-blue-100 text-blue-800";
            case "in_progress":
                return "bg-yellow-100 text-yellow-800";
            case "on_hold":
                return "bg-orange-100 text-orange-800";
            case "completed":
                return "bg-green-100 text-green-800";
            case "cancelled":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "urgent":
                return "bg-red-100 text-red-800";
            case "high":
                return "bg-orange-100 text-orange-800";
            case "medium":
                return "bg-yellow-100 text-yellow-800";
            case "low":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const totalBudget = projects.reduce(
        (sum, project) => sum + project.budget,
        0
    );
    const activeProjects = projects.filter(
        (project) => project.status === "in_progress"
    ).length;
    const completedProjects = projects.filter(
        (project) => project.status === "completed"
    ).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Project Management
                        </h2>
                        <p className="text-gray-600 mt-1">
                            Track and manage all your projects
                        </p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="mt-4 sm:mt-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center space-x-2"
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
                        <span>New Project</span>
                    </button>
                </div>
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
                                placeholder="Search projects..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
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
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        >
                            <option value="all">All Status</option>
                            <option value="planning">Planning</option>
                            <option value="in_progress">In Progress</option>
                            <option value="on_hold">On Hold</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Priority
                        </label>
                        <select
                            value={filterPriority}
                            onChange={(e) => setFilterPriority(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        >
                            <option value="all">All Priorities</option>
                            <option value="urgent">Urgent</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-purple-100">
                            <svg
                                className="w-6 h-6 text-purple-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">
                                Total Projects
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {projects.length}
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
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">
                                Active Projects
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {activeProjects}
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
                                Completed
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {completedProjects}
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
                                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                                />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">
                                Total Budget
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                ${totalBudget.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Project Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                    <div
                        key={project.id}
                        className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-200"
                    >
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {project.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        {project.description}
                                    </p>
                                </div>
                                <div className="flex space-x-2 ml-4">
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                            project.status
                                        )}`}
                                    >
                                        {project.status.replace("_", " ")}
                                    </span>
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                                            project.priority
                                        )}`}
                                    >
                                        {project.priority}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">
                                        Client:
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        {project.client_name}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">
                                        Manager:
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        {project.manager_name}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">
                                        Budget:
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        ${project.budget.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">
                                        Timeline:
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        {new Date(
                                            project.start_date
                                        ).toLocaleDateString()}{" "}
                                        -{" "}
                                        {new Date(
                                            project.end_date
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-4">
                                <div className="flex items-center justify-between text-sm mb-2">
                                    <span className="text-gray-500">
                                        Progress
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        {project.progress}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                                        style={{
                                            width: `${project.progress}%`,
                                        }}
                                    ></div>
                                </div>
                            </div>

                            {/* Team Members */}
                            <div className="mt-4">
                                <div className="text-sm text-gray-500 mb-2">
                                    Team Members:
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {project.team_members.map(
                                        (member, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                                            >
                                                {member}
                                            </span>
                                        )
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-6 flex space-x-2">
                                <button
                                    onClick={() => {
                                        setEditingProject(project);
                                        setShowModal(true);
                                    }}
                                    className="flex-1 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors duration-200"
                                >
                                    Edit
                                </button>
                                <button className="flex-1 bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors duration-200">
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add/Edit Project Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                {editingProject
                                    ? "Edit Project"
                                    : "Add New Project"}
                            </h3>
                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Project Name
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue={
                                            editingProject?.name || ""
                                        }
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Description
                                    </label>
                                    <textarea
                                        defaultValue={
                                            editingProject?.description || ""
                                        }
                                        rows={3}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Client
                                        </label>
                                        <select
                                            defaultValue={
                                                editingProject?.client_id || ""
                                            }
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                        >
                                            <option value="">
                                                Select Client
                                            </option>
                                            <option value="1">
                                                TechCorp Solutions
                                            </option>
                                            <option value="2">
                                                Global Manufacturing Inc
                                            </option>
                                            <option value="3">
                                                Creative Agency Ltd
                                            </option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Manager
                                        </label>
                                        <select
                                            defaultValue={
                                                editingProject?.manager_id || ""
                                            }
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                        >
                                            <option value="">
                                                Select Manager
                                            </option>
                                            <option value="1">John Doe</option>
                                            <option value="2">
                                                Jane Smith
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Status
                                        </label>
                                        <select
                                            defaultValue={
                                                editingProject?.status ||
                                                "planning"
                                            }
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                        >
                                            <option value="planning">
                                                Planning
                                            </option>
                                            <option value="in_progress">
                                                In Progress
                                            </option>
                                            <option value="on_hold">
                                                On Hold
                                            </option>
                                            <option value="completed">
                                                Completed
                                            </option>
                                            <option value="cancelled">
                                                Cancelled
                                            </option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Priority
                                        </label>
                                        <select
                                            defaultValue={
                                                editingProject?.priority ||
                                                "medium"
                                            }
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">
                                                Medium
                                            </option>
                                            <option value="high">High</option>
                                            <option value="urgent">
                                                Urgent
                                            </option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Budget
                                        </label>
                                        <input
                                            type="number"
                                            defaultValue={
                                                editingProject?.budget || ""
                                            }
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Start Date
                                        </label>
                                        <input
                                            type="date"
                                            defaultValue={
                                                editingProject?.start_date || ""
                                            }
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            End Date
                                        </label>
                                        <input
                                            type="date"
                                            defaultValue={
                                                editingProject?.end_date || ""
                                            }
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false);
                                            setEditingProject(null);
                                        }}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
                                    >
                                        {editingProject ? "Update" : "Add"}{" "}
                                        Project
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

export default ProjectManagement;
