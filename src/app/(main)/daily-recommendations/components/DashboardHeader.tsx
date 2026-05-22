import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useLanguage } from "@/components/common/useLanguage";

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
  const { t } = useLanguage();
  const labels = t.dailyRecommendation;

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
      <div>
        <h1 className="text-3xl font-bold">
          {labels.headerTitle(userName)}
        </h1>
        <p className="text-gray-600 mt-1">
          {labels.pregnancyJourney(pregnancyWeek)}
        </p>
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