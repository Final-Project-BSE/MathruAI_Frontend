import React from 'react';
import MaternalHealthDashboard from './components/MaternalHealthDashboard';
import Container from '@/components/shared/container';

const HealthMonitorPage = () => {
    return (
      <Container title="Health Monitoring">
        <MaternalHealthDashboard />
      </Container>
    );
};

export default HealthMonitorPage;