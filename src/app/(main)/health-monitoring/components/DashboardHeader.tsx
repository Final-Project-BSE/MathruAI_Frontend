import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Trash2 } from 'lucide-react';

interface DashboardHeaderProps {
  onRefresh: () => void;
  onDelete: () => void;
  currentPredictionId: string | null;
  loading: boolean;
  loadingData: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onRefresh,
  onDelete,
  currentPredictionId,
  loading,
  loadingData
}) => {
  return (
    <div className="mb-8 flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Maternal Health Monitoring
        </h1>
        <p className="text-gray-600">
          Track your vital signs and get AI powered risk assessment
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          onClick={onRefresh}
          variant="outline"
          className="flex items-center space-x-2"
          disabled={loading || loadingData}
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </Button>
        {currentPredictionId && (
          <Button
            onClick={onDelete}
            variant="outline"
            className="flex items-center space-x-2 text-red-600 border-red-300 hover:bg-red-50"
            disabled={loading}
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;