import React from "react";
import { TrendingUp, CheckCircle, Bell, Home, Edit } from "lucide-react";
import DisasterMap from "../DisasterMap";

type Props = {
  todayStats: { totalReports: number; verifiedReports: number; activeAlerts: number; sheltersActive: number };
  shelters: any[];
  setActiveTab: (tab: string) => void;
  editable?: boolean;
  setEditingDashboard?: (val: boolean) => void;
  userRole: "citizen" | "official" | "analyst";
};

const Dashboard: React.FC<Props> = ({ todayStats, shelters, setActiveTab, editable, setEditingDashboard, userRole }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full bg-white">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-6 w-full px-6">
        {/* Stats */}
        <div className="h-[600px] grid grid-rows-4 gap-6">
          <div className="bg-white rounded-lg shadow-2xl p-6 border-l-4 border-blue-500 flex items-center">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm">Total Reports Today</p>
              <p className="text-2xl font-bold">{todayStats.totalReports}</p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab("posts")}
            className="bg-white rounded-lg shadow-2xl p-6 border-l-4 border-green-500 flex items-center"
          >
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm">Verified Reports</p>
              <p className="text-2xl font-bold">{todayStats.verifiedReports}</p>
              <span className="text-xs text-green-600">View Posts</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab("alerts")}
            className="bg-white rounded-lg shadow-2xl p-6 border-l-4 border-red-500 flex items-center"
          >
            <Bell className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm">Active Alerts</p>
              <p className="text-2xl font-bold">{todayStats.activeAlerts}</p>
              <span className="text-xs text-red-600">View Alerts</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab("shelters")}
            className="bg-white rounded-lg shadow-2xl p-6 border-l-4 border-purple-500 flex items-center"
          >
            <Home className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm">Active Shelters</p>
              <p className="text-2xl font-bold">{todayStats.sheltersActive}</p>
              <span className="text-xs text-purple-600">View Shelters</span>
            </div>
          </button>
        </div>

        {/* Map */}
        <div className="md:col-span-2 bg-white rounded-lg shadow-md overflow-hidden h-[600px]">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">South Asian Ocean Hazard Map</h2>
          </div>
          <div className="h-[calc(100%-64px)]">
            <DisasterMap shelters={shelters} />
          </div>
        </div>
      </div>

      {editable && setEditingDashboard && (
        <div className="mt-8 flex justify-end">
          <button
            onClick={() => setEditingDashboard(true)}
            className="bg-[#5899E2] text-white px-4 py-2 rounded-md font-medium flex items-center"
          >
            <Edit className="w-4 h-4 mr-2" /> Edit Dashboard
          </button>
        </div>
      )}

      {userRole !== "citizen" && (
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-lg font-semibold">Analytics Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div className="bg-blue-50 rounded-lg p-4">Total Reports: 1,254</div>
            <div className="bg-green-50 rounded-lg p-4">Verified Reports: 1,024</div>
            <div className="bg-red-50 rounded-lg p-4">Active Alerts: 15</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
