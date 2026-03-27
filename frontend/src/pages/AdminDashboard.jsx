import { useAuthStore } from "../store/useAuthStore";
import { Link, Navigate } from "react-router-dom";
import { Calendar, Users, FileText, Clock, MessageSquare, Video, ChevronRight, TrendingUp } from "lucide-react";

const activeCases = [
    { id: "C-1042", client: "Acme Corp", type: "Corporate Restructuring", status: "In Progress", statusColor: "#1a3a5c", statusBg: "#eef1f5", nextDeadline: "2026-03-15" },
    { id: "C-1045", client: "John Doe", type: "Real Estate Dispute", status: "Under Review", statusColor: "#854d0e", statusBg: "#fef9c3", nextDeadline: "2026-03-10" },
    { id: "C-1048", client: "TechFlow Inc", type: "IP Registration", status: "Awaiting Action", statusColor: "#7c3aed", statusBg: "#f5f3ff", nextDeadline: "2026-04-01" },
];

const scheduledMeetings = [
    { id: 1, client: "Jane Smith", time: "Today, 2:00 PM", type: "Initial Consultation", mode: "video" },
    { id: 2, client: "Acme Corp Board", time: "Tomorrow, 10:00 AM", type: "Strategy Session", mode: "video" },
    { id: 3, client: "Robert Davis", time: "Thu, 3:30 PM", type: "Document Review", mode: "chat" },
];

const AdminDashboard = () => {
    const { authUser } = useAuthStore();

    if (authUser?.role !== 'admin') {
        return <Navigate to="/client-portal" />;
    }

    return (
        <div className="min-h-screen pt-20 pb-10 px-6" style={{ background: '#f4f6f9' }}>
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold uppercase tracking-widest px-2 py-0.5 rounded" style={{ background: 'rgba(201,168,76,0.12)', color: '#a67c3a' }}>Attorney Dashboard</span>
                        </div>
                        <h1 className="text-2xl font-bold" style={{ color: '#0c1f3d', fontFamily: "'Playfair Display', serif" }}>
                            Good day, {authUser?.fullName?.split(' ')[0]}
                        </h1>
                        <p className="text-sm mt-1" style={{ color: '#6b7a94' }}>Here is your practice overview for today.</p>
                    </div>
                    <div className="flex gap-3">
                        <Link to="/" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-md transition-all hover:opacity-90" style={{ background: 'linear-gradient(135deg, #0c1f3d, #1a3a5c)' }}>
                            <MessageSquare size={15} /> New Consultation
                        </Link>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    {[
                        { icon: <FileText size={20} />, label: "Active Cases", value: "24", trend: "+3 this month", iconBg: "#eef1f5", iconColor: "#1a3a5c" },
                        { icon: <Calendar size={20} />, label: "Meetings Today", value: "4", trend: "Next: 2:00 PM", iconBg: "#fef9c3", iconColor: "#854d0e" },
                        { icon: <Users size={20} />, label: "Total Clients", value: "156", trend: "+12 this quarter", iconBg: "#f5f3ff", iconColor: "#7c3aed" },
                        { icon: <TrendingUp size={20} />, label: "Win Rate", value: "87%", trend: "Last 12 months", iconBg: "#ecfdf5", iconColor: "#047857" },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white rounded-2xl p-5 border shadow-sm hover:shadow-md transition-shadow" style={{ borderColor: '#d1dae6' }}>
                            <div className="flex items-start justify-between">
                                <div className="p-2.5 rounded-xl" style={{ background: stat.iconBg, color: stat.iconColor }}>
                                    {stat.icon}
                                </div>
                                <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: '#f4f6f9', color: '#6b7a94' }}>{stat.trend}</span>
                            </div>
                            <p className="text-sm font-medium mt-3" style={{ color: '#6b7a94' }}>{stat.label}</p>
                            <h3 className="text-2xl font-bold mt-0.5" style={{ color: '#0c1f3d' }}>{stat.value}</h3>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Cases */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: '#d1dae6' }}>
                        <div className="p-5 border-b flex justify-between items-center" style={{ borderColor: '#eaeff5' }}>
                            <h2 className="font-semibold" style={{ color: '#0c1f3d' }}>Recent Cases</h2>
                            <Link to="/cases" className="flex items-center gap-1 text-xs font-semibold hover:underline" style={{ color: '#1a3a5c' }}>
                                View All <ChevronRight size={12} />
                            </Link>
                        </div>
                        <div className="divide-y" style={{ borderColor: '#eaeff5' }}>
                            {activeCases.map((c) => (
                                <div key={c.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#eef1f5' }}>
                                            <FileText size={18} style={{ color: '#1a3a5c' }} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold" style={{ color: '#0c1f3d' }}>{c.id} — {c.client}</p>
                                            <p className="text-xs mt-0.5" style={{ color: '#6b7a94' }}>{c.type}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ background: c.statusBg, color: c.statusColor }}>
                                            {c.status}
                                        </span>
                                        <p className="text-xs mt-1.5 flex items-center gap-1 justify-end" style={{ color: '#6b7a94' }}>
                                            <Clock size={11} /> {c.nextDeadline}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Upcoming Meetings */}
                    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: '#d1dae6' }}>
                        <div className="p-5 border-b" style={{ borderColor: '#eaeff5' }}>
                            <h2 className="font-semibold" style={{ color: '#0c1f3d' }}>Upcoming Meetings</h2>
                        </div>
                        <div className="p-4 space-y-3">
                            {scheduledMeetings.map((m) => (
                                <div key={m.id} className="flex gap-3 p-3.5 rounded-xl border transition-colors hover:bg-gray-50 cursor-pointer" style={{ borderColor: '#eaeff5', background: '#fafbfc' }}>
                                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm" style={{ background: m.mode === 'video' ? 'linear-gradient(135deg, #0c1f3d, #1e3a5c)' : '#eef1f5' }}>
                                        {m.mode === 'video'
                                            ? <Video size={16} color="white" />
                                            : <MessageSquare size={16} style={{ color: '#1a3a5c' }} />
                                        }
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold truncate" style={{ color: '#0c1f3d' }}>{m.client}</p>
                                        <p className="text-xs truncate" style={{ color: '#6b7a94' }}>{m.type}</p>
                                        <p className="text-xs font-semibold mt-1" style={{ color: '#c9a84c' }}>{m.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t" style={{ borderColor: '#eaeff5' }}>
                            <Link to="/" className="block w-full text-center py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90" style={{ background: 'linear-gradient(135deg, #0c1f3d, #1a3a5c)' }}>
                                Open Client Chats
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
