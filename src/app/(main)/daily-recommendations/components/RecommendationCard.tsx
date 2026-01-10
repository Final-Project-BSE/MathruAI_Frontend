import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, RefreshCw, User, Settings } from 'lucide-react';
import type { RecommendationData } from '../../../api/dailyrecommendation/types';

interface RecommendationCardProps {
  recommendation: RecommendationData | null;
  onRefresh: () => void;
  onSettingsClick: () => void;
  loading: boolean;
  preferences?: string;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onRefresh,
  onSettingsClick,
  loading,
  preferences
}) => {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Card className="shadow-md bg-white border-2 border-purple-100">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          <div className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-purple-500" />
            Today's Recommendation
          </div>
          <div className="flex gap-2">
            <Button
              onClick={onSettingsClick}
              variant="outline"
              size="sm"
              className="border-blue-300 hover:bg-blue-50"
            >
              <Settings className="h-4 w-4" /> Update Your Data
            </Button>
            <Button
              onClick={onRefresh}
              variant="outline"
              size="sm"
              className="border-purple-300 hover:bg-purple-50"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">{today}</p>

        {!recommendation ? (
          <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200">
            <div className="text-center">
              <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No recommendation yet</p>
              <p className="text-sm text-gray-400 mt-2">
                Click refresh to get your daily recommendation
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-xl p-6 border border-purple-100">
              <p className="text-lg text-gray-700 leading-relaxed">
                {recommendation.recommendation}
              </p>
            </div>

            {preferences && (
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                <User className="w-5 h-5 text-purple-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Personalized for you
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">{preferences}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecommendationCard;