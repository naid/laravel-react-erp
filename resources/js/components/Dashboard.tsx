import React, { useEffect } from "react";
import { useAuth } from "./contexts/AuthContext";

const Dashboard: React.FC = () => {
    const { user, client, logout } = useAuth();

    // Log cookies when Dashboard component mounts
    useEffect(() => {
        const logCookies = () => {
            console.log("🏠 === DASHBOARD COOKIE CONTENTS ===");
            console.log("All cookies:", document.cookie);

            if (document.cookie) {
                const cookies = document.cookie
                    .split(";")
                    .reduce((acc, cookie) => {
                        const [key, value] = cookie.trim().split("=");
                        acc[key] = value;
                        return acc;
                    }, {} as Record<string, string>);

                console.log("Parsed cookies:", cookies);

                // Log specific Laravel cookies
                Object.keys(cookies).forEach((cookieName) => {
                    if (
                        cookieName.includes("laravel") ||
                        cookieName.includes("session") ||
                        cookieName.includes("sanctum") ||
                        cookieName.includes("csrf")
                    ) {
                        console.log(`🔑 ${cookieName}:`, cookies[cookieName]);
                    }
                });
            } else {
                console.log("No cookies found");
            }

            console.log(
                "📱 Local Storage token:",
                localStorage.getItem("token")
            );
            console.log("👤 Current user:", user);
            console.log("🏢 Current client:", client);
            console.log("🏠 === END DASHBOARD COOKIE LOG ===");
        };

        // Log cookies when dashboard loads
        logCookies();
    }, [user]);

    const handleLogout = async () => {
        await logout();
        window.location.reload();
    };

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Welcome back, {user?.first_name}!
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Here's what's happening with your business today.
                        </p>
                        {client && (
                            <div className="mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm inline-block">
                                🏢 {client.name}
                            </div>
                        )}
                    </div>
                    <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                        <div className="hidden sm:flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-white">
                                    {user?.first_name?.charAt(0)}
                                    {user?.last_name?.charAt(0)}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">
                                    {user?.first_name} {user?.last_name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {user?.email}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors duration-200"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                                />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">
                                Total Employees
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                24
                            </p>
                            <p className="text-sm text-green-600">
                                +2 from last month
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
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">
                                Active Clients
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                12
                            </p>
                            <p className="text-sm text-green-600">
                                +3 this month
                            </p>
                        </div>
                    </div>
                </div>

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
                                Active Projects
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                8
                            </p>
                            <p className="text-sm text-blue-600">
                                3 in progress
                            </p>
                        </div>
                    </div>
                </div>

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
                                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                                />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">
                                Revenue
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                $45,230
                            </p>
                            <p className="text-sm text-green-600">
                                +12.5% from last month
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Quick Actions
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <svg
                                    className="w-5 h-5 text-blue-600"
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
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">
                                    Add Employee
                                </p>
                                <p className="text-sm text-gray-500">
                                    Create new team member
                                </p>
                            </div>
                        </div>
                    </button>

                    <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <svg
                                    className="w-5 h-5 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">
                                    Add Client
                                </p>
                                <p className="text-sm text-gray-500">
                                    Register new client
                                </p>
                            </div>
                        </div>
                    </button>

                    <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <svg
                                    className="w-5 h-5 text-purple-600"
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
                            <div>
                                <p className="font-medium text-gray-900">
                                    New Project
                                </p>
                                <p className="text-sm text-gray-500">
                                    Start a new project
                                </p>
                            </div>
                        </div>
                    </button>

                    <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <svg
                                    className="w-5 h-5 text-orange-600"
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
                            <div>
                                <p className="font-medium text-gray-900">
                                    Log Time
                                </p>
                                <p className="text-sm text-gray-500">
                                    Track work hours
                                </p>
                            </div>
                        </div>
                    </button>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Recent Projects
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <div>
                                    <p className="font-medium text-gray-900">
                                        E-commerce Website
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        TechCorp Solutions
                                    </p>
                                </div>
                            </div>
                            <span className="text-sm text-gray-500">65%</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                <div>
                                    <p className="font-medium text-gray-900">
                                        Mobile App
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Global Manufacturing
                                    </p>
                                </div>
                            </div>
                            <span className="text-sm text-gray-500">30%</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <div>
                                    <p className="font-medium text-gray-900">
                                        Analytics Dashboard
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Creative Agency
                                    </p>
                                </div>
                            </div>
                            <span className="text-sm text-gray-500">90%</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Upcoming Deadlines
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                            <div>
                                <p className="font-medium text-gray-900">
                                    Project Alpha
                                </p>
                                <p className="text-sm text-gray-500">
                                    Due in 2 days
                                </p>
                            </div>
                            <span className="text-sm font-medium text-red-600">
                                Urgent
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                            <div>
                                <p className="font-medium text-gray-900">
                                    Client Meeting
                                </p>
                                <p className="text-sm text-gray-500">
                                    Tomorrow at 2 PM
                                </p>
                            </div>
                            <span className="text-sm font-medium text-yellow-600">
                                High
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                            <div>
                                <p className="font-medium text-gray-900">
                                    Report Submission
                                </p>
                                <p className="text-sm text-gray-500">
                                    Next week
                                </p>
                            </div>
                            <span className="text-sm font-medium text-blue-600">
                                Medium
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
