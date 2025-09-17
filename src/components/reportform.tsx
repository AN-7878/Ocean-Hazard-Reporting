import React from "react";
import { MapPin, Upload, Mic, Send } from "lucide-react";
import { useDarkMode } from "../DarkModeContext"; // import the global hook

const hazardTypes = [
  "Flood",
  "Storm",
  "Tsunami",
  "Pollution",
  "Rescue",
  "Medical",
  "Other"
];

const severityLevels = [
  { level: 'Low', color: 'bg-green-500' },
  { level: 'Moderate', color: 'bg-yellow-500' },
  { level: 'High', color: 'bg-orange-500' },
  { level: 'Critical', color: 'bg-red-500' }
];

type Props = {
  reportForm: any;
  setReportForm: (form: any) => void;
  getCurrentLocation: () => void;
};

const ReportForm: React.FC<Props> = ({ reportForm, setReportForm, getCurrentLocation }) => {
  const { darkMode } = useDarkMode(); // use global dark mode

  const card = (children: React.ReactNode, title?: string, subtitle?: string) => (
    <div className={`rounded-lg shadow ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'} p-5`}>
      {title && (
        <div className={`mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          <h3 className="text-sm font-semibold">{title}</h3>
          {subtitle && <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );

  return (
    <div className={`w-full min-h-screen py-8 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Report Ocean Hazard</h2>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Quick and efficient hazard reporting for community safety</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Form (2 cols) */}
          <div className="lg:col-span-2 space-y-5">
            {card(
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Hazard Type</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {hazardTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => setReportForm({ ...reportForm, type })}
                        className={`p-3 text-sm border rounded-md transition-colors ${
                          reportForm.type === type
                            ? 'border-[#5899E2] bg-[#5899E2] text-white'
                            : darkMode
                              ? 'border-gray-600 bg-gray-700 text-white hover:border-[#5899E2]'
                              : 'border-gray-300 hover:border-[#5899E2] hover:bg-white'
                        }`}
                        type="button"
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Severity Level</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {severityLevels.map((level) => (
                      <button
                        key={level.level}
                        onClick={() => setReportForm({ ...reportForm, severity: level.level })}
                        className={`p-3 text-sm border rounded-md transition-colors flex items-center ${
                          reportForm.severity === level.level
                            ? 'border-[#45C476] bg-[#45C476] text-white'
                            : darkMode
                              ? 'border-gray-600 bg-gray-700 text-white hover:border-[#45C476]'
                              : 'border-gray-300 hover:border-[#45C476] hover:bg-white'
                        }`}
                        type="button"
                      >
                        <div className={`w-3 h-3 rounded-full ${level.color} mr-2`}></div>
                        {level.level}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white focus:ring-[#5899E2]'
                        : 'border-gray-300 bg-white focus:ring-[#5899E2]'
                    }`}
                    rows={4}
                    placeholder="Describe the hazard situation..."
                    value={reportForm.description}
                    onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Location/Address</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      className={`flex-1 px-3 py-2 border rounded-md focus:outline-none ${
                        darkMode
                          ? 'bg-gray-700 border-gray-600 text-white focus:ring-[#5899E2]'
                          : 'border-gray-300 bg-white focus:ring-[#5899E2]'
                      }`}
                      placeholder="Enter location or address..."
                      value={reportForm.address}
                      onChange={(e) => setReportForm({ ...reportForm, address: e.target.value })}
                    />
                    <button
                      onClick={getCurrentLocation}
                      className="bg-[#5899E2] text-white px-4 py-2 rounded-md hover:bg-[#4177b7] transition-colors flex items-center"
                      type="button"
                    >
                      <MapPin className="w-4 h-4 mr-1" />
                      Auto-detect
                    </button>
                  </div>
                  {reportForm.location && (
                    <p className="text-sm text-green-400 mt-1">Location detected successfully!</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tags/Keywords</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {['Emergency', 'Evacuation', 'Rescue', 'Medical', 'Shelter', 'Food', 'Water'].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => {
                          const newTags = reportForm.tags?.includes(tag)
                            ? reportForm.tags.filter((t: string) => t !== tag)
                            : [...(reportForm.tags || []), tag];
                          setReportForm({ ...reportForm, tags: newTags });
                        }}
                        className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                          reportForm.tags?.includes(tag)
                            ? 'bg-blue-100 text-blue-700 border-blue-300'
                            : darkMode
                              ? 'bg-gray-700 text-white border-gray-600 hover:border-gray-400'
                              : 'bg-gray-100 text-gray-700 border-gray-300 hover:border-gray-400'
                        }`}
                        type="button"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Attach Media (Optional)</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      className={`flex items-center justify-center p-4 border-2 border-dashed rounded-md transition-colors ${
                        darkMode ? 'border-gray-600 text-white' : 'border-gray-300 text-gray-600 hover:border-gray-400'
                      }`}
                    >
                      <Upload className="w-5 h-5 mr-2" />
                      <span className="text-sm">Upload Image</span>
                    </button>
                    <button
                      type="button"
                      className={`flex items-center justify-center p-4 border-2 border-dashed rounded-md transition-colors ${
                        darkMode ? 'border-gray-600 text-white' : 'border-gray-300 text-gray-600 hover:border-gray-400'
                      }`}
                    >
                      <Mic className="w-5 h-5 mr-2" />
                      <span className="text-sm">Voice Record</span>
                    </button>
                  </div>
                </div>

                <button className="w-full bg-[#45C476] text-white px-4 py-3 rounded-md font-medium hover:bg-[#349c5a] transition-colors flex items-center justify-center" type="submit">
                  <Send className="w-4 h-4 mr-2" />
                  Submit Emergency Report
                </button>
              </div>,
              'Report Details',
              'Fill in the hazard details below'
            )}
          </div>

          {/* Right: Live Preview */}
          <div className="lg:col-span-1">
            {card(
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Type</span>
                  <span className="font-medium">{reportForm.type || '-'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Severity</span>
                  <span className="font-medium">{reportForm.severity || '-'}</span>
                </div>
                <div>
                  <span className="block text-gray-500 dark:text-gray-400 mb-1">Description</span>
                  <p className="whitespace-pre-wrap">{reportForm.description || '-'}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Address</span>
                  <span className="font-medium truncate max-w-[60%] text-right">{reportForm.address || '-'}</span>
                </div>
                <div>
                  <span className="block text-gray-500 dark:text-gray-400 mb-1">Tags</span>
                  <div className="flex flex-wrap gap-1">
                    {(reportForm.tags || []).length === 0 && <span>-</span>}
                    {(reportForm.tags || []).map((t: string) => (
                      <span key={t} className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-2 py-0.5 rounded-full">{t}</span>
                    ))}
                  </div>
                </div>
              </div>,
              'Live Preview',
              'Your report will look like this'
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportForm;
