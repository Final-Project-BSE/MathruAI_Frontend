import React from 'react';
import DailyRecommendationDashboard from './components/DailyRecommendationDashboard';
import Container from '@/components/shared/container';


const DailyRecommendationsPage = () => {
  return (
      <Container title="Daily Recommendation">
      <DailyRecommendationDashboard />
    </Container>
  );
};

export default DailyRecommendationsPage;