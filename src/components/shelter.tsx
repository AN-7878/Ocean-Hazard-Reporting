import React, { useState } from "react";
import { MapPin, Phone, Navigation, Plus } from "lucide-react";

type Shelter = {
  id: number;
  name: string;
  address: string;
  capacity: number;
  available: number;
  contact: string;
  distance: string;
  facilities: string[];
};

type Props = { shelters: Shelter[]; userRole?: string };

const tabContainerClass = "space-y-6 max-w-2xl mx-auto py-8";

const ShelterFinder: React.FC<Props> = ({ shelters: initialShelters, userRole = "citizen" }) => {
  const [addingShelter, setAddingShelter] = useState(false);
  const [shelters, setShelters] = useState<Shelter[]>(initialShelters);
  const [newShelter, setNewShelter] = useState<{ name: string; address: string; capacity: string; contact: string }>({
    name: "",
    address: "",
    capacity: "",
    contact: "",
  });

  return (
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
            <div key={shelter.id} className="bg-white rounded-lg shadow-2xl p-4 
                transition-transform duration-200 hover:scale-105 hover:shadow-3xl cursor-pointer border border-gray-200">
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
                onChange={(e) => setNewShelter({ ...newShelter, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Address"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5899E2]"
                value={newShelter.address}
                onChange={(e) => setNewShelter({ ...newShelter, address: e.target.value })}
              />
              <input
                type="number"
                placeholder="Capacity"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5899E2]"
                value={newShelter.capacity}
                onChange={(e) => setNewShelter({ ...newShelter, capacity: e.target.value })}
              />
              <input
                type="tel"
                placeholder="Contact Number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5899E2]"
                value={newShelter.contact}
                onChange={(e) => setNewShelter({ ...newShelter, contact: e.target.value })}
              />
            </div>
            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => {
                  setShelters([
                    ...shelters,
                    {
                      id: shelters.length + 1,
                      name: newShelter.name,
                      address: newShelter.address,
                      capacity: parseInt(newShelter.capacity),
                      available: parseInt(newShelter.capacity),
                      contact: newShelter.contact,
                      distance: '0.0 km',
                      facilities: ['Medical Aid', 'Food', 'Water'],
                    },
                  ]);
                  setNewShelter({ name: '', address: '', capacity: '', contact: '' });
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
};

export default ShelterFinder;
