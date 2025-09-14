import React from "react";
import { Bell, Clock, User } from "lucide-react";

type Alert = { id: number; title: string; content: string; timestamp: string; priority: string; author: string };

type Props = { officialUpdates: Alert[] };

const tabContainerClass = "space-y-6 max-w-2xl mx-auto py-8";

// AlertsFeed component
const AlertsFeed: React.FC<Props> = ({ officialUpdates }) => (
  <div className={tabContainerClass} style={{ backgroundColor: 'white' }}>
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Alerts</h2>
      <p className="text-sm text-gray-600 mb-4">View all current emergency alerts and warnings</p>
      <div className="space-y-4">
        {officialUpdates.map((alert) => (
          <div
            key={alert.id}
            className={`bg-white rounded-lg shadow-2xl p-4 border-l-4 
              transition-transform duration-200 hover:scale-105 hover:shadow-3xl cursor-pointer ${
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

export default AlertsFeed;
