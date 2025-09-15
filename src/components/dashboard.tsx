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
    <div className="py-8">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
  {[
    { title: "Total Reports", count: todayStats.totalReports, icon: <TrendingUp className="w-6 h-6 text-blue-600" />, border: "border-blue-600" },
    { title: "Verified Reports", count: todayStats.verifiedReports, icon: <CheckCircle className="w-6 h-6 text-teal-600" />, border: "border-teal-600" },
    { title: "Active Alerts", count: todayStats.activeAlerts, icon: <Bell className="w-6 h-6 text-red-600" />, border: "border-red-600" },
    { title: "Active Shelters", count: todayStats.sheltersActive, icon: <Home className="w-6 h-6 text-blue-600" />, border: "border-blue-600" },
  ].map((stat, idx) => (
    <div
      key={idx}
      className={`bg-white dark:bg-gray-700 rounded-lg shadow p-5 border-l-4 ${stat.border} transition hover:shadow-lg cursor-pointer`}
      onClick={() => {
        if (stat.title.includes("Verified")) setActiveTab("posts");
        else if (stat.title.includes("Alerts")) setActiveTab("alerts");
        else if (stat.title.includes("Shelters")) setActiveTab("shelters");
      }}
    >
      <div className="flex items-center space-x-4">
        {stat.icon}
        <div>
          <p className="text-gray-600 dark:text-gray-300 font-medium">{stat.title}</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.count}</p>
        </div>
      </div>
    </div>
  ))}
</div>


      {/* Map Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-8">
  <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-4">South Asian Ocean Hazard Map</h2>
  <div className="h-[500px] rounded-md overflow-hidden shadow-inner">
    <DisasterMap shelters={shelters} />
  </div>
</div>


      {/* Editable Dashboard Button */}
      {editable && setEditingDashboard && (
        <div className="mt-6 text-right">
          <button
            onClick={() => setEditingDashboard(true)}
            className="bg-primary text-white px-4 py-2 rounded-md font-medium flex items-center hover:bg-primary/80"
          >
            <Edit className="w-4 h-4 mr-2" /> Edit Dashboard
          </button>
        </div>
      )}

      {/* Analytics Overview */}
      {userRole !== "citizen" && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-8">
          <h2 className="text-lg font-semibold text-primary dark:text-white">Analytics Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              <p className="font-medium">Total Reports</p>
              <p className="text-xl font-bold">1,254</p>
            </div>
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-200">
              <p className="font-medium">Verified Reports</p>
              <p className="text-xl font-bold">1,024</p>
            </div>
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-200">
              <p className="font-medium">Active Alerts</p>
              <p className="text-xl font-bold">15</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
