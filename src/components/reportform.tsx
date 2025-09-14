import React from "react";
import { MapPin, Upload, Mic, Send } from "lucide-react";

type Props = {
  reportForm: any;
  setReportForm: (form: any) => void;
  getCurrentLocation: () => void;
};

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
  { level: 'Low', color: 'bg-green-500', textColor: 'text-green-700' },
  { level: 'Moderate', color: 'bg-yellow-500', textColor: 'text-yellow-700' },
  { level: 'High', color: 'bg-orange-500', textColor: 'text-orange-700' },
  { level: 'Critical', color: 'bg-red-500', textColor: 'text-red-700' }
];

const tabContainerClass = "space-y-6 max-w-2xl mx-auto py-8";

const ReportForm: React.FC<Props> = ({ reportForm, setReportForm, getCurrentLocation }) => (
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
                onClick={() => setReportForm({ ...reportForm, type })}
                className={`p-3 text-sm border rounded-md transition-colors ${
                  reportForm.type === type
                    ? 'border-[#5899E2] bg-[#5899E2] text-white'
                    : 'border-gray-300 hover:border-[#5899E2] hover:bg-[white]'
                }`}
                type="button"
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
            {severityLevels.map((level) => (
              <button
                key={level.level}
                onClick={() => setReportForm({ ...reportForm, severity: level.level })}
                className={`p-3 text-sm border rounded-md transition-colors flex items-center ${
                  reportForm.severity === level.level
                    ? 'border-[#45C476] bg-[#45C476] text-white'
                    : 'border-gray-300 hover:border-[#45C476] hover:bg-[white]'
                }`}
                type="button"
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
            onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
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
                  const newTags = reportForm.tags?.includes(tag)
                    ? reportForm.tags.filter((t: string) => t !== tag)
                    : [...(reportForm.tags || []), tag];
                  setReportForm({ ...reportForm, tags: newTags });
                }}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                  reportForm.tags?.includes(tag)
                    ? 'bg-blue-100 text-blue-700 border-blue-300'
                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
                type="button"
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
            <button type="button" className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-md hover:border-gray-400 transition-colors">
              <Upload className="w-5 h-5 mr-2 text-gray-400" />
              <span className="text-sm text-gray-600">Upload Image</span>
            </button>
            <button type="button" className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-md hover:border-gray-400 transition-colors">
              <Mic className="w-5 h-5 mr-2 text-gray-400" />
              <span className="text-sm text-gray-600">Voice Record</span>
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button className="w-full bg-[#45C476] text-white px-4 py-3 rounded-md font-medium hover:bg-[#349c5a] transition-colors flex items-center justify-center" type="submit">
          <Send className="w-4 h-4 mr-2" />
          Submit Emergency Report
        </button>
      </div>
    </div>
  </div>
);

export default ReportForm;
