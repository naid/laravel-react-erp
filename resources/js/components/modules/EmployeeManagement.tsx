import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

interface Employee {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    position: string;
    department: string;
    hire_date: string;
    salary: number;
    status: "active" | "inactive";
    phone: string;
    address: string;
}

const EmployeeManagement: React.FC = () => {
    const { token } = useAuth();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(
        null
    );
    const [searchTerm, setSearchTerm] = useState("");
    const [filterDepartment, setFilterDepartment] = useState("all");
    const [error, setError] = useState<string | null>(null);

    // Fetch employees from API
    useEffect(() => {
        const fetchEmployees = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const response = await fetch("/api/personnel", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("Employees loaded:", data);
                    setEmployees(data.personnel || []);
                } else {
                    const errorData = await response.json();
                    console.error("Failed to load employees:", errorData);
                    setError(errorData.message || "Failed to load employees");
                }
            } catch (error) {
                console.error("Error fetching employees:", error);
                setError("Network error while loading employees");
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, [token]);

    const filteredEmployees = employees.filter((employee) => {
        const matchesSearch =
            employee.first_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            employee.last_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.position.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDepartment =
            filterDepartment === "all" ||
            employee.department === filterDepartment;

        return matchesSearch && matchesDepartment;
    });

    const departments = Array.from(
        new Set(employees.map((emp) => emp.department))
    );

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!token) return;

        const formData = new FormData(e.currentTarget);
        const employeeData = {
            first_name: formData.get("first_name") as string,
            last_name: formData.get("last_name") as string,
            email: formData.get("email") as string,
            position: formData.get("position") as string,
            department: formData.get("department") as string,
            hire_date: formData.get("hire_date") as string,
            salary: parseFloat(formData.get("salary") as string) || 0,
            phone: formData.get("phone") as string,
            address: formData.get("address") as string,
        };

        try {
            const url = editingEmployee
                ? `/api/personnel/${editingEmployee.id}`
                : "/api/personnel";
            const method = editingEmployee ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
                body: JSON.stringify(employeeData),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Employee saved:", data);

                // Refresh the employees list
                const employeesResponse = await fetch("/api/personnel", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });

                if (employeesResponse.ok) {
                    const employeesData = await employeesResponse.json();
                    setEmployees(employeesData.personnel || []);
                }

                setShowModal(false);
                setEditingEmployee(null);
            } else {
                const errorData = await response.json();
                console.error("Failed to save employee:", errorData);
                setError(errorData.message || "Failed to save employee");
            }
        } catch (error) {
            console.error("Error saving employee:", error);
            setError("Network error while saving employee");
        }
    };

    // Handle delete employee
    const handleDelete = async (employeeId: number) => {
        if (
            !token ||
            !confirm("Are you sure you want to delete this employee?")
        )
            return;

        try {
            const response = await fetch(`/api/personnel/${employeeId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            if (response.ok) {
                // Refresh the employees list
                const employeesResponse = await fetch("/api/personnel", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });

                if (employeesResponse.ok) {
                    const employeesData = await employeesResponse.json();
                    setEmployees(employeesData.personnel || []);
                }
            } else {
                const errorData = await response.json();
                console.error("Failed to delete employee:", errorData);
                setError(errorData.message || "Failed to delete employee");
            }
        } catch (error) {
            console.error("Error deleting employee:", error);
            setError("Network error while deleting employee");
        }
    };

    // Show loading state
    if (loading) {
        return (
            <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">
                                Loading employees...
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="text-red-500 text-6xl mb-4">⚠️</div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Error Loading Employees
                            </h3>
                            <p className="text-gray-600 mb-4">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Employee Management
                        </h2>
                        <p className="text-gray-600 mt-1">
                            Manage your team members and their information
                        </p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center space-x-2"
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
                        <span>Add Employee</span>
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                placeholder="Search employees..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Department
                        </label>
                        <select
                            value={filterDepartment}
                            onChange={(e) =>
                                setFilterDepartment(e.target.value)
                            }
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                            <option value="all">All Departments</option>
                            {departments.map((dept) => (
                                <option key={dept} value={dept}>
                                    {dept}
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
                                {employees.length}
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
                                Active
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {
                                    employees.filter(
                                        (emp) => emp.status === "active"
                                    ).length
                                }
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
                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">
                                Departments
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {departments.length}
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
                                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                                />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">
                                Avg Salary
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                $
                                {Math.round(
                                    employees.reduce(
                                        (sum, emp) => sum + emp.salary,
                                        0
                                    ) / employees.length || 0
                                ).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Employee Table */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Employee List
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
                                    Position
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Department
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Salary
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
                            {filteredEmployees.map((employee) => (
                                <tr
                                    key={employee.id}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                                                <span className="text-sm font-medium text-white">
                                                    {employee.first_name.charAt(
                                                        0
                                                    )}
                                                    {employee.last_name.charAt(
                                                        0
                                                    )}
                                                </span>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {employee.first_name}{" "}
                                                    {employee.last_name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {employee.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {employee.position}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {employee.department}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ${employee.salary.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                employee.status === "active"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                            }`}
                                        >
                                            {employee.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => {
                                                    setEditingEmployee(
                                                        employee
                                                    );
                                                    setShowModal(true);
                                                }}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(employee.id)
                                                }
                                                className="text-red-600 hover:text-red-900"
                                            >
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

            {/* Add/Edit Employee Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                {editingEmployee
                                    ? "Edit Employee"
                                    : "Add New Employee"}
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            name="first_name"
                                            defaultValue={
                                                editingEmployee?.first_name ||
                                                ""
                                            }
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            name="last_name"
                                            defaultValue={
                                                editingEmployee?.last_name || ""
                                            }
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        defaultValue={
                                            editingEmployee?.email || ""
                                        }
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Position
                                        </label>
                                        <input
                                            type="text"
                                            name="position"
                                            defaultValue={
                                                editingEmployee?.position || ""
                                            }
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Department
                                        </label>
                                        <select
                                            name="department"
                                            defaultValue={
                                                editingEmployee?.department ||
                                                ""
                                            }
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">
                                                Select Department
                                            </option>
                                            <option value="Engineering">
                                                Engineering
                                            </option>
                                            <option value="Management">
                                                Management
                                            </option>
                                            <option value="Design">
                                                Design
                                            </option>
                                            <option value="Sales">Sales</option>
                                            <option value="Marketing">
                                                Marketing
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Salary
                                        </label>
                                        <input
                                            type="number"
                                            name="salary"
                                            defaultValue={
                                                editingEmployee?.salary || ""
                                            }
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Hire Date
                                        </label>
                                        <input
                                            type="date"
                                            name="hire_date"
                                            defaultValue={
                                                editingEmployee?.hire_date || ""
                                            }
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Phone
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            defaultValue={
                                                editingEmployee?.phone || ""
                                            }
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Address
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            defaultValue={
                                                editingEmployee?.address || ""
                                            }
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false);
                                            setEditingEmployee(null);
                                        }}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                    >
                                        {editingEmployee ? "Update" : "Add"}{" "}
                                        Employee
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

export default EmployeeManagement;
