import React from 'react';
import { User, Calendar, Heart, Activity } from 'lucide-react';

interface PatientProfileSummaryProps {
  patientProfile: Record<string, any>;
}

const PatientProfileSummary: React.FC<PatientProfileSummaryProps> = ({
  patientProfile
}) => {
  // Helper function to get icon based on key name
  const getIconForField = (key: string) => {
    const keyLower = key.toLowerCase();
    if (keyLower.includes('age') || keyLower.includes('date')) {
      return <Calendar className="h-4 w-4 text-purple-600" />;
    }
    if (keyLower.includes('heart') || keyLower.includes('cardiac')) {
      return <Heart className="h-4 w-4 text-purple-600" />;
    }
    if (keyLower.includes('activity') || keyLower.includes('exercise')) {
      return <Activity className="h-4 w-4 text-purple-600" />;
    }
    return <User className="h-4 w-4 text-purple-600" />;
  };

  // Helper function to format the key for display
  const formatKey = (key: string): string => {
    return key
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Helper function to format the value for display
  const formatValue = (value: any): string => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    }
    return String(value);
  };

  if (!patientProfile || Object.keys(patientProfile).length === 0) {
    return null;
  }

  return (
    <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-200">
      <div className="flex items-center space-x-2 mb-4">
        <User className="h-5 w-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-800">
          Patient Profile Summary
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(patientProfile).map(([key, value]) => (
          <div
            key={key}
            className="bg-white p-4 rounded-lg border border-purple-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start space-x-3">
              <div className="mt-0.5">{getIconForField(key)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                  {formatKey(key)}
                </p>
                <p className="text-sm font-semibold text-gray-800 break-words">
                  {formatValue(value)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientProfileSummary;