"use client";

import BreastfeedingDashboard from './components/BreastfeedingDashboard';
import Container from '@/components/shared/container';
import { useLanguage } from '@/components/common/useLanguage';

const BreastfeedingSupportPage = () => {
  const { t } = useLanguage();

  return (
    <Container title={t.breastfeeding.pageTitle}>
      <BreastfeedingDashboard />
    </Container>
  );
};

export default BreastfeedingSupportPage;
