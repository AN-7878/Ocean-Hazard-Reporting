import React, { useState } from "react";
import { User, CheckCircle, Phone, MessageSquare, UserCheck, Building, MapPin, Edit } from "lucide-react";

type Official = {
  id: number;
  name: string;
  designation: string;
  department: string;
  contact: string;
  region: string;
};

type Props = {
  currentUser: { name: string; avatar: string };
  verifiedOfficials: Official[];
  userRole?: string;
  Chatbot?: React.ComponentType;
};

const tabContainerClass = "space-y-6 w-full py-8";

const Profile: React.FC<Props> = ({ currentUser, verifiedOfficials, userRole, Chatbot }) => {
  const [editingProfile, setEditingProfile] = useState(false);

  return (
    <div className={tabContainerClass}>
      <div className="bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">User Profile</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">Manage your account and emergency contacts</p>
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
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold dark:text-white">{currentUser.name}</h3>
              <p className="text-gray-600 dark:text-gray-300">Verified Community Member</p>
              <div className="flex items-center mt-1">
                <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">Verified Account</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contact Number</label>
              <input
                type="tel"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5899E2] dark:bg-gray-700 dark:text-white"
                value={currentUser.avatar}
                readOnly={!editingProfile}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5899E2] dark:bg-gray-700 dark:text-white"
                value={currentUser.name + "@email.com"}
                readOnly={!editingProfile}
              />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold mb-4 dark:text-white">Account Statistics</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <p className="text-2xl font-bold text-blue-600">12</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Reports Submitted</p>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <p className="text-2xl font-bold text-green-600">8</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Verified Reports</p>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <p className="text-2xl font-bold text-purple-600">45</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Community Score</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Verified Officials Section */}
      <div className="bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-green-50 dark:bg-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Verified Officials & Emergency Contacts</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">Contact verified officials and emergency services</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {verifiedOfficials.map((official) => (
              <div key={official.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <UserCheck className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{official.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{official.designation}</p>
                    </div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center">
                    <Building className="w-4 h-4 mr-2 text-gray-400" />
                    {official.department}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center">
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

      {userRole === 'citizen' && Chatbot && <Chatbot />}
    </div>
  );
};

export default Profile;

