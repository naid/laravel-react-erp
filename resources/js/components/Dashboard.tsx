import React from "react";
import { useAuth } from "./contexts/AuthContext";

const Dashboard: React.FC = () => {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navigation */}
            <nav className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-semibold text-gray-900">
                                ERP System
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-700">
                                Welcome, {user?.first_name} {user?.last_name}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Welcome to the Dashboard!
                            </h2>
                            <p className="text-gray-600">
                                You have successfully logged in to the ERP
                                System.
                            </p>
                            <div className="mt-6">
                                <div className="bg-white shadow rounded-lg p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        User Information
                                    </h3>
                                    <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Email
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {user?.email}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Full Name
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {user?.first_name}{" "}
                                                {user?.last_name}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                User ID
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {user?.id}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Roles
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {user?.roles?.length
                                                    ? user.roles
                                                          .map(
                                                              (role) =>
                                                                  role.name
                                                          )
                                                          .join(", ")
                                                    : "No roles assigned"}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
