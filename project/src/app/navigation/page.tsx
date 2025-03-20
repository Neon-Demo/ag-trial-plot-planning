"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navigation() {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  
  // Mock data
  const [trials, setTrials] = useState([
    { id: "1", name: "Corn Variety Trial 2024", location: "North Field Station", plotCount: 120 },
    { id: "2", name: "Wheat Disease Resistance", location: "East Research Farm", plotCount: 90 },
    { id: "3", name: "Soybean Fertilizer Trial", location: "South Field", plotCount: 60 },
  ]);
  
  const [selectedTrial, setSelectedTrial] = useState("");
  
  const [routePlans, setRoutePlans] = useState([
    { id: "1", trialId: "1", name: "Default Route", optimizationStrategy: "distance", estimatedDuration: 120 },
    { id: "2", trialId: "1", name: "By Treatment", optimizationStrategy: "treatment", estimatedDuration: 135 },
    { id: "3", trialId: "2", name: "Default Route", optimizationStrategy: "distance", estimatedDuration: 90 },
  ]);
  
  const [selectedRoute, setSelectedRoute] = useState("");
  
  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setIsMapLoaded(true);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleTrialChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const trialId = e.target.value;
    setSelectedTrial(trialId);
    setSelectedRoute("");
  };
  
  const handleRouteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRoute(e.target.value);
  };
  
  const filteredRoutePlans = routePlans.filter(route => route.trialId === selectedTrial);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold">Plot Navigation</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow h-[600px] flex flex-col">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="font-semibold text-lg">Map View</h2>
              <div className="flex space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded text-sm bg-white hover:bg-gray-50">
                  Satellite
                </button>
                <button className="px-3 py-1 border border-primary rounded text-sm bg-primary text-white">
                  Map
                </button>
              </div>
            </div>
            
            <div className="flex-1 relative">
              {!isMapLoaded ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : selectedTrial ? (
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                  <div className="text-center p-6 max-w-lg">
                    <div className="mb-4">
                      <svg className="w-16 h-16 text-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Map View</h3>
                    <p className="text-gray-600 mb-4">
                      {selectedRoute 
                        ? "Route plan loaded. In the actual application, this would display an interactive map with the selected route."
                        : "Trial selected. Select a route plan to view the navigation path."}
                    </p>
                    {selectedRoute && (
                      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-800 font-medium">Route Loaded</p>
                        <p className="text-green-700 text-sm mt-1">
                          Next Plot: Plot A103 - 45m ahead
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                  <div className="text-center p-6">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <h3 className="text-lg font-semibold mb-2">No Trial Selected</h3>
                    <p className="text-gray-600">
                      Please select a trial from the panel to begin navigation.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-semibold text-lg mb-4">Navigation Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="trial" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Trial
                </label>
                <select
                  id="trial"
                  className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                  value={selectedTrial}
                  onChange={handleTrialChange}
                >
                  <option value="">-- Select a Trial --</option>
                  {trials.map(trial => (
                    <option key={trial.id} value={trial.id}>
                      {trial.name} ({trial.location})
                    </option>
                  ))}
                </select>
              </div>
              
              {selectedTrial && (
                <div>
                  <label htmlFor="route" className="block text-sm font-medium text-gray-700 mb-1">
                    Route Plan
                  </label>
                  <select
                    id="route"
                    className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    value={selectedRoute}
                    onChange={handleRouteChange}
                  >
                    <option value="">-- Select a Route Plan --</option>
                    {filteredRoutePlans.map(route => (
                      <option key={route.id} value={route.id}>
                        {route.name} ({route.estimatedDuration} min)
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              {selectedRoute && (
                <div className="pt-4">
                  <button className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded">
                    Start Navigation
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {selectedTrial && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="font-semibold text-lg mb-4">Route Options</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="optimization" className="block text-sm font-medium text-gray-700 mb-1">
                    Optimization Strategy
                  </label>
                  <select
                    id="optimization"
                    className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    defaultValue="distance"
                  >
                    <option value="distance">Shortest Distance</option>
                    <option value="treatment">By Treatment</option>
                    <option value="replication">By Replication</option>
                    <option value="custom">Custom Order</option>
                  </select>
                </div>
                
                <div>
                  <label className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                    <span className="ml-2 text-sm text-gray-700">Skip already observed plots</span>
                  </label>
                </div>
                
                <div>
                  <label className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                    <span className="ml-2 text-sm text-gray-700">Prioritize plots with due observations</span>
                  </label>
                </div>
                
                <div className="pt-2">
                  <button className="w-full bg-secondary hover:bg-secondary-dark text-gray-800 font-medium py-2 px-4 rounded">
                    Create New Route Plan
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {selectedRoute && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="font-semibold text-lg mb-4">Route Information</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Plots:</span>
                  <span className="font-medium">24</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Remaining Plots:</span>
                  <span className="font-medium">18</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Time:</span>
                  <span className="font-medium">2h 15m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Distance:</span>
                  <span className="font-medium">1.2 km</span>
                </div>
                
                <div className="pt-2 flex space-x-2">
                  <button className="flex-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 px-4 rounded">
                    Export
                  </button>
                  <button className="flex-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 px-4 rounded">
                    Share
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}