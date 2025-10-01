import React from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./Login";
import Dashboard from "./Dashboard";

const AppContent: React.FC = () => {
    const { user, token } = useAuth();

    console.log("AppContent - user:", user, "token:", token);

    // Show login page if user is not authenticated
    if (!user || !token) {
        return <Login />;
    }

    // Show dashboard if user is authenticated
    return <Dashboard />;
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
