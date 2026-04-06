import { FileText, BarChart3, TrendingUp, AlertTriangle } from "lucide-react";

export default function ReportsPage() {
  const placeholderCards = [
    { title: "Monthly Claims", icon: BarChart3, desc: "Overview of all claims made this month" },
    { title: "Recovery Rate", icon: TrendingUp, desc: "Statistics on successfully recovered items" },
    { title: "Reported Issues", icon: AlertTriangle, desc: "Flags and user reports on listings" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <FileText className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-sm text-gray-500">View system statistics, user activity, and flagged issues</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {placeholderCards.map((card, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gray-50 rounded-lg">
                <card.icon className="w-5 h-5 text-gray-600" />
              </div>
              <h3 className="font-semibold text-gray-900">{card.title}</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">{card.desc}</p>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
              View Details &rarr;
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mt-6">
        <div className="flex flex-col items-center justify-center text-center h-48 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <FileText className="w-12 h-12 text-gray-300 mb-3" />
          <h3 className="text-sm font-medium text-gray-900 mb-1">Detailed Reporting Engine</h3>
          <p className="text-sm text-gray-500">
            Advanced analytics and CSV export feature is coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}
