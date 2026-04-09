import React from 'react';
import ProfileDashboard from './components/ProfileDashboard';
import Container from '@/components/shared/container';

const ProfilePage = () => {
  return (
    <Container title="My Profile">
      <ProfileDashboard />
    </Container>
  );
};

export default ProfilePage;