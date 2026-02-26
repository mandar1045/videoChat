import { useAuthStore } from "../store/useAuthStore";
import { Link, Navigate } from "react-router-dom";
import { Calendar, Users, FileText, CheckCircle, Clock } from "lucide-react";

// Mock Data
const activeCases = [
    { id: "C-1042", client: "Acme Corp", type: "Corporate Restructuring", status: "In Progress", nextDeadline: "2026-03-15" },
    { id: "C-1045", client: "John Doe", type: "Real Estate Dispute", status: "Review", nextDeadline: "2026-03-10" },
    { id: "C-1048", client: "TechFlow Inc", type: "IP Registration", status: "Awaiting Action", nextDeadline: "2026-04-01" },
];

const scheduledMeetings = [
    { id: 1, client: "Jane Smith", time: "Today, 2:00 PM", type: "Initial Consultation" },
    { id: 2, client: "Acme Corp Board", time: "Tomorrow, 10:00 AM", type: "Strategy Session" },
];

const AdminDashboard = () => {
    const { authUser } = useAuthStore();

    if (authUser?.role !== 'admin') {
        return <Navigate to="/client-portal" />;
    }

    return (
        <div className="min-h-screen pt-24 px-6 max-w-7xl mx-auto bg-bg-primary text-text-primary">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Admin Dashboard</h1>
                <p className="text-gray-500 mt-2">Welcome back, {authUser?.fullName}. Here is your overview for today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Stat Cards */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-primary-dark rounded-xl">
                            <FileText size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Active Cases</p>
                            <h3 className="text-2xl font-bold text-gray-900">24</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-50 text-success-dark rounded-xl">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Meetings Today</p>
                            <h3 className="text-2xl font-bold text-gray-900">4</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-50 text-purple-700 rounded-xl">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Clients</p>
                            <h3 className="text-2xl font-bold text-gray-900">156</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cases Overview */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-900">Recent Cases</h2>
                            <Link to="/cases" className="text-sm text-primary hover:text-primary-dark font-medium transition-colors">View All</Link>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {activeCases.map((caseItem) => (
                                <div key={caseItem.id} className="p-6 hover:bg-gray-50 transition-colors flex items-center justify-between">
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{caseItem.id} - {caseItem.client}</h4>
                                        <p className="text-sm text-gray-500 mt-1">{caseItem.type}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                            {caseItem.status}
                                        </span>
                                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1 justify-end">
                                            <Clock size={12} /> Target: {caseItem.nextDeadline}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Schedule Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900">Upcoming Meetings</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            {scheduledMeetings.map((meeting) => (
                                <div key={meeting.id} className="flex gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                                    <div className="p-2 bg-white rounded-lg border border-gray-200 shadow-sm self-start">
                                        <Calendar className="text-primary-dark" size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">{meeting.client}</h4>
                                        <p className="text-sm text-gray-500">{meeting.type}</p>
                                        <p className="text-xs font-semibold text-primary mt-2">{meeting.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
