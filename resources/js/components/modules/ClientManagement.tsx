import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

interface Client {
    id: number;
    company_name: string;
    contact_person: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    industry: string;
    status: "active" | "inactive" | "prospect";
    created_date: string;
    last_contact: string;
    total_projects: number;
    total_revenue: number;
}

const ClientManagement: React.FC = () => {
    const { token } = useAuth();
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterIndustry, setFilterIndustry] = useState("all");
    const [error, setError] = useState<string | null>(null);

    // Fetch clients from API
    useEffect(() => {
        const fetchClients = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const response = await fetch("/api/clients", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("Clients loaded:", data);
                    setClients(data.clients || []);
                } else {
                    const errorData = await response.json();
                    console.error("Failed to load clients:", errorData);
                    setError(errorData.message || "Failed to load clients");
                }
            } catch (error) {
                console.error("Error fetching clients:", error);
                setError("Network error while loading clients");
            } finally {
                setLoading(false);
            }
        };

        fetchClients();
    }, [token]);

    const filteredClients = clients.filter((client) => {
        const matchesSearch =
            client.company_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            client.contact_person
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.industry.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            filterStatus === "all" || client.status === filterStatus;
        const matchesIndustry =
            filterIndustry === "all" || client.industry === filterIndustry;

        return matchesSearch && matchesStatus && matchesIndustry;
    });

    const industries = Array.from(
        new Set(clients.map((client) => client.industry))
    );
    const totalRevenue = clients.reduce(
        (sum, client) => sum + client.total_revenue,
        0
    );
    const activeClients = clients.filter(
        (client) => client.status === "active"
    ).length;

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!token) return;

        const formData = new FormData(e.currentTarget);
        const clientData = {
            company_name: formData.get("company_name") as string,
            contact_person: formData.get("contact_person") as string,
            email: formData.get("email") as string,
            phone: formData.get("phone") as string,
            address: formData.get("address") as string,
            city: formData.get("city") as string,
            state: formData.get("state") as string,
            postal_code: formData.get("postal_code") as string,
            country: formData.get("country") as string,
        };

        try {
            const url = editingClient
                ? `/api/clients/${editingClient.id}`
                : "/api/clients";
            const method = editingClient ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
                body: JSON.stringify(clientData),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Client saved:", data);

                // Refresh the clients list
                const clientsResponse = await fetch("/api/clients", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });

                if (clientsResponse.ok) {
                    const clientsData = await clientsResponse.json();
                    setClients(clientsData.clients || []);
                }

                setShowModal(false);
                setEditingClient(null);
            } else {
                const errorData = await response.json();
                console.error("Failed to save client:", errorData);
                setError(errorData.message || "Failed to save client");
            }
        } catch (error) {
            console.error("Error saving client:", error);
            setError("Network error while saving client");
        }
    };

    // Handle delete client
    const handleDelete = async (clientId: number) => {
        if (!token || !confirm("Are you sure you want to delete this client?"))
            return;

        try {
            const response = await fetch(`/api/clients/${clientId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            if (response.ok) {
                // Refresh the clients list
                const clientsResponse = await fetch("/api/clients", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });

                if (clientsResponse.ok) {
                    const clientsData = await clientsResponse.json();
                    setClients(clientsData.clients || []);
                }
            } else {
                const errorData = await response.json();
                console.error("Failed to delete client:", errorData);
                setError(errorData.message || "Failed to delete client");
            }
        } catch (error) {
            console.error("Error deleting client:", error);
            setError("Network error while deleting client");
        }
    };

    // Show loading state
    if (loading) {
        return (
            <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">
                                Loading clients...
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
                                Error Loading Clients
                            </h3>
                            <p className="text-gray-600 mb-4">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
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
                            Client Management
                        </h2>
                        <p className="text-gray-600 mt-1">
                            Manage your clients and business relationships
                        </p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="mt-4 sm:mt-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center space-x-2"
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
                        <span>Add Client</span>
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
                                placeholder="Search clients..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
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
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="prospect">Prospect</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Industry
                        </label>
                        <select
                            value={filterIndustry}
                            onChange={(e) => setFilterIndustry(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        >
                            <option value="all">All Industries</option>
                            {industries.map((industry) => (
                                <option key={industry} value={industry}>
                                    {industry}
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
                                Total Clients
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {clients.length}
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
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">
                                Active Clients
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {activeClients}
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
                                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                                />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">
                                Total Revenue
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                ${totalRevenue.toLocaleString()}
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
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">
                                Total Projects
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {clients.reduce(
                                    (sum, client) =>
                                        sum + client.total_projects,
                                    0
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Client Table */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Client List
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Company
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Contact
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Industry
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Projects
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Revenue
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
                            {filteredClients.map((client) => (
                                <tr
                                    key={client.id}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                                                <span className="text-sm font-medium text-white">
                                                    {client.company_name.charAt(
                                                        0
                                                    )}
                                                </span>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {client.company_name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {client.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {client.contact_person}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {client.phone}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {client.industry}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {client.total_projects}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ${client.total_revenue.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                client.status === "active"
                                                    ? "bg-green-100 text-green-800"
                                                    : client.status ===
                                                      "prospect"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : "bg-red-100 text-red-800"
                                            }`}
                                        >
                                            {client.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => {
                                                    setEditingClient(client);
                                                    setShowModal(true);
                                                }}
                                                className="text-green-600 hover:text-green-900"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(client.id)
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

            {/* Add/Edit Client Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                {editingClient
                                    ? "Edit Client"
                                    : "Add New Client"}
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Company Name
                                    </label>
                                    <input
                                        type="text"
                                        name="company_name"
                                        defaultValue={
                                            editingClient?.company_name || ""
                                        }
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Contact Person
                                    </label>
                                    <input
                                        type="text"
                                        name="contact_person"
                                        defaultValue={
                                            editingClient?.contact_person || ""
                                        }
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        defaultValue={
                                            editingClient?.email || ""
                                        }
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                                    />
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
                                                editingClient?.phone || ""
                                            }
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            defaultValue={
                                                editingClient?.city || ""
                                            }
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            State
                                        </label>
                                        <input
                                            type="text"
                                            name="state"
                                            defaultValue={
                                                editingClient?.state || ""
                                            }
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Postal Code
                                        </label>
                                        <input
                                            type="text"
                                            name="postal_code"
                                            defaultValue={
                                                editingClient?.postal_code || ""
                                            }
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Country
                                    </label>
                                    <input
                                        type="text"
                                        name="country"
                                        defaultValue={
                                            editingClient?.country || ""
                                        }
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Address
                                    </label>
                                    <textarea
                                        name="address"
                                        defaultValue={
                                            editingClient?.address || ""
                                        }
                                        rows={3}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                                    />
                                </div>
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false);
                                            setEditingClient(null);
                                        }}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                                    >
                                        {editingClient ? "Update" : "Add"}{" "}
                                        Client
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

export default ClientManagement;
