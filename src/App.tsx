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

  // Example state (replace with real API data later)
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

  // Dark mode
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("bg-gray-900", "text-white");
    } else {
      document.body.classList.remove("bg-gray-900", "text-white");
    }
  }, [darkMode]);

  // Mobile menu navigation
  const navTabs = [
    { key: "dashboard", label: "Dashboard" },
    { key: "report", label: "Report" },
    { key: "posts", label: "Posts" },
    { key: "alerts", label: "Alerts" },
    { key: "shelters", label: "Shelters" },
    { key: "profile", label: "Profile" },
  ];

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} min-h-screen`}>
      {/* Language switcher */}
      <div className="fixed top-4 left-4 z-50">
        <select
          onChange={(e) => i18n.changeLanguage(e.target.value)}
          className="px-3 py-2 rounded border border-blue-300 bg-white text-blue-700 font-medium"
        >
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
          <option value="mr">मराठी</option>
        </select>
      </div>

      {/* Dark mode toggle */}
      <div className="fixed top-20 left-6 z-50">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`w-12 h-12 flex items-center justify-center rounded-full shadow border-2
            ${darkMode ? "bg-gray-800 border-yellow-300 text-yellow-300" : "bg-white border-blue-700 text-blue-700"}`}
        >
          {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>
      </div>

      {/* Role switcher */}
      <div className="fixed top-4 right-4 z-50">
        <select
          value={userRole}
          onChange={(e) => setUserRole(e.target.value as "citizen" | "official" | "analyst")}
          className="px-3 py-2 rounded border border-blue-300 bg-white text-blue-700 font-medium"
        >
          <option value="citizen">Citizen</option>
          <option value="official">Official</option>
          <option value="analyst">Analyst</option>
        </select>
      </div>

      {/* Navbar */}
      <nav className="bg-white shadow-lg border-b-4 border-blue-600 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between h-16 px-4">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-blue-600 mr-2" />
            <span className="font-bold text-xl">OceanGuard</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            {navTabs.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}>{tab.label}</button>
            ))}
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>{mobileMenuOpen ? <X /> : <Menu />}</button>
          </div>
        </div>
        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white border-t border-blue-600 px-4 py-2"
            >
              {navTabs.map(tab => (
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
      <main className="pt-20">
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
      </main>

      {/* Chatbot only for citizens */}
      {userRole === "citizen" && <Chatbot />}
    </div>
  );
}

export default App;
