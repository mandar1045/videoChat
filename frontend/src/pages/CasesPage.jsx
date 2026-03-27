import { useAuthStore } from "../store/useAuthStore";
import { Link, Navigate } from "react-router-dom";
import { FileText, Search, Filter, ChevronRight, Plus } from "lucide-react";

const allCases = [
    { id: "C-1042", client: "Acme Corp", type: "Corporate Restructuring", status: "In Progress", statusColor: "#1a3a5c", statusBg: "#eef1f5", nextDeadline: "2026-03-15", lead: "Atty. Smith" },
    { id: "C-1045", client: "John Doe", type: "Real Estate Dispute", status: "Under Review", statusColor: "#854d0e", statusBg: "#fef9c3", nextDeadline: "2026-03-10", lead: "Atty. Doe" },
    { id: "C-1048", client: "TechFlow Inc", type: "IP Registration", status: "Awaiting Action", statusColor: "#7c3aed", statusBg: "#f5f3ff", nextDeadline: "2026-04-01", lead: "Atty. Smith" },
    { id: "C-1088", client: "Global Tech", type: "Merger & Acquisition", status: "Discovery", statusColor: "#047857", statusBg: "#ecfdf5", nextDeadline: "2026-05-15", lead: "Atty. Vance" },
];

const CasesPage = () => {
    const { authUser } = useAuthStore();

    if (authUser?.role !== 'admin') {
        return <Navigate to="/client-portal" />;
    }

    return (
        <div className="min-h-screen pt-20 pb-10 px-6" style={{ background: '#f4f6f9' }}>
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold uppercase tracking-widest px-2 py-0.5 rounded" style={{ background: 'rgba(201,168,76,0.12)', color: '#a67c3a' }}>Case Management</span>
                        </div>
                        <h1 className="text-2xl font-bold" style={{ color: '#0c1f3d', fontFamily: "'Playfair Display', serif" }}>Case Directory</h1>
                        <p className="text-sm mt-1" style={{ color: '#6b7a94' }}>Manage and track all firm cases.</p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={16} style={{ color: '#6b7a94' }} />
                            <input
                                type="text"
                                placeholder="Search cases..."
                                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl transition-all"
                                style={{ background: 'white', border: '1.5px solid #d1dae6', color: '#0c1f3d', outline: 'none' }}
                                onFocus={(e) => e.target.style.borderColor = '#1a3a5c'}
                                onBlur={(e) => e.target.style.borderColor = '#d1dae6'}
                            />
                        </div>
                        <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium bg-white border transition-colors hover:bg-gray-50" style={{ borderColor: '#d1dae6', color: '#0c1f3d' }}>
                            <Filter size={15} /> Filter
                        </button>
                        <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-white shadow-md transition-all hover:opacity-90" style={{ background: 'linear-gradient(135deg, #0c1f3d, #1a3a5c)' }}>
                            <Plus size={15} /> New Case
                        </button>
                    </div>
                </div>

                {/* Cases Table */}
                <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: '#d1dae6' }}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b text-xs uppercase tracking-wider font-semibold" style={{ borderColor: '#eaeff5', background: '#f4f6f9', color: '#6b7a94' }}>
                                    <th className="px-5 py-3.5">Case ID</th>
                                    <th className="px-5 py-3.5">Client</th>
                                    <th className="px-5 py-3.5">Matter Type</th>
                                    <th className="px-5 py-3.5">Lead Attorney</th>
                                    <th className="px-5 py-3.5">Next Deadline</th>
                                    <th className="px-5 py-3.5">Status</th>
                                    <th className="px-5 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allCases.map((c) => (
                                    <tr key={c.id} className="border-b hover:bg-gray-50 transition-colors" style={{ borderColor: '#eaeff5' }}>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#eef1f5' }}>
                                                    <FileText size={13} style={{ color: '#1a3a5c' }} />
                                                </div>
                                                <span className="text-sm font-semibold" style={{ color: '#0c1f3d' }}>{c.id}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-sm font-medium" style={{ color: '#0c1f3d' }}>{c.client}</td>
                                        <td className="px-5 py-4 text-sm" style={{ color: '#4b5c7e' }}>{c.type}</td>
                                        <td className="px-5 py-4 text-sm" style={{ color: '#4b5c7e' }}>{c.lead}</td>
                                        <td className="px-5 py-4 text-sm" style={{ color: '#6b7a94' }}>{c.nextDeadline}</td>
                                        <td className="px-5 py-4">
                                            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ background: c.statusBg, color: c.statusColor }}>
                                                {c.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <button className="inline-flex items-center gap-1 text-sm font-semibold hover:underline" style={{ color: '#1a3a5c' }}>
                                                View <ChevronRight size={13} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Table footer */}
                    <div className="px-5 py-3 border-t flex items-center justify-between" style={{ borderColor: '#eaeff5', background: '#f4f6f9' }}>
                        <p className="text-xs" style={{ color: '#6b7a94' }}>Showing {allCases.length} of {allCases.length} cases</p>
                        <Link to="/" className="text-xs font-semibold hover:underline" style={{ color: '#1a3a5c' }}>Go to Client Chats →</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CasesPage;
