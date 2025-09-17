import React from "react";
import { TrendingUp, CheckCircle, Bell, Home, Edit, MapPin, User } from "lucide-react";
import DisasterMap from "../DisasterMap";
import { useSos } from "../SosContext";

type Props = {
	todayStats: { totalReports: number; verifiedReports: number; activeAlerts: number; sheltersActive: number };
	shelters: any[];
	setActiveTab: (tab: string) => void;
	editable?: boolean;
	setEditingDashboard?: (val: boolean) => void;
	userRole: "citizen" | "official" | "analyst";
};

const Dashboard: React.FC<Props> = ({ todayStats, shelters, setActiveTab, editable, setEditingDashboard, userRole }) => {
	const { sosList } = useSos();
	return (
		<div className="py-8">
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Left: Stats Cards */}
				<div className="space-y-6">
					{[
						{ title: "Total Reports", count: todayStats.totalReports, icon: <TrendingUp className="w-6 h-6 text-blue-600" />, border: "border-blue-600" },
						{ title: "Verified Reports", count: todayStats.verifiedReports, icon: <CheckCircle className="w-6 h-6 text-teal-600" />, border: "border-teal-600" },
						{ title: "Active Alerts", count: todayStats.activeAlerts, icon: <Bell className="w-6 h-6 text-red-600" />, border: "border-red-600" },
						{ title: "Active Shelters", count: todayStats.sheltersActive, icon: <Home className="w-6 h-6 text-blue-600" />, border: "border-blue-600" },
					].map((stat, idx) => (
						<button
							key={idx}
							className={`w-full text-left bg-white dark:bg-gray-700 rounded-lg shadow p-5 border-l-4 ${stat.border} transition hover:shadow-lg`}
							onClick={() => {
								if (stat.title.includes("Total Reports")) setActiveTab("report");
								else if (stat.title.includes("Verified")) setActiveTab("posts");
								else if (stat.title.includes("Alerts")) setActiveTab("alerts");
								else if (stat.title.includes("Shelters")) setActiveTab("shelters");
							}}
							type="button"
						>
							<div className="flex items-center space-x-4">
								{stat.icon}
								<div>
									<p className="text-gray-600 dark:text-gray-300 font-medium">{stat.title}</p>
									<p className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.count}</p>
								</div>
							</div>
						</button>
					))}
				</div>

				{/* Right: Map */}
				<div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
					<h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-4">Hotspot Map</h2>
					<div className="h-[500px] rounded-md overflow-hidden shadow-inner">
						<DisasterMap shelters={shelters} />
					</div>
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

			{/* SOS Inbox for officials/analysts */}
			{userRole !== "citizen" && sosList.length > 0 && (
				<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-8">
					<h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">Incoming SOS</h2>
					<div className="space-y-3 max-h-96 overflow-auto pr-2">
						{sosList.map((sos) => (
							<div key={sos.id} className="border border-red-300 dark:border-red-700 rounded-md p-4">
								<div className="flex items-center justify-between mb-2">
									<div className="flex items-center text-gray-900 dark:text-white font-semibold">
										<User className="w-4 h-4 mr-2 text-red-600" />
										{sos.user.name}
									</div>
									<span className="text-xs text-gray-500">{new Date(sos.timestamp).toLocaleString()}</span>
								</div>
								<div className="text-sm text-gray-700 dark:text-gray-300 mb-2">
									{sos.message || "No message provided"}
								</div>
								<div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
									<MapPin className="w-4 h-4 mr-1" />
									{typeof sos.location?.lat === "number" && typeof sos.location?.lng === "number"
										? `${sos.location.lat.toFixed(5)}, ${sos.location.lng.toFixed(5)}`
										: "Location unavailable"}
								</div>
								<div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
									<strong>Contact:</strong> {sos.user.phone || "-"} • {sos.user.email || "-"}
								</div>
							</div>
						))}
					</div>
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
