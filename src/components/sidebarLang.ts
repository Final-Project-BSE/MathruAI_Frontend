import type { LanguageCode } from "@/components/common/useLanguage";

type SidebarTranslation = {
  nav: {
    reproductiveDashboard: string;
    pregnancyDashboard: string;
    postpartumDashboard: string;
    cycleTracker: string;
    healthMonitoring: string;
    dailyRecommendations: string;
    midwifeConnection: string;
    aiAssistant: string;
    healthRecords: string;
    timelineMilestone: string;
    announcements: string;
    recoveryTracking: string;
    breastfeedingSupport: string;
    threePosha: string;
    birthControl: string;
    analytics: string;
  };
  logo: string;
  logout: string;
};

export const sidebarTranslations: Record<LanguageCode, SidebarTranslation> = {
  en: {
    nav: {
      reproductiveDashboard: "Reproductive Dashboard",
      pregnancyDashboard: "Pregnancy Dashboard",
      postpartumDashboard: "Postpartum Dashboard",
      cycleTracker: "Cycle Tracker",
      healthMonitoring: "Health Monitoring",
      dailyRecommendations: "Daily Recommendations",
      midwifeConnection: "Midwife Connection",
      aiAssistant: "AI Assistant",
      healthRecords: "Health Records",
      timelineMilestone: "Timeline & Milestone",
      announcements: "Announcements",
      recoveryTracking: "Recovery Tracking",
      breastfeedingSupport: "Breastfeeding Support",
      threePosha: "Three Posha",
      birthControl: "Birth Control",
      analytics: "Analytics",
    },
    logo: "Logo",
    logout: "Log out",
  },

  si: {
    nav: {
      reproductiveDashboard: "ප්‍රජනන පුවරුව",
      pregnancyDashboard: "ගැබිනි මවගේ පුවරුව",
      postpartumDashboard: "ප්‍රසවයෙන් පසු පුවරුව",
      cycleTracker: "මාසික චක්‍ර නිරීක්ෂකය",
      healthMonitoring: "සෞඛ්‍ය නිරීක්ෂණය",
      dailyRecommendations: "දෛනික යෝජනා",
      midwifeConnection: "පවුල් සෞඛ්‍ය සේවිකා සම්බන්ධතාව",
      aiAssistant: "AI සහායක",
      healthRecords: "සෞඛ්‍ය ලේඛන",
      timelineMilestone: "කාලරේඛාව සහ සන්ධිස්ථාන",
      announcements: "නිවේදන",
      recoveryTracking: "ප්‍රකෘති නිරීක්ෂණය",
      breastfeedingSupport: "මව්කිරි දීමේ සහාය",
      threePosha: "ත්‍රිපෝෂ",
      birthControl: "උපත් පාලනය",
      analytics: "විශ්ලේෂණ",
    },
    logo: "ලාංඡනය",
    logout: "පිටවන්න",
  },

  ta: {
    nav: {
      reproductiveDashboard: "இனப்பெருக்க டாஷ்போர்டு",
      pregnancyDashboard: "கர்ப்பகால டாஷ்போர்டு",
      postpartumDashboard: "பிறப்புக்குப் பிந்தைய டாஷ்போர்டு",
      cycleTracker: "மாதவிடாய் சுழற்சி கண்காணிப்பு",
      healthMonitoring: "சுகாதார கண்காணிப்பு",
      dailyRecommendations: "தினசரி பரிந்துரைகள்",
      midwifeConnection: "தாதி இணைப்பு",
      aiAssistant: "AI உதவியாளர்",
      healthRecords: "சுகாதார பதிவுகள்",
      timelineMilestone: "காலவரிசை மற்றும் மைல்கற்கள்",
      announcements: "அறிவிப்புகள்",
      recoveryTracking: "மீட்பு கண்காணிப்பு",
      breastfeedingSupport: "தாய்ப்பால் ஆதரவு",
      threePosha: "திரிபோஷா",
      birthControl: "பிறப்பு கட்டுப்பாடு",
      analytics: "பகுப்பாய்வு",
    },
    logo: "லோகோ",
    logout: "வெளியேறு",
  },
};