import React, { useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import i18n from "./lang_op";

import Chatbot from "./components/Chatbot";
import Dashboard from "./components/dashboard";
import Alerts from "./components/alerts";
import PostsFeed from "./components/postfeed";
import ReportForm from "./components/reportform";
import ShelterFinder from "./components/shelter";
import Profile from "./components/profile";

import { useDarkMode } from "./DarkModeContext";
import WaveIcon from "./components/icons/WaveIcon";
import { useSos } from "./SosContext";

// Example officials
const verifiedOfficials = [
  { id: 1, name: "John Doe", designation: "Police Inspector", department: "Police Department", contact: "123-456-7890", region: "Downtown" },
  { id: 2, name: "Jane Smith", designation: "Fire Chief", department: "Fire Department", contact: "987-654-3210", region: "Uptown" },
  { id: 3, name: "Dr. Emily Brown", designation: "Medical Officer", department: "Health Department", contact: "555-123-4567", region: "Midtown" },
];

function App() {
  return <AppContent />;
}

function AppContent() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<"citizen" | "official" | "analyst">("citizen");
  const [editingDashboard, setEditingDashboard] = useState(false);
  const { sendSos } = useSos();
  const [showConfirm, setShowConfirm] = useState(false);
  const [sosMessage, setSosMessage] = useState("");

  const todayStats = { totalReports: 127, verifiedReports: 89, activeAlerts: 12, sheltersActive: 45 };

  const [shelters, setShelters] = useState([
    {
      id: 1,
      name: "Chennai Relief Center",
      address: "123 Main St, Chennai",
      capacity: 200,
      available: 50,
      contact: "9876543210",
      distance: "2 km",
      facilities: ["Food", "Water", "Medical"],
      lat: 13.0827,
      lng: 80.2707,
    },
    {
      id: 2,
      name: "Marina Beach Shelter",
      address: "Marina Beach, Chennai",
      capacity: 300,
      available: 120,
      contact: "9876500001",
      distance: "3.5 km",
      facilities: ["Food", "Water", "Blankets"],
      lat: 13.0499,
      lng: 80.2824,
    },
    {
      id: 3,
      name: "Royapuram Community Hall",
      address: "Royapuram, Chennai",
      capacity: 150,
      available: 60,
      contact: "9876500002",
      distance: "5.2 km",
      facilities: ["Water", "Medical"],
      lat: 13.1180,
      lng: 80.2931,
    },
    {
      id: 4,
      name: "Mumbai Emergency Shelter",
      address: "Mumbai, Maharashtra",
      capacity: 500,
      available: 0,
      contact: "022-0000000",
      distance: "-",
      facilities: ["Food", "Water", "Medical", "Blankets"],
      lat: 19.0760,
      lng: 72.8777,
    },
    {
      id: 5,
      name: "Visakhapatnam Relief Camp",
      address: "Visakhapatnam, Andhra Pradesh",
      capacity: 300,
      available: 15,
      contact: "0891-000000",
      distance: "-",
      facilities: ["Food", "Water"],
      lat: 17.6868,
      lng: 83.2185,
    },
    {
      id: 6,
      name: "Kochi Community Center",
      address: "Kochi, Kerala",
      capacity: 250,
      available: 60,
      contact: "0484-000000",
      distance: "-",
      facilities: ["Water", "Medical"],
      lat: 9.9312,
      lng: 76.2673,
    },
  ]);

  const officialUpdates = [
    { id: 1, title: "Cyclone Alert", content: "Cyclone expected near Chennai.", timestamp: "1h ago", priority: "critical", author: "Dr. Rajesh Kumar" },
    { id: 2, title: "Flood Warning", content: "Heavy rainfall may cause flooding in low-lying areas.", timestamp: "30m ago", priority: "high", author: "IMD Official" },
    { id: 3, title: "Shelter Opened", content: "New relief shelter opened at Marina Beach.", timestamp: "10m ago", priority: "medium", author: "Chennai Corporation" },
    { id: 4, title: "Power Outage", content: "Scheduled power outage in coastal areas for safety.", timestamp: "5m ago", priority: "high", author: "TNEB" },
    { id: 5, title: "Medical Camp", content: "Free medical camp at Community Hall, Besant Nagar.", timestamp: "just now", priority: "medium", author: "Health Dept" },
  ];

  const reports = [
    { id: 1, type: "Cyclone", location: "Chennai", time: "2h ago", description: "Strong winds observed", verified: true, upvotes: 20, downvotes: 2, official: true, status: "verified", comments: [{ user: "Amit", text: "Stay safe!" }], severity: "High" },
  ];

  const currentUser = { name: "John Doe", avatar: "https://i.pravatar.cc/100" };

  const [reportForm, setReportForm] = useState({ description: "", address: "", location: null, type: "", severity: "", tags: [] });

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setReportForm((prev) => ({
          ...prev,
          location: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          address: `Lat: ${pos.coords.latitude.toFixed(2)}, Lng: ${pos.coords.longitude.toFixed(2)}`,
        }));
      });
    }
  };

  const navTabs = [
    { key: "dashboard", label: "Dashboard" },
    { key: "report", label: "Report" },
    { key: "posts", label: "Posts" },
    { key: "alerts", label: "Alerts" },
    { key: "shelters", label: "Shelters" },
    { key: "profile", label: "Profile" },
  ];

  const handleConfirmSos = async () => {
    setShowConfirm(false);
    await sendSos({
      user: { name: currentUser.name, phone: currentUser.avatar, email: currentUser.name + "@email.com", role: "citizen" },
      message: sosMessage || undefined,
    });
    setSosMessage("");
  };

  return (
    // Outer div applies the dark mode class globally
    <div className={darkMode ? "dark" : ""}>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-6">
        {/* Navbar */}
        <nav className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <WaveIcon className="text-primary w-8 h-8" />
            <span className="font-bold text-xl text-primary">SAMUDRASETU</span>
          </div>

          <div className="hidden md:flex space-x-8">
            {navTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`font-medium hover:text-primary ${activeTab === tab.key ? "text-primary underline" : "text-gray-600 dark:text-gray-300"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <button onClick={toggleDarkMode} className="p-2 rounded bg-gray-200 dark:bg-gray-700">
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value as "citizen" | "official" | "analyst")}
              className="rounded border px-2 py-1 bg-white dark:bg-gray-700"
            >
              <option value="citizen">Citizen</option>
              <option value="official">Official</option>
              <option value="analyst">Analyst</option>
            </select>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2">
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-8"
            >
              {navTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left py-2 font-medium ${activeTab === tab.key ? "text-primary underline" : "text-gray-600 dark:text-gray-300"}`}
                >
                  {tab.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && (
            <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Dashboard todayStats={todayStats} setActiveTab={setActiveTab} shelters={shelters} editable={userRole === "official"} setEditingDashboard={setEditingDashboard} userRole={userRole} />
            </motion.div>
          )}
          {activeTab === "report" && (
            <motion.div key="report" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ReportForm reportForm={reportForm} setReportForm={setReportForm} getCurrentLocation={getCurrentLocation} />
            </motion.div>
          )}
          {activeTab === "posts" && (
            <motion.div key="posts" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <PostsFeed reports={reports} />
            </motion.div>
          )}
          {activeTab === "alerts" && (
            <motion.div key="alerts" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Alerts officialUpdates={officialUpdates} />
            </motion.div>
          )}
          {activeTab === "shelters" && (
            <motion.div key="shelters" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ShelterFinder shelters={shelters} userRole={userRole} />
            </motion.div>
          )}
          {activeTab === "profile" && (
            <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Profile currentUser={currentUser} verifiedOfficials={verifiedOfficials} userRole={userRole} Chatbot={Chatbot} />
            </motion.div>
          )}
        </AnimatePresence>

        {userRole === "citizen" && <Chatbot />}

		{/* Floating SOS button for citizens */}
		{userRole === "citizen" && (
			<>
				<button
					onClick={() => setShowConfirm(true)}
					className="fixed top-24 right-6 z-50 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-full shadow-2xl"
					style={{ width: 96, height: 96 }}
					aria-label="Send SOS"
				>
					SOS
				</button>

				{/* Confirm Modal */}
				<AnimatePresence>
					{showConfirm && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
						>
							<motion.div
								initial={{ scale: 0.95, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								exit={{ scale: 0.95, opacity: 0 }}
								className="bg-white dark:bg-gray-800 rounded-xl p-6 w-11/12 max-w-md shadow-xl"
							>
								<h3 className="text-2xl font-bold text-red-600 mb-3">Confirm SOS</h3>
								<p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Your location and basic details will be shared with authorities.</p>
								<textarea
									value={sosMessage}
									onChange={(e) => setSosMessage(e.target.value)}
									placeholder="Optional: Add details (injuries, people count, landmarks)"
									className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md mb-4 dark:bg-gray-700 dark:text-white"
									rows={3}
								/>
								<div className="flex items-center justify-end space-x-3">
									<button
										onClick={() => setShowConfirm(false)}
										className="px-5 py-3 rounded-lg font-semibold bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
									>
										Cancel
									</button>
									<button
										onClick={handleConfirmSos}
										className="px-6 py-3 rounded-lg font-extrabold text-white bg-red-600 hover:bg-red-700"
									>
										CONFIRM SOS
									</button>
								</div>
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>
			</>
		)}
      </div>
    </div>
  );
}

export default App;
