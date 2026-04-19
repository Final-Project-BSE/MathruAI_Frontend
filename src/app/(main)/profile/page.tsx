import React from 'react';
import ProfileDashboard from './components/ProfileDashboard';
import Container from '@/components/shared/container';
import TopBarFeatures from '@/components/common/TopBarFeatures';

const ProfilePage = () => {
  return (
    <Container title="My Profile">
      <div className='p-4'>
      <TopBarFeatures />
      </div>
      <ProfileDashboard />
    </Container>
  );
};

export default ProfilePage;