import React from "react";
import { Bell, Clock, User } from "lucide-react";
import { useDarkMode } from '../DarkModeContext';

type Alert = {
  id: number;
  title: string;
  content: string;
  timestamp: string;
  priority: string;
  author: string;
};

type Props = {
  officialUpdates: Alert[];
};

const tabContainerClass = "space-y-6 w-full py-8";

const AlertsFeed: React.FC<Props> = ({ officialUpdates }) => {
  const { darkMode } = useDarkMode();

  return (
    <div className={tabContainerClass}>
      <div className={`rounded-lg shadow-md p-6 ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        <h2 className="text-lg font-semibold mb-4">
          Active Alerts
        </h2>
        <p className={`text-sm mb-4 ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          View all current emergency alerts and warnings
        </p>

        <div className="space-y-4">
          {officialUpdates.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-lg shadow-md p-4 border-l-4 transition-transform duration-200 hover:scale-105 cursor-pointer ${
                darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
              } ${
                alert.priority === 'critical'
                  ? (darkMode ? 'border-red-500' : 'border-red-600')
                  : alert.priority === 'high'
                  ? (darkMode ? 'border-orange-500' : 'border-orange-600')
                  : (darkMode ? 'border-blue-500' : 'border-blue-600')
              }`}
            >
              <div className="flex items-center mb-2">
                <Bell className={`w-5 h-5 mr-2 ${
                  alert.priority === 'critical'
                    ? (darkMode ? 'text-red-400' : 'text-red-600')
                    : alert.priority === 'high'
                    ? (darkMode ? 'text-orange-400' : 'text-orange-600')
                    : (darkMode ? 'text-blue-400' : 'text-blue-600')
                }`} />
                <h3 className="font-semibold text-lg">{alert.title}</h3>
                <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${
                  alert.priority === 'critical'
                    ? (darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-700')
                    : alert.priority === 'high'
                    ? (darkMode ? 'bg-orange-900 text-orange-200' : 'bg-orange-100 text-orange-700')
                    : (darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700')
                }`}>
                  {alert.priority.toUpperCase()}
                </span>
              </div>

              <p className={`${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                {alert.content}
              </p>

              <div className={`flex items-center text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
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
};

export default AlertsFeed;
