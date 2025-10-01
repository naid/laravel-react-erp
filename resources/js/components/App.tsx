import React, { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Sidebar from "./Sidebar";
import EmployeeManagement from "./modules/EmployeeManagement";
import ClientManagement from "./modules/ClientManagement";
import ProjectManagement from "./modules/ProjectManagement";
import TimeTracking from "./modules/TimeTracking";
import ReportsAnalytics from "./modules/ReportsAnalytics";
import Settings from "./modules/Settings";

const AppContent: React.FC = () => {
    const { user, token } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [currentModule, setCurrentModule] = useState("dashboard");

    console.log("AppContent - user:", user, "token:", token);

    // Show login page if user is not authenticated
    if (!user || !token) {
        return <Login />;
    }

    // Render the appropriate module
    const renderModule = () => {
        switch (currentModule) {
            case "dashboard":
                return <Dashboard />;
            case "employees":
                return <EmployeeManagement />;
            case "clients":
                return <ClientManagement />;
            case "projects":
                return <ProjectManagement />;
            case "time-tracking":
                return <TimeTracking />;
            case "reports":
                return <ReportsAnalytics />;
            case "settings":
                return <Settings />;
            default:
                return <Dashboard />;
        }
    };

    // Show main application with sidebar if user is authenticated
    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                currentModule={currentModule}
                onModuleChange={setCurrentModule}
            />

            <div className="flex-1 lg:ml-0">
                {/* Mobile header */}
                <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="text-gray-500 hover:text-gray-600"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                </div>

                {/* Main content */}
                <main className="p-4 lg:p-6">{renderModule()}</main>
            </div>
        </div>
    );
};

const App: React.FC = () => {
    console.log("App component rendering");
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};

export default App;
