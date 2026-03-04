import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Clock, Heart, LogOut } from 'lucide-react';

interface DashboardHeaderProps {
  userName: string;
  pregnancyWeek: number;
  onRefresh: () => void;
  onHistoryToggle: () => void;
  onLogout: () => void;
  loading: boolean;
  showHistory: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName,
  pregnancyWeek,
  onRefresh,
  onHistoryToggle,
  onLogout,
  loading,
  showHistory
}) => {
  return (
    <div className="mb-8 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text">
            Check Today's Recommendation, {userName}!
          </h1>
          <p className="text-gray-600 mt-1">
            Week {pregnancyWeek} of your pregnancy journey
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          onClick={onHistoryToggle}
          variant="outline"
          className="flex items-center space-x-2 border-purple-300 hover:bg-purple-50"
        >
          <Clock className="h-4 w-4" />
          <span>{showHistory ? 'Hide History' : 'View History'}</span>
        </Button>
        <Button
          onClick={onRefresh}
          variant="outline"
          className="flex items-center space-x-2 border-pink-300 hover:bg-pink-50"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;