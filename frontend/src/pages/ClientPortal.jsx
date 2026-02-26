import { useAuthStore } from "../store/useAuthStore";
import { Link, Navigate } from "react-router-dom";
import { Briefcase, Calendar, FileText, CheckCircle, Clock } from "lucide-react";

// Mock Data
const clientCases = [
    { id: "C-1045", type: "Real Estate Dispute", status: "Review phase", lastUpdate: "Drafting responses to opposing counsel.", nextDeadline: "2026-03-10" },
];

const scheduledMeetings = [
    { id: 1, attorney: "Atty. Jane Doe", time: "Friday, 10:00 AM", type: "Status Update" },
];

const ClientPortal = () => {
    const { authUser } = useAuthStore();

    if (authUser?.role !== 'client') {
        return <Navigate to="/dashboard" />;
    }

    return (
        <div className="min-h-screen pt-24 px-6 max-w-7xl mx-auto bg-bg-primary text-text-primary">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Client Portal</h1>
                <p className="text-gray-500 mt-2">Welcome, {authUser?.fullName}. Here's the status of your legal matters.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cases Overview */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <Briefcase size={20} className="text-primary" /> My Active Cases
                            </h2>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {clientCases.map((caseItem) => (
                                <div key={caseItem.id} className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 text-lg">{caseItem.id} - {caseItem.type}</h4>
                                            <p className="text-sm font-medium text-blue-600 mt-1">{caseItem.status}</p>
                                        </div>
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                                            Active
                                        </span>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex gap-4">
                                        <FileText className="text-gray-400 shrink-0" size={20} />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Latest Update</p>
                                            <p className="text-sm text-gray-600 mt-1">{caseItem.lastUpdate}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-4 flex items-center gap-1.5 font-medium">
                                        <Clock size={16} className="text-orange-500" /> Next Milestone: {caseItem.nextDeadline}
                                    </p>
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
                            {scheduledMeetings.length > 0 ? scheduledMeetings.map((meeting) => (
                                <div key={meeting.id} className="flex gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                                    <div className="p-2 bg-white rounded-lg border border-gray-200 shadow-sm self-start">
                                        <Calendar className="text-primary-dark" size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Meeting with {meeting.attorney}</h4>
                                        <p className="text-sm text-gray-500">{meeting.type}</p>
                                        <p className="text-xs font-semibold text-primary mt-2">{meeting.time}</p>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-sm text-gray-500 text-center py-4">No upcoming meetings scheduled.</p>
                            )}
                        </div>
                        <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
                            <Link to="/" className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors">Request a Meeting via Chat</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientPortal;
