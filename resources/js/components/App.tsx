import React, { useState, useEffect } from "react";
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
    const { user, client, token } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [currentModule, setCurrentModule] = useState("dashboard");

    console.log("AppContent - user:", user, "token:", token);

    // Log cookies when user is authenticated and navigates to dashboard
    useEffect(() => {
        if (user && token) {
            const logNavigationCookies = () => {
                console.log("🚀 === NAVIGATION COOKIE CONTENTS ===");
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
                            console.log(
                                `🔑 ${cookieName}:`,
                                cookies[cookieName]
                            );
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
                console.log("🔐 Current token:", token);
                console.log("🚀 === END NAVIGATION COOKIE LOG ===");
            };

            // Log cookies when user navigates to authenticated area
            logNavigationCookies();
        }
    }, [user, token]);

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
