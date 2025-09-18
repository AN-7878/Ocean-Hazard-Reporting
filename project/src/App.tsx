import React, { useState, useEffect } from 'react';


import { 
  MapPin, 
  AlertTriangle, 
  Users, 
  
  User, 
  Menu, 
  X, 
  Bell,
  Phone,
  MessageSquare,
  Home,
  Navigation,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  Upload,
  Mic,
  Send,
  ThumbsUp,
  ThumbsDown,
  Badge,
  Edit,
  Plus,
  Search,
  Filter,
  MapPinIcon,
  Settings,
  UserCheck,
  Building,
  Moon,
  Sun
} from 'lucide-react';
import WaveIcon from './components/icons/WaveIcon';
import Chatbot from './Chatbot';
import DisasterMap from './DisasterMap';



type ReportComment = { user: string; text: string };
type CommunityReport = {
  id: number;
  type?: string;
  name?: string;
  location: string;
  time: string;
  description: string;
  verified: boolean;
  upvotes: number;
  downvotes: number;
  official: boolean;
  status: string;
  comments: ReportComment[];
  severity?: string;
};

const currentUser = {
  name: "John Doe",
  avatar: "https://i.pravatar.cc/100"
};

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [addingShelter, setAddingShelter] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    verification: 'all',
    severity: 'all'
  });
  const [reportForm, setReportForm] = useState({
    type: '',
    severity: '',
    description: '',
    address: '',
    tags: [],
    location: null
  });
  const [newShelter, setNewShelter] = useState({
    name: '',
    address: '',
    capacity: '',
    contact: ''
  });
  const [userRole, setUserRole] = useState<'citizen' | 'official' | 'analyst'>('citizen');
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [editingDashboard, setEditingDashboard] = useState(false);
  const [showAlertNotification, setShowAlertNotification] = useState(false);
  const [latestAlert, setLatestAlert] = useState(null);
  const [darkMode, setDarkMode] = useState(false);



  const hazardTypes = [
    'Cyclone', 'Tsunami', 'Coastal Flooding', 'Storm Surge', 'High Waves', 'Erosion'
  ];

  const verifiedOfficials = [
    {
      id: 1,
      name: 'Dr. Rajesh Kumar',
      designation: 'Chief Meteorologist',
      department: 'India Meteorological Department',
      contact: '+91-11-24631913',
      email: 'rajesh.kumar@imd.gov.in',
      region: 'National',
      verified: true
    },
    {
      id: 2,
      name: 'Ms. Priya Sharma',
      designation: 'Disaster Management Officer',
      department: 'Tamil Nadu SDMA',
      contact: '+91-44-28411411',
      email: 'priya.sharma@tn.gov.in',
      region: 'Tamil Nadu',
      verified: true
    },
    {
      id: 3,
      name: 'Commander Arjun Singh',
      designation: 'Coast Guard Operations',
      department: 'Indian Coast Guard',
      contact: '+91-22-24385065',
      email: 'arjun.singh@indiancoastguard.nic.in',
      region: 'Western Coast',
      verified: true
    },
    {
      id: 4,
      name: 'Dr. Meera Nair',
      designation: 'Marine Scientist',
      department: 'INCOIS',
      contact: '+91-40-23886047',
      email: 'meera.nair@incois.gov.in',
      region: 'Hyderabad',
      verified: true
    },
    {
      id: 5,
      name: 'Mr. Suresh Reddy',
      designation: 'Emergency Response Coordinator',
      department: 'Andhra Pradesh SDMA',
      contact: '+91-40-23386047',
      email: 'suresh.reddy@ap.gov.in',
      region: 'Andhra Pradesh',
      verified: true
    }
  ];

  const [communityReports, setCommunityReports] = useState<CommunityReport[]>([
    {
      id: 1,
      type: 'Cyclone',
      location: 'Chennai, Tamil Nadu',
      time: '2 hours ago',
      description: 'Strong winds and heavy rainfall observed',
      verified: true,
      upvotes: 45,
      downvotes: 2,
      official: true,
      status: 'verified',
      comments: [
        { user: 'Amit', text: 'Stay safe everyone!' },
        { user: 'Priya', text: 'Evacuation started in my area.' }
      ],
      severity: 'High'
    },
    {
      id: 2,
      type: 'Storm Surge',
      location: 'Mumbai, Maharashtra',
      time: '4 hours ago',
      description: 'Water levels rising rapidly near coastal areas',
      verified: false,
      upvotes: 23,
      downvotes: 1,
      official: false,
      status: 'pending',
      comments: [],
      severity: 'Moderate'
    },
    {
      id: 3,
      type: 'High Waves',
      location: 'Kochi, Kerala',
      time: '6 hours ago',
      description: 'Unusual wave patterns detected',
      verified: true,
      upvotes: 12,
      downvotes: 0,
      official: false,
      status: 'verified',
      comments: [],
      severity: 'Low'
    },
    {
      id: 4,
      type: 'Coastal Flooding',
      location: 'Visakhapatnam, Andhra Pradesh',
      time: '8 hours ago',
      description: 'Flooding reported in low-lying coastal areas',
      verified: false,
      upvotes: 18,
      downvotes: 3,
      official: false,
      status: 'unverified',
      comments: [],
      severity: 'High'
    },
    {
      id: 5,
      type: 'Tsunami Warning',
      location: 'Promenade Beach, Puducherry',
      time: '1 hour ago',
      description: 'Seismic activity detected, potential tsunami risk',
      verified: true,
      upvotes: 67,
      downvotes: 0,
      official: true,
      status: 'verified',
      comments: [],
      severity: 'Critical'
    }
  ]);

  const shelters = [
    {
      id: 1,
      name: 'Chennai Relief Center',
      address: '123 Main St, Chennai',
      capacity: 200,
      available: 50,
      contact: '9876543210',
      distance: '2 km',
      facilities: ['Food', 'Water', 'Medical'],
      lat: 13.0827,
      lng: 80.2707
    },
    {
      id: 2,
      name: 'Mumbai Coastal Shelter',
      address: 'Bandra West, Mumbai, Maharashtra',
      capacity: 800,
      available: 456,
      contact: '+91-22-26420001',
      distance: '5.1 km',
      facilities: ['Medical Aid', 'Food', 'Water', 'Communication'],
      lat: 19.0760,
      lng: 72.8777
    },
    {
      id: 3,
      name: 'Kochi Emergency Center',
      address: 'Marine Drive, Kochi, Kerala',
      capacity: 300,
      available: 178,
      contact: '+91-484-2371471',
      distance: '3.7 km',
      facilities: ['Medical Aid', 'Food', 'Water', 'Childcare'],
      lat: 9.9312,
      lng: 76.2673
    },
    {
      id: 4,
      name: 'Visakhapatnam Safe Haven',
      address: 'Beach Road, Visakhapatnam, Andhra Pradesh',
      capacity: 600,
      available: 289,
      contact: '+91-891-2564242',
      distance: '4.2 km',
      facilities: ['Medical Aid', 'Food', 'Water', 'Pet Care'],
      lat: 17.6868,
      lng: 83.2185
    },
    {
      id: 5,
      name: 'Puducherry Relief Camp',
      address: 'Promenade Beach, Puducherry',
      capacity: 250,
      available: 156,
      contact: '+91-413-2334567',
      distance: '6.8 km',
      facilities: ['Medical Aid', 'Food', 'Water', 'Blankets'],
      lat: 11.9139,
      lng: 79.8145
    }
  ];

  const todayStats = {
    totalReports: 127,
    verifiedReports: 89,
    activeAlerts: 12,
    sheltersActive: 45
  };

  const officialUpdates = [
    {
      id: 1,
      title: 'Cyclone Michaung Update',
      content: 'Cyclone expected to make landfall near Chennai by evening. All coastal areas advised to evacuate.',
      timestamp: '1 hour ago',
      priority: 'critical',
      author: 'Dr. Rajesh Kumar'
    },
    {
      id: 2,
      title: 'Shelter Capacity Alert',
      content: 'Chennai Relief Center approaching full capacity. Additional shelters being opened.',
      timestamp: '3 hours ago',
      priority: 'high',
      author: 'Ms. Priya Sharma'
    },
    {
      id: 3,
      title: 'Tsunami Warning',
      content: 'Seismic activity detected off the coast of Puducherry. Residents advised to move to higher ground.',
      timestamp: '30 minutes ago',
      priority: 'critical',
      author: 'Commander Arjun Singh'
    },
    {
      id: 4,
      title: 'Flooding in Kochi',
      content: 'Heavy rainfall causing flooding in low-lying areas of Kochi. Emergency services deployed.',
      timestamp: '2 hours ago',
      priority: 'high',
      author: 'Dr. Meera Nair'
    },
    {
      id: 5,
      title: 'Storm Surge Alert',
      content: 'Storm surge expected along Mumbai coastline. Fishermen advised to avoid venturing out.',
      timestamp: '4 hours ago',
      priority: 'high',
      author: 'Ms. Priya Sharma'
    },
    {
      id: 6,
      title: 'High Waves Warning',
      content: 'Unusual wave patterns detected near Visakhapatnam. Beach access restricted.',
      timestamp: '1 hour ago',
      priority: 'moderate',
      author: 'Mr. Suresh Reddy'
    },
    {
      id: 7,
      title: 'Erosion Risk',
      content: 'Coastal erosion risk increased in Western Coast. Monitoring teams activated.',
      timestamp: '5 hours ago',
      priority: 'moderate',
      author: 'Commander Arjun Singh'
    },
    {
      id: 8,
      title: 'Medical Aid Required',
      content: 'Medical teams requested at Mumbai Coastal Shelter due to increased injuries.',
      timestamp: '45 minutes ago',
      priority: 'high',
      author: 'Ms. Priya Sharma'
    },
    {
      id: 9,
      title: 'Power Outage',
      content: 'Power outage reported in Chennai Relief Center. Backup generators being used.',
      timestamp: '20 minutes ago',
      priority: 'moderate',
      author: 'Dr. Rajesh Kumar'
    },
    {
      id: 10,
      title: 'Evacuation Notice',
      content: 'Mandatory evacuation for residents near Promenade Beach, Puducherry.',
      timestamp: '10 minutes ago',
      priority: 'critical',
      author: 'Mr. Suresh Reddy'
    },
    {
      id: 11,
      title: 'Water Supply Disruption',
      content: 'Water supply disrupted in Kochi Emergency Center. Bottled water being distributed.',
      timestamp: '1 hour ago',
      priority: 'moderate',
      author: 'Dr. Meera Nair'
    },
    {
      id: 12,
      title: 'Pet Rescue Operations',
      content: 'Pet rescue operations ongoing in Visakhapatnam Safe Haven.',
      timestamp: '2 hours ago',
      priority: 'low',
      author: 'Commander Arjun Singh'
    }
  ];

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setReportForm({
            ...reportForm,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            },
            address: `Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)}`
          });
        },
        (error) => {
          alert('Unable to get location. Please enter address manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  // Filter reports
  const filteredReports = communityReports.filter(report => {
    const matchesSearch = report.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesVerification = selectedFilters.verification === 'all' || 
                               report.status === selectedFilters.verification;
    
    return matchesSearch && matchesVerification;
  });

  // Add "alerts" tab to availableTabs
  const availableTabs = userRole === 'citizen'
    ? ['dashboard', 'report', 'posts', 'alerts', 'shelters', 'profile']
    : ['dashboard', 'report', 'posts', 'alerts', 'shelters', 'profile', 'analytics', 'admin'];

  const NavigationBar = () => (
    <nav className="bg-white shadow-lg border-b-4 border-blue-600 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <WaveIcon className="h-8 w-8 text-blue-600 mr-2" />
            <span className="font-bold text-xl text-gray-900">SAMUDRASETU</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {availableTabs.includes('dashboard') && (
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'dashboard' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                <MapPin className="w-4 h-4 mr-1" />
                Dashboard
              </button>
            )}
            {availableTabs.includes('report') && (
              <button
                onClick={() => setActiveTab('report')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'report' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                <AlertTriangle className="w-4 h-4 mr-1" />
                Report
              </button>
            )}
            {availableTabs.includes('posts') && (
              <button
                onClick={() => setActiveTab('posts')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'posts' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                <Users className="w-4 h-4 mr-1" />
                Posts
              </button>
            )}
            {availableTabs.includes('alerts') && (
              <button
                onClick={() => setActiveTab('alerts')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'alerts' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                <Bell className="w-4 h-4 mr-1" />
                Alerts
              </button>
            )}
            {availableTabs.includes('shelters') && (
              <button
                onClick={() => setActiveTab('shelters')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'shelters' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                <Home className="w-4 h-4 mr-1" />
                Shelters
              </button>
            )}
            {availableTabs.includes('profile') && (
        <button
            onClick={() => setActiveTab('profile')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
               activeTab === 'profile' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:text-blue-600'
          }`}
          >
          <img 
          src={currentUser.avatar} 
          alt="Profile" 
          className="w-8 h-8 rounded-full border border-gray-300" 
         />
          <span>{currentUser.name}</span>
          </button>
      )}

          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-50">
           {availableTabs.map((tab) => (
  <button
    key={tab}
    onClick={() => {
      setActiveTab(tab);
      setMobileMenuOpen(false);
    }}
    className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium capitalize transition-colors ${
      activeTab === tab ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:text-blue-600'
    }`}
  >
    {tab === "profile" ? (
      <div className="flex items-center space-x-2">
        <img 
          src={currentUser.avatar} 
          alt="Profile" 
          className="w-6 h-6 rounded-full border border-gray-300" 
        />
        <span>{currentUser.name}</span>
      </div>
    ) : (
      tab
    )}
  </button>
))}

            </div>
          </div>
        )}
      </div>
    </nav>
  );

  const SOSAlert = () => (
    showAlert && (
      <div className="fixed top-20 right-4 bg-red-600 text-white p-4 rounded-lg shadow-lg z-50 animate-pulse">
        <div className="flex items-center">
          <AlertCircle className="w-6 h-6 mr-2" />
          <div>
            <p className="font-bold">SOS ALERT</p>
            <p className="text-sm">Emergency reported in Visakhapatnam</p>
            <button 
              onClick={() => setShowAlert(false)}
              className="mt-2 bg-white text-red-600 px-3 py-1 rounded text-sm font-medium"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    )
  );

  // Add state for SOS confirmation modal
  const [showSOSConfirm, setShowSOSConfirm] = useState(false);

  // Utility class for tab content container
  const tabContainerClass = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full";

  const Dashboard = ({ editable }: { editable?: boolean }) => (
    <div className={tabContainerClass} style={{ backgroundColor: 'white' }}>
      {/* Stats + Map Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-6 w-full px-6">
        {/* Stats Section (Left side) */}
        <div className="h-[600px] grid grid-rows-4 gap-6">
          {/* Total Reports Today (no link) */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 
                          transition-transform duration-200 hover:scale-105 hover:shadow-xl cursor-pointer flex items-center">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Reports Today</p>
              <p className="text-2xl font-bold text-gray-900">{todayStats.totalReports}</p>
            </div>
          </div>

          {/* Verified Reports - link to Posts tab */}
          <button
            className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500 
                        transition-transform duration-200 hover:scale-105 hover:shadow-xl cursor-pointer flex items-center w-full text-left"
            onClick={() => setActiveTab('posts')}
          >
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Verified Reports</p>
              <p className="text-2xl font-bold text-gray-900">{todayStats.verifiedReports}</p>
              <span className="text-xs text-green-600">View Posts</span>
            </div>
          </button>

          {/* Active Alerts - link to Alerts tab */}
          <button
            className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500 
                        transition-transform duration-200 hover:scale-105 hover:shadow-xl cursor-pointer flex items-center w-full text-left"
            onClick={() => setActiveTab('alerts')}
          >
            <Bell className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Alerts</p>
              <p className="text-2xl font-bold text-gray-900">{todayStats.activeAlerts}</p>
              <span className="text-xs text-red-600">View Alerts</span>
            </div>
          </button>

          {/* Active Shelters - link to Shelters tab */}
          <button
            className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500 
                        transition-transform duration-200 hover:scale-105 hover:shadow-xl cursor-pointer flex items-center w-full text-left"
            onClick={() => setActiveTab('shelters')}
          >
            <Home className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Shelters</p>
              <p className="text-2xl font-bold text-gray-900">{todayStats.sheltersActive}</p>
              <span className="text-xs text-purple-600">View Shelters</span>
            </div>
          </button>
        </div>

        {/* Map Section (Right side) */}
        <div className="md:col-span-2 bg-white rounded-lg shadow-md overflow-hidden h-[600px]">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">South Asian Ocean Hazard Map</h2>
            <p className="text-sm text-gray-600">Real-time hazard monitoring and shelter locations</p>
          </div>
          <div className="h-[calc(100%-64px)]">
            <DisasterMap shelters={shelters} />
          </div>
        </div>
      </div>

      {editable && (
  <div className="mt-8 flex justify-end">
    <button
      className="bg-[#5899E2] text-white px-4 py-2 rounded-md font-medium hover:bg-[#4177b7] transition-colors flex items-center"
      onClick={() => setEditingDashboard(true)}
    >
      <Edit className="w-4 h-4 mr-2" />
      Edit Dashboard
    </button>
  </div>
)}

      {/* Official/Analyst-only features, e.g., analytics, admin controls */}
      {userRole !== 'citizen' && (
        <div>
          {/* Example: Analytics Overview */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Analytics Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-600">Total Reports</p>
                <p className="text-2xl font-bold text-gray-900">1,254</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-600">Verified Reports</p>
                <p className="text-2xl font-bold text-gray-900">1,024</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                <p className="text-2xl font-bold text-gray-900">15</p>
              </div>
            </div>
          </div>

          {/* Admin Controls */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Admin Controls</h2>
            <button className="bg-[#45C476] text-white px-4 py-2 rounded-md font-medium hover:bg-[#349c5a] transition-colors">
              Emergency Broadcast
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const ReportForm = () => (
    <div className={tabContainerClass} style={{ backgroundColor: 'white' }}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-orange-50">
          <h2 className="text-lg font-semibold text-gray-900">Report Ocean Hazard</h2>
          <p className="text-sm text-gray-600">Quick and efficient hazard reporting for community safety</p>
        </div>
        <div className="p-6 space-y-6">
          {/* Hazard Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hazard Type</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {hazardTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setReportForm({...reportForm, type})}
                  className={`p-3 text-sm border rounded-md transition-colors ${
                    reportForm.type === type 
                      ? 'border-[#5899E2] bg-[#5899E2] text-white' 
                      : 'border-gray-300 hover:border-[#5899E2] hover:bg-[white]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          {/* Severity Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Severity Level</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { level: 'Low', color: 'bg-green-500', textColor: 'text-green-700' },
                { level: 'Moderate', color: 'bg-yellow-500', textColor: 'text-yellow-700' },
                { level: 'High', color: 'bg-orange-500', textColor: 'text-orange-700' },
                { level: 'Critical', color: 'bg-red-500', textColor: 'text-red-700' }
              ].map((level) => (
                <button
                  key={level.level}
                  onClick={() => setReportForm({...reportForm, severity: level.level})}
                  className={`p-3 text-sm border rounded-md transition-colors flex items-center ${
                    reportForm.severity === level.level 
                      ? 'border-[#45C476] bg-[#45C476] text-white' 
                      : 'border-gray-300 hover:border-[#45C476] hover:bg-[white]'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${level.color} mr-2`}></div>
                  {level.level}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5899E2]"
              rows={3}
              placeholder="Describe the hazard situation..."
              value={reportForm.description}
              onChange={(e) => setReportForm({...reportForm, description: e.target.value})}
            />
          </div>

          {/* Location with auto-detect */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location/Address</label>
            <div className="flex space-x-2">
              <input
                type="text"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5899E2]"
                placeholder="Enter location or address..."
                value={reportForm.address}
                onChange={(e) => setReportForm({...reportForm, address: e.target.value})}
              />
              <button
                onClick={getCurrentLocation}
                className="bg-[#5899E2] text-white px-4 py-2 rounded-md hover:bg-[#4177b7] transition-colors flex items-center"
              >
                <MapPinIcon className="w-4 h-4 mr-1" />
                Auto-detect
              </button>
            </div>
            {reportForm.location && (
              <p className="text-sm text-green-600 mt-1">Location detected successfully!</p>
            )}
          </div>

          {/* Tags/Keywords */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags/Keywords</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {['Emergency', 'Evacuation', 'Rescue', 'Medical', 'Shelter', 'Food', 'Water'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    const newTags = reportForm.tags.includes(tag)
                      ? reportForm.tags.filter(t => t !== tag)
                      : [...reportForm.tags, tag];
                    setReportForm({...reportForm, tags: newTags});
                  }}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    reportForm.tags.includes(tag)
                      ? 'bg-blue-100 text-blue-700 border-blue-300'
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Media Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Attach Media (Optional)</label>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-md hover:border-gray-400 transition-colors">
                <Upload className="w-5 h-5 mr-2 text-gray-400" />
                <span className="text-sm text-gray-600">Upload Image</span>
              </button>
              <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-md hover:border-gray-400 transition-colors">
                <Mic className="w-5 h-5 mr-2 text-gray-400" />
                <span className="text-sm text-gray-600">Voice Record</span>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button className="w-full bg-[#45C476] text-white px-4 py-3 rounded-md font-medium hover:bg-[#349c5a] transition-colors flex items-center justify-center">
            <Send className="w-4 h-4 mr-2" />
            Submit Emergency Report
          </button>
        </div>
      </div>
    </div>
  );

  // Add state for new comment input
  const [newComment, setNewComment] = useState<{ [key: number]: string }>({});

  // Handler to add comment
  const handleAddComment = (reportId: number) => {
    if (!newComment[reportId]) return;
    setCommunityReports(reports =>
      reports.map(report =>
        report.id === reportId
          ? {
              ...report,
              comments: [
                ...report.comments,
                { user: 'You', text: newComment[reportId] }
              ]
            }
          : report
      )
    );
    setNewComment({ ...newComment, [reportId]: '' });
  };

  const PostsFeed = () => (
    <div className={tabContainerClass} style={{ backgroundColor: 'white' }}>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Posts</h2>
        
        {/* Search and Filter */}
        <div className="space-y-4 mb-6">
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search reports..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5899E2]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <button
                className="bg-[#5899E2] text-white px-4 py-2 rounded-md hover:bg-[#4177b7] transition-colors flex items-center"
                onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </button>
              {filterDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded shadow-lg z-10 p-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={selectedFilters.verification}
                      onChange={(e) => setSelectedFilters({...selectedFilters, verification: e.target.value})}
                      className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#5899E2]"
                    >
                      <option value="all">All Status</option>
                      <option value="verified">Verified</option>
                      <option value="pending">Pending</option>
                      <option value="unverified">Unverified</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                    <select
                      value={selectedFilters.severity}
                      onChange={(e) => setSelectedFilters({...selectedFilters, severity: e.target.value})}
                      className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#5899E2]"
                    >
                      <option value="all">All Severity</option>
                      <option value="Critical">Critical</option>
                      <option value="High">High</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {filteredReports.map((report) => (
        <div
          key={report.id}
            className={`bg-white rounded-lg shadow-md p-6 transition-transform duration-200 
              hover:scale-[1.02] hover:shadow-xl cursor-pointer border-l-4 ${
            report.severity === 'Critical' ? 'border-red-500' :
            report.severity === 'High' ? 'border-orange-500' :
            report.severity === 'Moderate' ? 'border-yellow-500' :
            'border-green-500'
          }`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full ${
                report.verified ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <h3 className="font-semibold text-lg">{report.type}</h3>
              {report.verified && <CheckCircle className="w-5 h-5 text-green-500" />}
              {report.official && <Badge className="w-5 h-5 text-blue-500" />}
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                report.status === 'verified' ? 'bg-green-100 text-green-700' :
                report.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {report.status.toUpperCase()}
              </span>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              report.verified ? 'text-green-700' : 'text-red-700'
            } bg-opacity-20 ${
              report.verified ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {report.severity}
            </span>
          </div>
          
          <p className="text-gray-700 mb-3">{report.description}</p>
          
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {report.location}
              </span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {report.time}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-1 bg-[#45C476] text-white px-3 py-1 rounded hover:bg-[#349c5a]">
                <ThumbsUp className="w-4 h-4" />
                <span>{report.upvotes}</span>
              </button>
              <button className="flex items-center space-x-1 bg-[#5899E2] text-white px-3 py-1 rounded hover:bg-[#4177b7]">
                <ThumbsDown className="w-4 h-4" />
                <span>{report.downvotes}</span>
              </button>
              <div className="flex items-center space-x-1 text-blue-600 px-3 py-1 rounded">
                <MessageSquare className="w-4 h-4" />
                <span>{report.comments.length}</span>
                <span className="ml-1">Comments</span>
              </div>
            </div>
            {report.official && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                Official Source
              </span>
            )}
          </div>
          {/* Comments Section */}
          <div className="mt-4">
            <div className="space-y-2">
              {report.comments.map((comment, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-blue-400" />
                  <span className="font-medium text-gray-700">{comment.user}:</span>
                  <span className="text-gray-600">{comment.text}</span>
                </div>
              ))}
            </div>
            <div className="flex mt-2 space-x-2">
              <input
                type="text"
                className="flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#5899E2]"
                placeholder="Add a comment..."
                value={newComment[report.id] || ''}
                onChange={e => setNewComment({ ...newComment, [report.id]: e.target.value })}
              />
              <button
                className="bg-[#45C476] text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-[#349c5a]"
                onClick={() => handleAddComment(report.id)}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const ShelterFinder = () => (
    <div className={tabContainerClass} style={{ backgroundColor: 'white' }}>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Emergency Shelters</h2>
            <p className="text-sm text-gray-600">Find nearby safe shelters and emergency contacts</p>
          </div>
          <div className="flex space-x-2">
            <button className="bg-[#5899E2] text-white px-4 py-2 rounded-md font-medium hover:bg-[#4177b7] transition-colors flex items-center">
              <Navigation className="w-4 h-4 mr-2" />
              Get Current Location
            </button>
            {/* Only show Add Shelter for non-citizen roles */}
            {userRole !== 'citizen' && (
              <button
                onClick={() => setAddingShelter(true)}
                className="bg-[#45C476] text-white px-4 py-2 rounded-md font-medium hover:bg-[#349c5a] transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Shelter
              </button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {shelters.map((shelter) => (
            <div key={shelter.id} className="border border-gray-200 rounded-lg p-4 
                transition-transform duration-200 hover:scale-105 hover:shadow-xl cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{shelter.name}</h3>
                  <p className="text-sm text-gray-600 flex items-center mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {shelter.address}
                  </p>
                  <p className="text-sm text-blue-600 flex items-center mt-1">
                    <Phone className="w-4 h-4 mr-1" />
                    {shelter.contact}
                  </p>
                </div>
                <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  {shelter.distance}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <p className="text-2xl font-bold text-gray-900">{shelter.capacity}</p>
                  <p className="text-xs text-gray-600">Total Capacity</p>
                </div>
                <div className="text-center p-2 bg-green-50 rounded">
                  <p className="text-2xl font-bold text-green-600">{shelter.available}</p>
                  <p className="text-xs text-gray-600">Available</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Facilities:</p>
                <div className="flex flex-wrap gap-1">
                  {shelter.facilities.map((facility) => (
                    <span key={facility} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {facility}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="flex-1 bg-[#45C476] text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-[#349c5a] transition-colors flex items-center justify-center">
                  <Phone className="w-4 h-4 mr-1" />
                  Call
                </button>
                <button className="flex-1 bg-[#5899E2] text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-[#4177b7] transition-colors flex items-center justify-center">
                  <Navigation className="w-4 h-4 mr-1" />
                  Navigate
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Shelter Modal */}
      {addingShelter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Shelter</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Shelter Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5899E2]"
                value={newShelter.name}
                onChange={(e) => setNewShelter({...newShelter, name: e.target.value})}
              />
              <input
                type="text"
                placeholder="Address"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5899E2]"
                value={newShelter.address}
                onChange={(e) => setNewShelter({...newShelter, address: e.target.value})}
              />
              <input
                type="number"
                placeholder="Capacity"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5899E2]"
                value={newShelter.capacity}
                onChange={(e) => setNewShelter({...newShelter, capacity: e.target.value})}
              />
              <input
                type="tel"
                placeholder="Contact Number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5899E2]"
                value={newShelter.contact}
                onChange={(e) => setNewShelter({...newShelter, contact: e.target.value})}
              />
            </div>
            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => {
                  setShelters([...shelters, {
                    id: shelters.length + 1,
                    ...newShelter,
                    capacity: parseInt(newShelter.capacity),
                    available: parseInt(newShelter.capacity),
                    distance: '0.0 km',
                    facilities: ['Medical Aid', 'Food', 'Water']
                  }]);
                  setNewShelter({name: '', address: '', capacity: '', contact: ''});
                  setAddingShelter(false);
                }}
                className="flex-1 bg-[#5899E2] text-white px-4 py-2 rounded-md font-medium hover:bg-[#4177b7] transition-colors"
              >
                Add Shelter
              </button>
              <button
                onClick={() => setAddingShelter(false)}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const ProfileSection = () => (
    <div className={tabContainerClass} style={{ backgroundColor: 'white' }}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">User Profile</h2>
              <p className="text-sm text-gray-600">Manage your account and emergency contacts</p>
            </div>
            <button
              onClick={() => setEditingProfile(!editingProfile)}
              className={`bg-[#5899E2] text-white px-4 py-2 rounded-md font-medium hover:bg-[#4177b7] transition-colors flex items-center`}
            >
              <Edit className="w-4 h-4 mr-2" />
              {editingProfile ? 'Save' : 'Edit Profile'}
            </button>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">John Doe</h3>
              <p className="text-gray-600">Verified Community Member</p>
              <div className="flex items-center mt-1">
                <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">Verified Account</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
              <input
                type="tel"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5899E2]"
                value="+91-9876543210"
                readOnly={!editingProfile}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5899E2]"
                value="john.doe@email.com"
                readOnly={!editingProfile}
              />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <h4 className="font-semibold mb-4">Account Statistics</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded">
                <p className="text-2xl font-bold text-blue-600">12</p>
                <p className="text-sm text-gray-600">Reports Submitted</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded">
                <p className="text-2xl font-bold text-green-600">8</p>
                <p className="text-sm text-gray-600">Verified Reports</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded">
                <p className="text-2xl font-bold text-purple-600">45</p>
                <p className="text-sm text-gray-600">Community Score</p>
              </div >
            </div>
          </div>
        </div>
      </div>

      {/* Verified Officials Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-green-50">
          <h3 className="text-lg font-semibold text-gray-900">Verified Officials & Emergency Contacts</h3>
          <p className="text-sm text-gray-600">Contact verified officials and emergency services</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {verifiedOfficials.map((official) => (
              <div key={official.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <UserCheck className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{official.name}</h4>
                      <p className="text-sm text-gray-600">{official.designation}</p>
                    </div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-700 flex items-center">
                    <Building className="w-4 h-4 mr-2 text-gray-400" />
                    {official.department}
                  </p>
                  <p className="text-sm text-gray-700 flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    {official.region}
                  </p>
                  <p className="text-sm text-blue-600 flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    {official.contact}
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  <button className="flex-1 bg-[#45C476] text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-[#349c5a] transition-colors flex items-center justify-center">
                    <Phone className="w-4 h-4 mr-1" />
                    Call
                  </button>
                  <button className="flex-1 bg-[#5899E2] text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-[#4177b7] transition-colors flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Message
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {userRole === 'citizen' && <Chatbot />}
    </div>
  );

  // AlertsFeed component
  const AlertsFeed = () => (
    <div className={tabContainerClass} style={{ backgroundColor: 'white' }}>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Alerts</h2>
        <p className="text-sm text-gray-600 mb-4">View all current emergency alerts and warnings</p>
        <div className="space-y-4">
          {officialUpdates.map((alert) => (
            <div
          key={alert.id}
             className={`border-l-4 p-4 rounded-lg shadow-sm bg-white 
              transition-transform duration-200 hover:scale-[1.02] hover:shadow-xl cursor-pointer ${
                alert.priority === 'critical' ? 'border-red-600' :
                alert.priority === 'high' ? 'border-orange-500' : 'border-blue-500'
              }`}
            >
              <div className="flex items-center mb-2">
                <Bell className={`w-5 h-5 mr-2 ${
                  alert.priority === 'critical' ? 'text-red-600' :
                  alert.priority === 'high' ? 'text-orange-500' : 'text-blue-600'
                }`} />
                <h3 className="font-semibold text-lg">{alert.title}</h3>
                <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${
                  alert.priority === 'critical' ? 'bg-red-100 text-red-700' :
                  alert.priority === 'high' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {alert.priority.toUpperCase()}
                </span>
              </div>
              <p className="text-gray-700 mb-2">{alert.content}</p>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                {alert.timestamp}
                <span className="mx-2">|</span>
                <User className="w-4 h-4 mr-1" />
                {alert.author}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Example: Call this when a new alert is added
  const notifyNewAlert = (alert) => {
    setLatestAlert(alert);
    setShowAlertNotification(true);
    setTimeout(() => setShowAlertNotification(false), 5000); // Hide after 5s
  };

  // Add dark mode classes to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('bg-gray-900');
      document.body.classList.add('text-white');
    } else {
      document.body.classList.remove('bg-gray-900');
      document.body.classList.remove('text-white');
    }
  }, [darkMode]);

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} min-h-screen`}>
      {/* Dark mode toggle button - lower position, circular, icon only */}
      <div className="fixed top-20 left-6 z-50">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`w-12 h-12 flex items-center justify-center rounded-full shadow border-2 transition-colors
            ${darkMode ? 'bg-gray-800 border-yellow-300 text-yellow-300' : 'bg-white border-blue-700 text-blue-700'}
            hover:scale-105`}
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>
      </div>

      {/* Role Switcher for Demo */}
      <div className="fixed top-4 right-4 z-50">
        <select
          value={userRole}
          onChange={e => setUserRole(e.target.value as 'citizen' | 'official' | 'analyst')}
          className="px-3 py-2 rounded border border-blue-300 bg-white text-blue-700 font-medium"
        >
          <option value="citizen">Citizen</option>
          <option value="official">Official</option>
          <option value="analyst">Analyst</option>
        </select>
      </div>

      {/* Sticky Navigation */}
      <NavigationBar />

      {/* Alert Notification Banner - only for officials and at the top */}
      {userRole === 'official' && showAlertNotification && latestAlert && (
        <div className="fixed top-0 left-0 w-full bg-red-600 text-white py-3 px-6 flex items-center z-50 shadow-lg animate-pulse">
          <Bell className="w-6 h-6 mr-3" />
          <span className="font-bold mr-2">New Alert:</span>
          <span>{latestAlert.title}</span>
          <button
            className="ml-auto bg-white text-red-600 px-3 py-1 rounded font-medium hover:bg-gray-100"
            onClick={() => setShowAlertNotification(false)}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* SOSAlert only for officials */}
      {userRole === 'official' && showAlert && <SOSAlert />}

      {/* Add padding-top so content is not hidden behind sticky nav */}
      <main className="pt-20">
        {activeTab === 'dashboard' && (
          <Dashboard editable={userRole === 'official'} />
        )}
        {activeTab === 'report' && <ReportForm />}
        {activeTab === 'posts' && <PostsFeed />}
        {activeTab === 'alerts' && <AlertsFeed />}
        {activeTab === 'shelters' && <ShelterFinder />}
        {activeTab === 'profile' && <ProfileSection />}
      </main>

      {/* Show chatbot only for citizens */}
      {userRole === 'citizen' && <Chatbot />}

      {/* SOS button (bottom-right, visible for citizens) */}
      {userRole === 'citizen' && (
        <button
          className="fixed top-20 right-8 z-50 bg-red-600 text-white px-8 py-4 rounded-full text-2xl font-bold shadow-lg hover:bg-red-700 transition-colors flex items-center"
          onClick={() => setShowSOSConfirm(true)}
          aria-label="Send SOS Alert"
        >
          <AlertTriangle className="w-8 h-8 mr-2" />
          SOS
        </button>
      )}

      {/* SOS confirmation modal */}
      {showSOSConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 shadow-lg max-w-sm w-full text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Confirm SOS Alert</h2>
            <p className="mb-6 text-gray-700">
              Are you sure you want to send an emergency SOS alert?
            </p>
            <div className="flex space-x-4 justify-center">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded font-medium hover:bg-red-700"
                onClick={() => {
                  setShowSOSConfirm(false);
                  setShowAlert(true);
                }}
              >
                Yes, Send SOS
              </button>
              <button
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded font-medium hover:bg-gray-300"
                onClick={() => setShowSOSConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Dashboard Modal */}
      {editingDashboard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Edit Dashboard Stats</h2>
            {/* Example: Edit total reports */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Reports Today</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={todayStats.totalReports}
                onChange={e => todayStats.totalReports = Number(e.target.value)}
              />
            </div>
            {/* Add more fields as needed */}
            <div className="flex space-x-4 justify-end">
              <button
                className="bg-[#5899E2] text-white px-4 py-2 rounded font-medium hover:bg-[#4177b7]"
                onClick={() => setEditingDashboard(false)}
              >
                Save
              </button>
              <button
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded font-medium hover:bg-gray-300"
                onClick={() => setEditingDashboard(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default App;