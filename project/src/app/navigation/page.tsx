'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default function NavigationPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/auth/signin');
    },
  });

  const [selectedTrial, setSelectedTrial] = useState<string | null>(null);
  const [plotsToVisit, setPlotsToVisit] = useState<string[]>([]);
  const [optimizeBy, setOptimizeBy] = useState<string>('distance');

  // Mock trials data - would come from API
  const mockTrials = [
    { id: '1', name: 'Winter Wheat Variety Trial 2024', pendingObservations: 15 },
    { id: '2', name: 'Corn Fertilizer Experiment', pendingObservations: 8 },
    { id: '3', name: 'Soybean Disease Resistance Study', pendingObservations: 0 },
  ];

  // Mock plots data - would come from API based on selected trial
  const mockPlots = {
    '1': [
      { id: 'A-01', number: 'A-01', pendingObservations: 2 },
      { id: 'A-02', number: 'A-02', pendingObservations: 1 },
      { id: 'A-03', number: 'A-03', pendingObservations: 1 },
      { id: 'A-04', number: 'A-04', pendingObservations: 1 },
      { id: 'B-01', number: 'B-01', pendingObservations: 2 },
      { id: 'B-02', number: 'B-02', pendingObservations: 1 },
      { id: 'B-03', number: 'B-03', pendingObservations: 2 },
      { id: 'B-04', number: 'B-04', pendingObservations: 1 },
      { id: 'C-01', number: 'C-01', pendingObservations: 2 },
      { id: 'C-02', number: 'C-02', pendingObservations: 1 },
      { id: 'C-03', number: 'C-03', pendingObservations: 1 },
    ],
    '2': [
      { id: 'P-101', number: 'P-101', pendingObservations: 1 },
      { id: 'P-102', number: 'P-102', pendingObservations: 2 },
      { id: 'P-103', number: 'P-103', pendingObservations: 1 },
      { id: 'P-104', number: 'P-104', pendingObservations: 0 },
      { id: 'P-201', number: 'P-201', pendingObservations: 1 },
      { id: 'P-202', number: 'P-202', pendingObservations: 1 },
      { id: 'P-203', number: 'P-203', pendingObservations: 2 },
    ],
    '3': [],
  };

  const handleTrialSelect = (trialId: string) => {
    setSelectedTrial(trialId);
    setPlotsToVisit([]);
  };

  const togglePlotSelection = (plotId: string) => {
    if (plotsToVisit.includes(plotId)) {
      setPlotsToVisit(plotsToVisit.filter(id => id !== plotId));
    } else {
      setPlotsToVisit([...plotsToVisit, plotId]);
    }
  };

  const selectAllPlots = () => {
    if (!selectedTrial) return;
    
    const availablePlots = mockPlots[selectedTrial as keyof typeof mockPlots]
      .filter(plot => plot.pendingObservations > 0)
      .map(plot => plot.id);
    
    setPlotsToVisit(availablePlots);
  };

  const clearSelection = () => {
    setPlotsToVisit([]);
  };

  // Check if any plots are available for selection
  const hasAvailablePlots = selectedTrial && 
    mockPlots[selectedTrial as keyof typeof mockPlots].some(plot => plot.pendingObservations > 0);

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Field Navigation</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Trial Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 col-span-1">
          <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Select Trial</h2>
          <div className="space-y-3">
            {mockTrials.map(trial => (
              <button
                key={trial.id}
                onClick={() => handleTrialSelect(trial.id)}
                className={`w-full text-left p-3 rounded-md flex justify-between items-center transition ${
                  selectedTrial === trial.id
                    ? 'bg-primary-100 dark:bg-primary-900 border-l-4 border-primary-500'
                    : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                <div className="flex-1">
                  <div className="font-medium">{trial.name}</div>
                  <div className={`text-sm ${trial.pendingObservations > 0 ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    {trial.pendingObservations} pending observations
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Plot Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Select Plots</h2>
            {selectedTrial && hasAvailablePlots && (
              <div className="flex gap-2">
                <button
                  onClick={selectAllPlots}
                  className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-2 py-1 rounded"
                >
                  Select All
                </button>
                <button
                  onClick={clearSelection}
                  className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-2 py-1 rounded"
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          {!selectedTrial ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Select a trial to view available plots
            </div>
          ) : !hasAvailablePlots ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No plots with pending observations in this trial
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 plot-grid max-h-[300px] overflow-y-auto p-1">
              {selectedTrial &&
                mockPlots[selectedTrial as keyof typeof mockPlots]
                  .filter(plot => plot.pendingObservations > 0)
                  .map(plot => (
                    <button
                      key={plot.id}
                      onClick={() => togglePlotSelection(plot.id)}
                      className={`p-2 text-center rounded border transition ${
                        plotsToVisit.includes(plot.id)
                          ? 'bg-primary-50 dark:bg-primary-900 border-primary-500'
                          : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                      }`}
                    >
                      <div className="font-medium">{plot.number}</div>
                      <div className="text-xs text-primary-600 dark:text-primary-400">
                        {plot.pendingObservations} observations
                      </div>
                    </button>
                  ))}
            </div>
          )}
        </div>

        {/* Route Optimization */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 col-span-1">
          <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Route Options</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Optimize by:
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="optimizeBy"
                  value="distance"
                  checked={optimizeBy === 'distance'}
                  onChange={() => setOptimizeBy('distance')}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Shortest Distance
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="optimizeBy"
                  value="priority"
                  checked={optimizeBy === 'priority'}
                  onChange={() => setOptimizeBy('priority')}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Priority
                </span>
              </label>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">
              Selected Plots: {plotsToVisit.length}
            </div>
            {plotsToVisit.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded text-sm max-h-[120px] overflow-y-auto">
                {plotsToVisit.map(plotId => (
                  <div key={plotId} className="mb-1 last:mb-0">
                    {plotId}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <button
            disabled={plotsToVisit.length === 0}
            className={`w-full py-2 px-4 rounded-md text-center ${
              plotsToVisit.length > 0
                ? 'bg-primary-600 hover:bg-primary-700 text-white'
                : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed text-gray-500 dark:text-gray-400'
            }`}
          >
            Start Navigation
          </button>
        </div>
      </div>

      {/* Mock Map - In a real implementation, this would use Leaflet */}
      {selectedTrial && (
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-5">
          <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Trial Map</h2>
          <div className="bg-gray-100 dark:bg-gray-700 h-96 rounded-md flex items-center justify-center">
            <div className="text-gray-500 dark:text-gray-400 text-center">
              <p className="mb-2">Interactive map would be displayed here using Leaflet.</p>
              <p className="text-sm">Selected plots: {plotsToVisit.length}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}