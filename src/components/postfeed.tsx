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

const tabContainerClass = "space-y-6 w-full py-8";

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
    <div className={tabContainerClass}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-3">
          <div className="sticky top-24 space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Search</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search reports..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5899E2] dark:bg-gray-700 dark:text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Status</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'verified', label: 'Verified' },
                  { key: 'pending', label: 'Pending' },
                  { key: 'unverified', label: 'Unverified' },
                ].map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => setSelectedFilters({ ...selectedFilters, verification: opt.key })}
                    className={`px-3 py-2 rounded text-sm border transition-colors ${
                      selectedFilters.verification === opt.key
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:border-blue-500'
                    }`}
                    type="button"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Severity</h3>
              <div className="flex flex-wrap gap-2">
                {['all','Critical','High','Moderate','Low'].map(level => (
                  <button
                    key={level}
                    onClick={() => setSelectedFilters({ ...selectedFilters, severity: level })}
                    className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                      selectedFilters.severity === level
                        ? 'bg-red-600 text-white border-red-600'
                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:border-red-500'
                    }`}
                    type="button"
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Content */}
        <section className="lg:col-span-9">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Community Reports</h2>
            <div>
              <select
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-white"
                defaultValue="latest"
              >
                <option value="latest">Latest</option>
                <option value="verified">Verified first</option>
                <option value="severity">Severity high first</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {report.verified && <CheckCircle className="w-4 h-4 text-green-500" />}
                    {report.official && <Badge className="w-4 h-4 text-blue-500" />}
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                      {report.type}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      report.severity === 'Critical' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200' :
                      report.severity === 'High' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200' :
                      report.severity === 'Moderate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {report.severity}
                    </span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    report.status === 'verified' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' :
                    report.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200' :
                    'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {report.status.toUpperCase()}
                  </span>
                </div>

                <p className="text-sm text-gray-700 dark:text-gray-200 mb-3">{report.description}</p>

                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {report.location}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {report.time}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-1 text-xs bg-[#45C476] text-white px-2.5 py-1 rounded hover:bg-[#349c5a]">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{report.upvotes}</span>
                    </button>
                    <button className="flex items-center gap-1 text-xs bg-[#5899E2] text-white px-2.5 py-1 rounded hover:bg-[#4177b7]">
                      <ThumbsDown className="w-3.5 h-3.5" />
                      <span>{report.downvotes}</span>
                    </button>
                    <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-xs">
                      <MessageSquare className="w-3.5 h-3.5" />
                      {report.comments.length}
                    </span>
                  </div>
                  {report.official && (
                    <span className="text-[10px] bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-2 py-0.5 rounded-full font-medium">
                      Official
                    </span>
                  )}
                </div>

                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-2 focus:ring-[#5899E2] dark:bg-gray-700 dark:text-white"
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
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default PostsFeed;
