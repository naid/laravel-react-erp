import React, { useState } from "react";

const Settings: React.FC = () => {
    const [activeTab, setActiveTab] = useState("general");
    const [settings, setSettings] = useState({
        general: {
            companyName: "ERP System Inc",
            companyEmail: "admin@erpsystem.com",
            timezone: "UTC-5",
            dateFormat: "MM/DD/YYYY",
            currency: "USD",
            language: "en",
        },
        notifications: {
            emailNotifications: true,
            projectUpdates: true,
            timeTrackingReminders: true,
            clientNotifications: false,
            systemAlerts: true,
        },
        security: {
            twoFactorAuth: false,
            sessionTimeout: 30,
            passwordExpiry: 90,
            loginAttempts: 5,
            ipWhitelist: "",
        },
        integrations: {
            googleCalendar: false,
            slackIntegration: false,
            githubIntegration: false,
            dropboxIntegration: false,
        },
    });

    const handleSettingChange = (category: string, key: string, value: any) => {
        setSettings((prev) => ({
            ...prev,
            [category]: {
                ...prev[category as keyof typeof prev],
                [key]: value,
            },
        }));
    };

    const tabs = [
        { id: "general", name: "General", icon: "⚙️" },
        { id: "notifications", name: "Notifications", icon: "🔔" },
        { id: "security", name: "Security", icon: "🔒" },
        { id: "integrations", name: "Integrations", icon: "🔗" },
        { id: "users", name: "Users", icon: "👥" },
        { id: "billing", name: "Billing", icon: "💳" },
    ];

    const renderGeneralSettings = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Company Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Company Name
                        </label>
                        <input
                            type="text"
                            value={settings.general.companyName}
                            onChange={(e) =>
                                handleSettingChange(
                                    "general",
                                    "companyName",
                                    e.target.value
                                )
                            }
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Company Email
                        </label>
                        <input
                            type="email"
                            value={settings.general.companyEmail}
                            onChange={(e) =>
                                handleSettingChange(
                                    "general",
                                    "companyEmail",
                                    e.target.value
                                )
                            }
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Timezone
                        </label>
                        <select
                            value={settings.general.timezone}
                            onChange={(e) =>
                                handleSettingChange(
                                    "general",
                                    "timezone",
                                    e.target.value
                                )
                            }
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="UTC-5">UTC-5 (EST)</option>
                            <option value="UTC-6">UTC-6 (CST)</option>
                            <option value="UTC-7">UTC-7 (MST)</option>
                            <option value="UTC-8">UTC-8 (PST)</option>
                            <option value="UTC+0">UTC+0 (GMT)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date Format
                        </label>
                        <select
                            value={settings.general.dateFormat}
                            onChange={(e) =>
                                handleSettingChange(
                                    "general",
                                    "dateFormat",
                                    e.target.value
                                )
                            }
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Currency
                        </label>
                        <select
                            value={settings.general.currency}
                            onChange={(e) =>
                                handleSettingChange(
                                    "general",
                                    "currency",
                                    e.target.value
                                )
                            }
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="GBP">GBP (£)</option>
                            <option value="CAD">CAD (C$)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Language
                        </label>
                        <select
                            value={settings.general.language}
                            onChange={(e) =>
                                handleSettingChange(
                                    "general",
                                    "language",
                                    e.target.value
                                )
                            }
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderNotificationSettings = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Email Notifications
                </h3>
                <div className="space-y-4">
                    {Object.entries(settings.notifications).map(
                        ([key, value]) => (
                            <div
                                key={key}
                                className="flex items-center justify-between"
                            >
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 capitalize">
                                        {key
                                            .replace(/([A-Z])/g, " $1")
                                            .toLowerCase()}
                                    </h4>
                                    <p className="text-sm text-gray-500">
                                        {key === "emailNotifications" &&
                                            "Receive email notifications for important updates"}
                                        {key === "projectUpdates" &&
                                            "Get notified when projects are updated"}
                                        {key === "timeTrackingReminders" &&
                                            "Receive reminders to log time"}
                                        {key === "clientNotifications" &&
                                            "Get notified about client activities"}
                                        {key === "systemAlerts" &&
                                            "Receive system alerts and maintenance notifications"}
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={value as boolean}
                                        onChange={(e) =>
                                            handleSettingChange(
                                                "notifications",
                                                key,
                                                e.target.checked
                                            )
                                        }
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                </label>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );

    const renderSecuritySettings = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Security Settings
                </h3>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-sm font-medium text-gray-900">
                                Two-Factor Authentication
                            </h4>
                            <p className="text-sm text-gray-500">
                                Add an extra layer of security to your account
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.security.twoFactorAuth}
                                onChange={(e) =>
                                    handleSettingChange(
                                        "security",
                                        "twoFactorAuth",
                                        e.target.checked
                                    )
                                }
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Session Timeout (minutes)
                            </label>
                            <input
                                type="number"
                                value={settings.security.sessionTimeout}
                                onChange={(e) =>
                                    handleSettingChange(
                                        "security",
                                        "sessionTimeout",
                                        parseInt(e.target.value)
                                    )
                                }
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password Expiry (days)
                            </label>
                            <input
                                type="number"
                                value={settings.security.passwordExpiry}
                                onChange={(e) =>
                                    handleSettingChange(
                                        "security",
                                        "passwordExpiry",
                                        parseInt(e.target.value)
                                    )
                                }
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Max Login Attempts
                            </label>
                            <input
                                type="number"
                                value={settings.security.loginAttempts}
                                onChange={(e) =>
                                    handleSettingChange(
                                        "security",
                                        "loginAttempts",
                                        parseInt(e.target.value)
                                    )
                                }
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                IP Whitelist
                            </label>
                            <input
                                type="text"
                                placeholder="192.168.1.1, 10.0.0.1"
                                value={settings.security.ipWhitelist}
                                onChange={(e) =>
                                    handleSettingChange(
                                        "security",
                                        "ipWhitelist",
                                        e.target.value
                                    )
                                }
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderIntegrationSettings = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Third-Party Integrations
                </h3>
                <div className="space-y-4">
                    {Object.entries(settings.integrations).map(
                        ([key, value]) => (
                            <div
                                key={key}
                                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                            >
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                                        <span className="text-lg">
                                            {key === "googleCalendar" && "📅"}
                                            {key === "slackIntegration" && "💬"}
                                            {key === "githubIntegration" &&
                                                "🐙"}
                                            {key === "dropboxIntegration" &&
                                                "📁"}
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900 capitalize">
                                            {key
                                                .replace(/([A-Z])/g, " $1")
                                                .toLowerCase()}
                                        </h4>
                                        <p className="text-sm text-gray-500">
                                            {key === "googleCalendar" &&
                                                "Sync with Google Calendar"}
                                            {key === "slackIntegration" &&
                                                "Send notifications to Slack"}
                                            {key === "githubIntegration" &&
                                                "Connect with GitHub repositories"}
                                            {key === "dropboxIntegration" &&
                                                "Sync files with Dropbox"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <span
                                        className={`text-sm ${
                                            value
                                                ? "text-green-600"
                                                : "text-gray-500"
                                        }`}
                                    >
                                        {value ? "Connected" : "Not connected"}
                                    </span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={value as boolean}
                                            onChange={(e) =>
                                                handleSettingChange(
                                                    "integrations",
                                                    key,
                                                    e.target.checked
                                                )
                                            }
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                    </label>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );

    const renderUserManagement = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                        User Management
                    </h3>
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">
                        Add User
                    </button>
                </div>
                <div className="space-y-3">
                    {[
                        {
                            name: "John Doe",
                            email: "john@company.com",
                            role: "Admin",
                            status: "Active",
                        },
                        {
                            name: "Jane Smith",
                            email: "jane@company.com",
                            role: "Manager",
                            status: "Active",
                        },
                        {
                            name: "Mike Johnson",
                            email: "mike@company.com",
                            role: "Employee",
                            status: "Inactive",
                        },
                    ].map((user, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                        >
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-sm font-medium text-white">
                                        {user.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </span>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-900">
                                        {user.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {user.email}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-600">
                                    {user.role}
                                </span>
                                <span
                                    className={`text-sm px-2 py-1 rounded-full ${
                                        user.status === "Active"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                    }`}
                                >
                                    {user.status}
                                </span>
                                <button className="text-indigo-600 hover:text-indigo-900 text-sm">
                                    Edit
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderBillingSettings = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Billing Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">
                            Current Plan
                        </h4>
                        <div className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-lg font-semibold text-gray-900">
                                    Professional
                                </span>
                                <span className="text-2xl font-bold text-indigo-600">
                                    $99/month
                                </span>
                            </div>
                            <p className="text-sm text-gray-600">
                                Up to 50 users, unlimited projects
                            </p>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">
                            Usage This Month
                        </h4>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">
                                    Users
                                </span>
                                <span className="text-sm font-medium text-gray-900">
                                    12 / 50
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">
                                    Projects
                                </span>
                                <span className="text-sm font-medium text-gray-900">
                                    15 / Unlimited
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">
                                    Storage
                                </span>
                                <span className="text-sm font-medium text-gray-900">
                                    2.5 GB / 100 GB
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case "general":
                return renderGeneralSettings();
            case "notifications":
                return renderNotificationSettings();
            case "security":
                return renderSecuritySettings();
            case "integrations":
                return renderIntegrationSettings();
            case "users":
                return renderUserManagement();
            case "billing":
                return renderBillingSettings();
            default:
                return renderGeneralSettings();
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Settings
                        </h2>
                        <p className="text-gray-600 mt-1">
                            Manage your system configuration and preferences
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0">
                        <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200">
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>

            {/* Settings Navigation */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <div className="flex flex-wrap gap-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 ${
                                activeTab === tab.id
                                    ? "bg-indigo-100 text-indigo-700 border-2 border-indigo-200"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            <span>{tab.icon}</span>
                            <span>{tab.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Settings Content */}
            {renderTabContent()}
        </div>
    );
};

export default Settings;
