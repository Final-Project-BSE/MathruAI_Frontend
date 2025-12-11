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
        <div className="w-16 h-16 bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Welcome, {userName}!
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
        <Button
          onClick={onLogout}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;