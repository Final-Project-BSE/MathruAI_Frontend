import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Calendar } from 'lucide-react';
import type { HistoryItem } from '../../../api/dailyrecommendation/types';

interface HistorySectionProps {
  history: HistoryItem[];
  loading: boolean;
}

const HistorySection: React.FC<HistorySectionProps> = ({ history, loading }) => {
  return (
    <Card className="shadow-md bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center">
          <BookOpen className="h-5 w-5 mr-2 text-purple-500" />
          Recent Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-gray-500">
            <div className="animate-spin h-8 w-8 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto mb-3" />
            <p>Loading history...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No recommendation history yet</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {history.map((item, index) => (
              <div
                key={index}
                className="group p-5 bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl hover:from-purple-50 hover:to-pink-50 transition-all border border-gray-200 hover:border-purple-200 hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-purple-600 bg-white px-3 py-1 rounded-full">
                    {new Date(item.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <Calendar className="w-4 h-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{item.recommendation}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HistorySection;
