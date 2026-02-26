import { useAuthStore } from "../store/useAuthStore";
import { Link, Navigate } from "react-router-dom";
import { FileText, Search, Filter } from "lucide-react";

const allCases = [
    { id: "C-1042", client: "Acme Corp", type: "Corporate Restructuring", status: "In Progress", nextDeadline: "2026-03-15", lead: "Atty. Smith" },
    { id: "C-1045", client: "John Doe", type: "Real Estate Dispute", status: "Review", nextDeadline: "2026-03-10", lead: "Atty. Doe" },
    { id: "C-1048", client: "TechFlow Inc", type: "IP Registration", status: "Awaiting Action", nextDeadline: "2026-04-01", lead: "Atty. Smith" },
    { id: "C-1088", client: "Global Tech", type: "Merger & Acquisition", status: "Discovery", nextDeadline: "2026-05-15", lead: "Atty. Vance" },
];

const CasesPage = () => {
    const { authUser } = useAuthStore();

    if (authUser?.role !== 'admin') {
        return <Navigate to="/client-portal" />;
    }

    return (
        <div className="min-h-screen pt-24 px-6 max-w-7xl mx-auto bg-bg-primary text-text-primary">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Case Directory</h1>
                    <p className="text-gray-500 mt-2">Manage and track all firm cases.</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search cases..."
                            className="w-full pl-10 pr-4 py-2 border border-border rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium">
                        <Filter size={16} /> Filter
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                                <th className="p-4">Case ID</th>
                                <th className="p-4">Client</th>
                                <th className="p-4">Type</th>
                                <th className="p-4">Lead Attorney</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {allCases.map((c) => (
                                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4 font-medium text-gray-900">{c.id}</td>
                                    <td className="p-4">{c.client}</td>
                                    <td className="p-4 text-gray-600">{c.type}</td>
                                    <td className="p-4 text-gray-600">{c.lead}</td>
                                    <td className="p-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                            {c.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="text-primary hover:text-primary-dark text-sm font-medium transition-colors">View Details</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CasesPage;
