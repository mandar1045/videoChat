import { useAuthStore } from "../store/useAuthStore";
import { Link, Navigate } from "react-router-dom";
import { Calendar, FileText, Clock, MessageSquare, Video, ChevronRight, ShieldCheck } from "lucide-react";

const clientCases = [
    { id: "C-1045", type: "Real Estate Dispute", status: "Under Review", statusColor: "#854d0e", statusBg: "#fef9c3", lastUpdate: "Drafting responses to opposing counsel's motion for summary judgment.", nextDeadline: "2026-03-10" },
];

const scheduledMeetings = [
    { id: 1, attorney: "Atty. Jane Doe", time: "Friday, 10:00 AM", type: "Case Status Update", mode: "video" },
];

const ClientPortal = () => {
    const { authUser } = useAuthStore();

    if (authUser?.role !== 'client') {
        return <Navigate to="/dashboard" />;
    }

    return (
        <div className="min-h-screen pt-20 pb-10 px-6" style={{ background: '#f4f6f9' }}>
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold uppercase tracking-widest px-2 py-0.5 rounded" style={{ background: 'rgba(201,168,76,0.12)', color: '#a67c3a' }}>Client Portal</span>
                        </div>
                        <h1 className="text-2xl font-bold" style={{ color: '#0c1f3d', fontFamily: "'Playfair Display', serif" }}>
                            Welcome, {authUser?.fullName?.split(' ')[0]}
                        </h1>
                        <p className="text-sm mt-1" style={{ color: '#6b7a94' }}>Here is the status of your legal matters.</p>
                    </div>
                    <div className="flex gap-3">
                        <Link to="/" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-md transition-all hover:opacity-90" style={{ background: 'linear-gradient(135deg, #0c1f3d, #1a3a5c)' }}>
                            <MessageSquare size={15} /> Message Attorney
                        </Link>
                    </div>
                </div>

                {/* Summary tiles */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
                    {[
                        { icon: <FileText size={20} />, label: "Active Cases", value: clientCases.length, iconBg: "#eef1f5", iconColor: "#1a3a5c" },
                        { icon: <Calendar size={20} />, label: "Upcoming Meetings", value: scheduledMeetings.length, iconBg: "#fef9c3", iconColor: "#854d0e" },
                        { icon: <ShieldCheck size={20} />, label: "Documents Shared", value: "3", iconBg: "#ecfdf5", iconColor: "#047857" },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white rounded-2xl p-5 border shadow-sm flex items-center gap-4" style={{ borderColor: '#d1dae6' }}>
                            <div className="p-3 rounded-xl" style={{ background: stat.iconBg, color: stat.iconColor }}>
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-xs font-medium" style={{ color: '#6b7a94' }}>{stat.label}</p>
                                <h3 className="text-2xl font-bold mt-0.5" style={{ color: '#0c1f3d' }}>{stat.value}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Active Cases */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: '#d1dae6' }}>
                        <div className="p-5 border-b flex items-center gap-2" style={{ borderColor: '#eaeff5' }}>
                            <FileText size={18} style={{ color: '#1a3a5c' }} />
                            <h2 className="font-semibold" style={{ color: '#0c1f3d' }}>My Active Cases</h2>
                        </div>
                        <div className="divide-y" style={{ borderColor: '#eaeff5' }}>
                            {clientCases.map((c) => (
                                <div key={c.id} className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="font-bold text-lg" style={{ color: '#0c1f3d' }}>{c.id} — {c.type}</h4>
                                            <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ background: c.statusBg, color: c.statusColor }}>
                                                {c.status}
                                            </span>
                                        </div>
                                        <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #d1fae5' }}>
                                            Active
                                        </span>
                                    </div>
                                    <div className="p-4 rounded-xl border flex gap-3" style={{ background: '#f4f6f9', borderColor: '#d1dae6' }}>
                                        <FileText className="flex-shrink-0 mt-0.5" size={16} style={{ color: '#6b7a94' }} />
                                        <div>
                                            <p className="text-sm font-semibold" style={{ color: '#0c1f3d' }}>Latest Attorney Update</p>
                                            <p className="text-sm mt-1" style={{ color: '#4b5c7e' }}>{c.lastUpdate}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm mt-4 flex items-center gap-1.5 font-medium" style={{ color: '#6b7a94' }}>
                                        <Clock size={14} style={{ color: '#c9a84c' }} />
                                        Next Milestone: <span style={{ color: '#0c1f3d' }}>{c.nextDeadline}</span>
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-5">
                        {/* Upcoming Meetings */}
                        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: '#d1dae6' }}>
                            <div className="p-5 border-b" style={{ borderColor: '#eaeff5' }}>
                                <h2 className="font-semibold" style={{ color: '#0c1f3d' }}>Upcoming Meetings</h2>
                            </div>
                            <div className="p-4 space-y-3">
                                {scheduledMeetings.length > 0 ? scheduledMeetings.map((m) => (
                                    <div key={m.id} className="flex gap-3 p-3.5 rounded-xl border cursor-pointer hover:bg-gray-50 transition-colors" style={{ borderColor: '#eaeff5', background: '#fafbfc' }}>
                                        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #0c1f3d, #1e3a5c)' }}>
                                            <Video size={16} color="white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold truncate" style={{ color: '#0c1f3d' }}>Meeting with {m.attorney}</p>
                                            <p className="text-xs truncate" style={{ color: '#6b7a94' }}>{m.type}</p>
                                            <p className="text-xs font-semibold mt-1" style={{ color: '#c9a84c' }}>{m.time}</p>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-sm text-center py-4" style={{ color: '#6b7a94' }}>No upcoming meetings.</p>
                                )}
                            </div>
                            <div className="p-4 border-t" style={{ borderColor: '#eaeff5' }}>
                                <Link to="/" className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90" style={{ background: 'linear-gradient(135deg, #0c1f3d, #1a3a5c)' }}>
                                    <MessageSquare size={14} /> Request Meeting via Chat
                                </Link>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: '#d1dae6' }}>
                            <div className="p-5 border-b" style={{ borderColor: '#eaeff5' }}>
                                <h2 className="font-semibold" style={{ color: '#0c1f3d' }}>Quick Actions</h2>
                            </div>
                            <div className="p-4 space-y-2">
                                {[
                                    { icon: <Video size={15} />, label: "Start Video Call", to: "/" },
                                    { icon: <MessageSquare size={15} />, label: "Send a Message", to: "/" },
                                    { icon: <FileText size={15} />, label: "View Documents", to: "/" },
                                ].map((action, i) => (
                                    <Link key={i} to={action.to} className="flex items-center justify-between p-3 rounded-xl border hover:bg-gray-50 transition-colors group" style={{ borderColor: '#eaeff5' }}>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg" style={{ background: '#eef1f5', color: '#1a3a5c' }}>{action.icon}</div>
                                            <span className="text-sm font-medium" style={{ color: '#0c1f3d' }}>{action.label}</span>
                                        </div>
                                        <ChevronRight size={14} style={{ color: '#94a3b8' }} className="group-hover:translate-x-0.5 transition-transform" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientPortal;
