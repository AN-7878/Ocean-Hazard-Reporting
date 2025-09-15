import React, { useState } from "react";
import { MapPin, Clock, CheckCircle, Badge, MessageSquare, ThumbsUp, ThumbsDown, User, Search, Filter } from "lucide-react";

type ReportComment = { user: string; text: string };
type CommunityReport = {
  id: number;
  type?: string;
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

type Props = {
  reports: CommunityReport[];
};

const tabContainerClass = "space-y-6 max-w-2xl mx-auto py-8";

// Fix: Accept props and use state for search/filter/comments
const PostsFeed: React.FC<Props> = ({ reports }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    verification: "all",
    severity: "all",
  });
  const [newComment, setNewComment] = useState<{ [key: number]: string }>({});
  const [communityReports, setCommunityReports] = useState([
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
      comments: [
        { user: 'Rohit', text: 'Local authorities have been informed.' }
      ],
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
      comments: [
        { user: 'Meera', text: 'Beach access restricted.' }
      ],
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
      comments: [
        { user: 'Suresh', text: 'Water entering homes.' }
      ],
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
      comments: [
        { user: 'Arjun', text: 'Evacuating immediately.' }
      ],
      severity: 'Critical'
    },
    // Additional reports
    {
      id: 6,
      type: 'Heavy Rainfall',
      location: 'Goa',
      time: '30 minutes ago',
      description: 'Continuous heavy rain causing traffic disruptions',
      verified: false,
      upvotes: 10,
      downvotes: 1,
      official: false,
      status: 'pending',
      comments: [
        { user: 'Anjali', text: 'Roads are flooded.' }
      ],
      severity: 'Moderate'
    },
    {
      id: 7,
      type: 'Flood Alert',
      location: 'Digha, West Bengal',
      time: '3 hours ago',
      description: 'River overflow warning issued',
      verified: true,
      upvotes: 25,
      downvotes: 2,
      official: true,
      status: 'verified',
      comments: [
        { user: 'Ravi', text: 'People moving to shelters.' }
      ],
      severity: 'High'
    },
    {
      id: 8,
      type: 'Landslide',
      location: 'Kanyakumari, Tamil Nadu',
      time: '5 hours ago',
      description: 'Minor landslide reported near coastal road',
      verified: false,
      upvotes: 8,
      downvotes: 0,
      official: false,
      status: 'unverified',
      comments: [
        { user: 'Kavita', text: 'Avoid the area.' }
      ],
      severity: 'Low'
    },
    {
      id: 9,
      type: 'Evacuation Notice',
      location: 'Alappuzha, Kerala',
      time: '15 minutes ago',
      description: 'Mandatory evacuation for residents near Alleppey Beach',
      verified: true,
      upvotes: 40,
      downvotes: 1,
      official: true,
      status: 'verified',
      comments: [
        { user: 'Sunita', text: 'Authorities helping with transport.' }
      ],
      severity: 'Critical'
    },
    {
      id: 10,
      type: 'Medical Emergency',
      location: 'Mangalore, Karnataka',
      time: '1 hour ago',
      description: 'Medical teams requested at Panambur Beach shelter',
      verified: false,
      upvotes: 15,
      downvotes: 0,
      official: false,
      status: 'pending',
      comments: [
        { user: 'Manoj', text: 'Injured people being treated.' }
      ],
      severity: 'Moderate'
    }
  ]);

  // Filter logic
  const filteredReports = communityReports.filter((report) => {
    // Search filter
    const matchesSearch =
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (report.type || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location.toLowerCase().includes(searchTerm.toLowerCase());

    // Verification filter
    const matchesVerification =
      selectedFilters.verification === "all" ||
      (selectedFilters.verification === "verified" && report.verified) ||
      (selectedFilters.verification === "pending" && report.status === "pending") ||
      (selectedFilters.verification === "unverified" && !report.verified);

    // Severity filter
    const matchesSeverity =
      selectedFilters.severity === "all" ||
      (report.severity === selectedFilters.severity);

    return matchesSearch && matchesVerification && matchesSeverity;
  });

  // Add comment handler
  const handleAddComment = (reportId: number) => {
    const commentText = newComment[reportId]?.trim();
    if (!commentText) return;
    // Find report and add comment (simulate, as props are immutable)
    // In real app, this should update parent state or call API
    setNewComment({ ...newComment, [reportId]: "" });
    // Optionally: show a toast or feedback
  };

  return (
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
                type="button"
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
                      onChange={(e) => setSelectedFilters({ ...selectedFilters, verification: e.target.value })}
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
                      onChange={(e) => setSelectedFilters({ ...selectedFilters, severity: e.target.value })}
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
          className={`bg-white rounded-lg shadow-2xl p-6 transition-transform duration-200 
            hover:scale-[1.02] hover:shadow-3xl cursor-pointer border-l-4 ${
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
                type="button"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostsFeed;
