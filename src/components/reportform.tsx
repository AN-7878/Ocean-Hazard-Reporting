import React from "react";
import { MapPin, Upload, Mic, Send } from "lucide-react";
import { useDarkMode } from "../DarkModeContext";

const hazardTypes = [
  "Flood",
  "Storm",
  "Tsunami",
  "Pollution",
  "Rescue",
  "Medical",
  "Other",
];

const severityLevels = [
  { level: "Low", color: "bg-green-500" },
  { level: "Moderate", color: "bg-yellow-500" },
  { level: "High", color: "bg-orange-500" },
  { level: "Critical", color: "bg-red-500" },
];

type Props = {
  reportForm: any;
  setReportForm: (form: any) => void;
  getCurrentLocation: () => void;
  apiUrl: string; // Added apiUrl prop to use environment variable
};

const ReportForm: React.FC<Props> = ({ reportForm, setReportForm, getCurrentLocation, apiUrl }) => {
  const { darkMode } = useDarkMode();

  const card = (children: React.ReactNode, title?: string, subtitle?: string) => (
    <div
      className={`rounded-lg shadow ${
        darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-100"
      } p-5`}
    >
      {title && (
        <div className={`${darkMode ? "text-white" : "text-gray-900"} mb-3`}>
          <h3 className="text-sm font-semibold">{title}</h3>
          {subtitle && <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-xs`}>{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: "imageFile" | "audioFile" | "videoFile") => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setReportForm({
        ...reportForm,
        [type]: file,
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    console.log("Submitting report to URL:", apiUrl ? `${apiUrl}/upload` : "apiUrl is undefined");

    event.preventDefault();

    if (!reportForm.type) {
      alert("Please select a hazard type.");
      return;
    }
    if (!reportForm.severity) {
      alert("Please select a severity level.");
      return;
    }
    if (!reportForm.description) {
      alert("Please enter a description.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("description", reportForm.description ?? "");
      formData.append("address", reportForm.address ?? "");
      formData.append("type", reportForm.type ?? "");
      formData.append("severity", reportForm.severity ?? "");
      formData.append("tags", JSON.stringify(reportForm.tags ?? []));
      if (reportForm.location) {
        formData.append("location", JSON.stringify(reportForm.location));
      }
      if (reportForm.imageFile) formData.append("image", reportForm.imageFile);
      if (reportForm.audioFile) formData.append("audio", reportForm.audioFile);
      if (reportForm.videoFile) formData.append("video", reportForm.videoFile);

      // Use apiUrl prop instead of hardcoded URL
      // const response = await fetch(`${apiUrl}/upload`, {
      //   method: "POST",
      //   body: formData,
      // });
      const baseUrl = apiUrl || "http://localhost:5000"; // fallback local URL
      const response = await fetch(`${baseUrl}/upload`, {
      method: "POST",
      body: formData,
});


      if (!response.ok) {
        const errorText = await response.text();
        console.error("Backend error response:", errorText);
        alert(`Failed to submit report: ${errorText || response.statusText}`);
        return;
      }

      const data = await response.json();
      alert("Report submitted successfully!");
      setReportForm({
        description: "",
        address: "",
        location: null,
        type: "",
        severity: "",
        tags: [],
        imageFile: null,
        audioFile: null,
        videoFile: null,
      });
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit report due to network or server error. Please try again.");
    }
  };

  return (
    <div className={`w-full min-h-screen py-8 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <div className="max-w-7xl mx-auto px-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Report Ocean Hazard</h2>
            <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>Quick and efficient hazard reporting for community safety</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Form (2 cols) */}
            <div className="lg:col-span-2 space-y-5">
              {card(
                <>
                  {/* Hazard Type selection, Severity Level, Description, Location, Tags, Media upload, Submit button */}
                  {/* (No changes here except in handleSubmit fetch URL) */}

                  {/* Hazard Type */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Hazard Type</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {hazardTypes.map((type) => (
                        <button
                          key={type}
                          onClick={() => setReportForm({ ...reportForm, type })}
                          className={`p-3 text-sm border rounded-md transition-colors ${
                            reportForm.type === type
                              ? "border-[#5899E2] bg-[#5899E2] text-white"
                              : darkMode
                              ? "border-gray-600 bg-gray-700 text-white hover:border-[#5899E2]"
                              : "border-gray-300 hover:border-[#5899E2] hover:bg-white"
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
                    <label className="block text-sm font-medium mb-2">Severity Level</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {severityLevels.map((level) => (
                        <button
                          key={level.level}
                          onClick={() => setReportForm({ ...reportForm, severity: level.level })}
                          className={`p-3 text-sm border rounded-md transition-colors flex items-center ${
                            reportForm.severity === level.level
                              ? "border-[#45C476] bg-[#45C476] text-white"
                              : darkMode
                              ? "border-gray-600 bg-gray-700 text-white hover:border-[#45C476]"
                              : "border-gray-300 hover:border-[#45C476] hover:bg-white"
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
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none ${
                        darkMode ? "bg-gray-700 border-gray-600 text-white focus:ring-[#5899E2]" : "border-gray-300 bg-white focus:ring-[#5899E2]"
                      }`}
                      rows={4}
                      placeholder="Describe the hazard situation..."
                      value={reportForm.description}
                      onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                    />
                  </div>

                  {/* Location/Address */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Location/Address</label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        className={`flex-1 px-3 py-2 border rounded-md focus:outline-none ${
                          darkMode ? "bg-gray-700 border-gray-600 text-white focus:ring-[#5899E2]" : "border-gray-300 bg-white focus:ring-[#5899E2]"
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
                    {reportForm.location && <p className="text-sm text-green-400 mt-1">Location detected successfully!</p>}
                  </div>

                  {/* Tags/Keywords */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Tags/Keywords</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {["Emergency", "Evacuation", "Rescue", "Medical", "Shelter", "Food", "Water"].map((tag) => (
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
                              ? "bg-blue-100 text-blue-700 border-blue-300"
                              : darkMode
                              ? "bg-gray-700 text-white border-gray-600 hover:border-gray-400"
                              : "bg-gray-100 text-gray-700 border-gray-300 hover:border-gray-400"
                          }`}
                          type="button"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Attach Media */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Attach Media (Optional)</label>
                    <div className="grid grid-cols-3 gap-4">
                      <label
                        htmlFor="image-upload"
                        className={`flex items-center justify-center p-4 border-2 border-dashed rounded-md cursor-pointer transition-colors ${
                          darkMode ? "border-gray-600 text-white" : "border-gray-300 text-gray-600 hover:border-gray-400"
                        }`}
                      >
                        <Upload className="w-5 h-5 mr-2" />
                        <span className="text-sm">Upload Image</span>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, "imageFile")}
                        />
                      </label>

                      <label
                        htmlFor="audio-upload"
                        className={`flex items-center justify-center p-4 border-2 border-dashed rounded-md cursor-pointer transition-colors ${
                          darkMode ? "border-gray-600 text-white" : "border-gray-300 text-gray-600 hover:border-gray-400"
                        }`}
                      >
                        <Mic className="w-5 h-5 mr-2" />
                        <span className="text-sm">Upload Audio</span>
                        <input
                          id="audio-upload"
                          type="file"
                          accept="audio/*"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, "audioFile")}
                        />
                      </label>

                      <label
                        htmlFor="video-upload"
                        className={`flex items-center justify-center p-4 border-2 border-dashed rounded-md cursor-pointer transition-colors ${
                          darkMode ? "border-gray-600 text-white" : "border-gray-300 text-gray-600 hover:border-gray-400"
                        }`}
                      >
                        <Upload className="w-5 h-5 mr-2" />
                        <span className="text-sm">Upload Video</span>
                        <input
                          id="video-upload"
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, "videoFile")}
                        />
                      </label>
                    </div>

                    <div className="mt-3 space-y-3">
                      {reportForm.imageFile && (
                        <img
                          src={URL.createObjectURL(reportForm.imageFile)}
                          alt="Uploaded preview"
                          className="max-h-40 rounded-md"
                        />
                      )}
                      {reportForm.audioFile && (
                        <audio controls className="w-full">
                          <source src={URL.createObjectURL(reportForm.audioFile)} />
                          Your browser does not support the audio element.
                        </audio>
                      )}
                      {reportForm.videoFile && (
                        <video controls className="max-h-48 w-full rounded-md">
                          <source src={URL.createObjectURL(reportForm.videoFile)} />
                          Your browser does not support the video element.
                        </video>
                      )}
                    </div>
                  </div>

                  {/* Submit button */}
                  <button
                    className="w-full bg-[#45C476] text-white px-4 py-3 rounded-md font-medium hover:bg-[#349c5a] transition-colors flex items-center justify-center"
                    type="submit"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Submit Emergency Report
                  </button>
                </>,
                "Report Details",
                "Fill in the hazard details below"
              )}
            </div>

            {/* Right: Live Preview */}
            <div className="lg:col-span-1">
              {card(
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Type</span>
                    <span className="font-medium">{reportForm.type || "-"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Severity</span>
                    <span className="font-medium">{reportForm.severity || "-"}</span>
                  </div>
                  <div>
                    <span className="block text-gray-500 dark:text-gray-400 mb-1">Description</span>
                    <p className="whitespace-pre-wrap">{reportForm.description || "-"}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Address</span>
                    <span className="font-medium truncate max-w-[60%] text-right">{reportForm.address || "-"}</span>
                  </div>
                  <div>
                    <span className="block text-gray-500 dark:text-gray-400 mb-1">Tags</span>
                    <div className="flex flex-wrap gap-1">
                      {(reportForm.tags || []).length === 0 && <span>-</span>}
                      {(reportForm.tags || []).map((t: string) => (
                        <span
                          key={t}
                          className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-2 py-0.5 rounded-full"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>,
                "Live Preview",
                "Your report will look like this"
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};


export default ReportForm;
