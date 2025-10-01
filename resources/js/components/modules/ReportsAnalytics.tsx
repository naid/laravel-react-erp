import React, { useState, useEffect } from "react";

interface ReportData {
    id: number;
    name: string;
    type: "financial" | "project" | "employee" | "client";
    description: string;
    generated_date: string;
    data: any;
}

const ReportsAnalytics: React.FC = () => {
    const [reports, setReports] = useState<ReportData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState<string>("overview");
    const [dateRange, setDateRange] = useState("30");

    // Mock data for demonstration
    useEffect(() => {
        const mockReports: ReportData[] = [
            {
                id: 1,
                name: "Monthly Revenue Report",
                type: "financial",
                description: "Revenue breakdown by project and client",
                generated_date: "2024-01-15",
                data: {
                    totalRevenue: 250000,
                    monthlyGrowth: 12.5,
                    topClients: [
                        {
                            name: "TechCorp Solutions",
                            revenue: 125000,
                            percentage: 50,
                        },
                        {
                            name: "Global Manufacturing Inc",
                            revenue: 89000,
                            percentage: 35.6,
                        },
                        {
                            name: "Creative Agency Ltd",
                            revenue: 36000,
                            percentage: 14.4,
                        },
                    ],
                },
            },
            {
                id: 2,
                name: "Project Performance Report",
                type: "project",
                description: "Project completion rates and budget utilization",
                generated_date: "2024-01-15",
                data: {
                    totalProjects: 15,
                    completedProjects: 8,
                    inProgressProjects: 5,
                    onHoldProjects: 2,
                    averageCompletionTime: 45,
                },
            },
            {
                id: 3,
                name: "Employee Productivity Report",
                type: "employee",
                description: "Time tracking and productivity metrics",
                generated_date: "2024-01-15",
                data: {
                    totalHoursLogged: 2400,
                    averageHoursPerEmployee: 160,
                    mostProductiveEmployee: "John Doe",
                    topPerformers: [
                        { name: "John Doe", hours: 180, projects: 5 },
                        { name: "Jane Smith", hours: 175, projects: 4 },
                        { name: "Mike Johnson", hours: 165, projects: 3 },
                    ],
                },
            },
        ];
        setReports(mockReports);
        setLoading(false);
    }, []);

    const getReportTypeColor = (type: string) => {
        switch (type) {
            case "financial":
                return "bg-green-100 text-green-800";
            case "project":
                return "bg-blue-100 text-blue-800";
            case "employee":
                return "bg-purple-100 text-purple-800";
            case "client":
                return "bg-orange-100 text-orange-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const renderOverview = () => (
        <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                                />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">
                                Total Revenue
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                $250,000
                            </p>
                            <p className="text-sm text-green-600">
                                +12.5% from last month
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
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">
                                Active Projects
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                15
                            </p>
                            <p className="text-sm text-blue-600">
                                5 in progress
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
                                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                                />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">
                                Team Members
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                12
                            </p>
                            <p className="text-sm text-purple-600">
                                2,400 hours logged
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
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">
                                Active Clients
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                8
                            </p>
                            <p className="text-sm text-orange-600">
                                3 new this month
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Revenue Trend
                    </h3>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                        <div className="text-center">
                            <svg
                                className="w-16 h-16 text-gray-400 mx-auto mb-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                            </svg>
                            <p className="text-gray-500">
                                Chart visualization would go here
                            </p>
                        </div>
                    </div>
                </div>

                {/* Project Status Chart */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Project Status Distribution
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                                <span className="text-sm text-gray-600">
                                    Completed
                                </span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                                8 (53%)
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-4 h-4 bg-yellow-500 rounded-full mr-3"></div>
                                <span className="text-sm text-gray-600">
                                    In Progress
                                </span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                                5 (33%)
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-4 h-4 bg-orange-500 rounded-full mr-3"></div>
                                <span className="text-sm text-gray-600">
                                    On Hold
                                </span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                                2 (14%)
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Performers */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Top Performers
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-2xl font-bold text-white">
                                1
                            </span>
                        </div>
                        <h4 className="font-semibold text-gray-900">
                            John Doe
                        </h4>
                        <p className="text-sm text-gray-600">
                            180 hours logged
                        </p>
                        <p className="text-sm text-gray-500">5 projects</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-2xl font-bold text-white">
                                2
                            </span>
                        </div>
                        <h4 className="font-semibold text-gray-900">
                            Jane Smith
                        </h4>
                        <p className="text-sm text-gray-600">
                            175 hours logged
                        </p>
                        <p className="text-sm text-gray-500">4 projects</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-2xl font-bold text-white">
                                3
                            </span>
                        </div>
                        <h4 className="font-semibold text-gray-900">
                            Mike Johnson
                        </h4>
                        <p className="text-sm text-gray-600">
                            165 hours logged
                        </p>
                        <p className="text-sm text-gray-500">3 projects</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderFinancialReport = () => {
        const financialData = reports.find((r) => r.type === "financial")?.data;
        return (
            <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Revenue Breakdown
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-medium text-gray-900 mb-3">
                                Top Clients by Revenue
                            </h4>
                            <div className="space-y-3">
                                {financialData?.topClients.map(
                                    (client: any, index: number) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between"
                                        >
                                            <div className="flex items-center">
                                                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                                                <span className="text-sm text-gray-600">
                                                    {client.name}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-sm font-medium text-gray-900">
                                                    $
                                                    {client.revenue.toLocaleString()}
                                                </span>
                                                <span className="text-xs text-gray-500 ml-2">
                                                    ({client.percentage}%)
                                                </span>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900 mb-3">
                                Revenue Summary
                            </h4>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">
                                        Total Revenue
                                    </span>
                                    <span className="text-sm font-medium text-gray-900">
                                        $
                                        {financialData?.totalRevenue.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">
                                        Monthly Growth
                                    </span>
                                    <span className="text-sm font-medium text-green-600">
                                        +{financialData?.monthlyGrowth}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderProjectReport = () => {
        const projectData = reports.find((r) => r.type === "project")?.data;
        return (
            <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Project Performance
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600 mb-2">
                                {projectData?.totalProjects}
                            </div>
                            <div className="text-sm text-gray-600">
                                Total Projects
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-600 mb-2">
                                {projectData?.completedProjects}
                            </div>
                            <div className="text-sm text-gray-600">
                                Completed
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-yellow-600 mb-2">
                                {projectData?.inProgressProjects}
                            </div>
                            <div className="text-sm text-gray-600">
                                In Progress
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-orange-600 mb-2">
                                {projectData?.onHoldProjects}
                            </div>
                            <div className="text-sm text-gray-600">On Hold</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderEmployeeReport = () => {
        const employeeData = reports.find((r) => r.type === "employee")?.data;
        return (
            <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Employee Productivity
                    </h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-purple-600 mb-2">
                                    {employeeData?.totalHoursLogged}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Total Hours Logged
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-blue-600 mb-2">
                                    {employeeData?.averageHoursPerEmployee}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Avg Hours/Employee
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-green-600 mb-2">
                                    {employeeData?.mostProductiveEmployee}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Top Performer
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderSelectedReport = () => {
        switch (selectedReport) {
            case "overview":
                return renderOverview();
            case "financial":
                return renderFinancialReport();
            case "project":
                return renderProjectReport();
            case "employee":
                return renderEmployeeReport();
            default:
                return renderOverview();
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Reports & Analytics
                        </h2>
                        <p className="text-gray-600 mt-1">
                            Comprehensive insights and data analysis
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0 flex space-x-3">
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="7">Last 7 days</option>
                            <option value="30">Last 30 days</option>
                            <option value="90">Last 90 days</option>
                            <option value="365">Last year</option>
                        </select>
                        <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2">
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
                                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                            <span>Export Report</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Report Navigation */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setSelectedReport("overview")}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                            selectedReport === "overview"
                                ? "bg-indigo-100 text-indigo-700 border-2 border-indigo-200"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setSelectedReport("financial")}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                            selectedReport === "financial"
                                ? "bg-green-100 text-green-700 border-2 border-green-200"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        Financial
                    </button>
                    <button
                        onClick={() => setSelectedReport("project")}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                            selectedReport === "project"
                                ? "bg-blue-100 text-blue-700 border-2 border-blue-200"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        Projects
                    </button>
                    <button
                        onClick={() => setSelectedReport("employee")}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                            selectedReport === "employee"
                                ? "bg-purple-100 text-purple-700 border-2 border-purple-200"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        Employees
                    </button>
                </div>
            </div>

            {/* Report Content */}
            {renderSelectedReport()}

            {/* Available Reports List */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Available Reports
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {reports.map((report) => (
                        <div
                            key={report.id}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <h4 className="font-medium text-gray-900">
                                    {report.name}
                                </h4>
                                <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getReportTypeColor(
                                        report.type
                                    )}`}
                                >
                                    {report.type}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">
                                {report.description}
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">
                                    Generated:{" "}
                                    {new Date(
                                        report.generated_date
                                    ).toLocaleDateString()}
                                </span>
                                <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                                    View Report
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReportsAnalytics;
