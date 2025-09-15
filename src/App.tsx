import React, { useState, useEffect } from "react";
import { Shield, Menu, X, Sun, Moon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import i18n from "./lang_op";

import Chatbot from "./components/Chatbot";
import Dashboard from "./components/dashboard";
import Alerts from "./components/alerts";
import PostsFeed from "./components/postfeed";
import ReportForm from "./components/reportform";
import ShelterFinder from "./components/shelter";
import Profile from "./components/profile";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [userRole, setUserRole] = useState<"citizen" | "official" | "analyst">("citizen");
  const [editingDashboard, setEditingDashboard] = useState(false);

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
    },
  ]);

  const officialUpdates = [
    { id: 1, title: "Cyclone Alert", content: "Cyclone expected near Chennai.", timestamp: "1h ago", priority: "critical", author: "Dr. Rajesh Kumar" },
  ];

  const reports = [
    {
      id: 1,
      type: "Cyclone",
      location: "Chennai",
      time: "2h ago",
      description: "Strong winds observed",
      verified: true,
      upvotes: 20,
      downvotes: 2,
      official: true,
      status: "verified",
      comments: [{ user: "Amit", text: "Stay safe!" }],
      severity: "High",
    },
  ];

  const currentUser = { name: "John Doe", avatar: "https://i.pravatar.cc/100" };
  const verifiedOfficials = [
    { id: 1, name: "Dr. Rajesh Kumar", designation: "Meteorologist", department: "IMD", contact: "+91-11-24631913", region: "National" },
  ];

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

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const navTabs = [
    { key: "dashboard", label: "Dashboard" },
    { key: "report", label: "Report" },
    { key: "posts", label: "Posts" },
    { key: "alerts", label: "Alerts" },
    { key: "shelters", label: "Shelters" },
    { key: "profile", label: "Profile" },
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-6">
      
      {/* Navbar */}
      <nav className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 flex justify-between items-center mb-8">
        <div className="flex items-center space-x-2">
          <Shield className="text-primary w-8 h-8" />
          <span className="font-bold text-xl text-primary">SamudraSetu</span>
        </div>

        <div className="hidden md:flex space-x-8">
          {navTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`font-medium hover:text-primary ${
                activeTab === tab.key ? "text-primary underline" : "text-gray-600 dark:text-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded bg-gray-200 dark:bg-gray-700"
          >
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

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white dark:bg-gray-800 mt-4 rounded shadow-lg p-4"
            >
              {navTabs.map((tab) => (
                <button
                  key={tab.key}
                  className="block w-full text-left py-2"
                  onClick={() => {
                    setActiveTab(tab.key);
                    setMobileMenuOpen(false);
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {activeTab === "dashboard" && (
          <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Dashboard
              todayStats={todayStats}
              setActiveTab={setActiveTab}
              shelters={shelters}
              editable={userRole === "official"}
              setEditingDashboard={setEditingDashboard}
              userRole={userRole}
            />
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
    </div>
  );
}

export default App;
