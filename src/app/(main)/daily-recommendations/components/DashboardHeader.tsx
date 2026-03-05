import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface DashboardHeaderProps {
  userName: string;
  pregnancyWeek: number;
  onRefresh: () => void;
  onLogout: () => void;
  loading: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName,
  pregnancyWeek,
  onRefresh,
  onLogout,
  loading,
}) => {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
      <div>
        <h1 className="text-3xl font-bold">Check Today's Recommendation, {userName}!</h1>
        <p className="text-gray-600 mt-1">Week {pregnancyWeek} of your pregnancy journey</p>
      </div>

      {/* <div className="flex flex-wrap gap-2">
        <Button
          onClick={onRefresh}
          variant="outline"
          className="flex items-center space-x-2 border-pink-300 hover:bg-pink-50"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </Button>

        <Button onClick={onLogout} variant="outline" className="border-gray-300 hover:bg-gray-50">
          Logout
        </Button>
      </div> */}
    </div>
  );
};

export default DashboardHeader;