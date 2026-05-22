import type { LanguageCode } from "@/components/common/useLanguage";

export const announcementTranslations: Record<
  LanguageCode,
  {
    title: string;
    subtitle: string;
    active: string;
    translating: string;
    noAnnouncements: string;
    noAnnouncementsDescription: string;
    failedToLoad: string;
    loginRequired: string;
    authError: string;
    justNow: string;
    minAgo: string;
    hrAgo: string;
    daysAgo: string;
    categories: Record<string, string>;
  }
> = {
  en: {
    title: "Announcements",
    subtitle: "Stay informed with the latest updates",
    active: "Active",
    translating: "Translating announcements...",
    noAnnouncements: "No announcements available",
    noAnnouncementsDescription: "Check back later for updates",
    failedToLoad: "Failed to load announcements.",
    loginRequired: "Please log in to view announcements.",
    authError: "Authentication error. Please log in again.",
    justNow: "Just now",
    minAgo: "min ago",
    hrAgo: "hr ago",
    daysAgo: "days ago",
    categories: {
      urgent: "Urgent",
      warning: "Warning",
      info: "Info",
      health: "Health",
      general: "General",
    },
  },

  si: {
    title: "නිවේදන",
    subtitle: "නවතම යාවත්කාලීන කිරීම් පිළිබඳ දැනුවත් වන්න",
    active: "සක්‍රීය",
    translating: "නිවේදන පරිවර්තනය කරමින්...",
    noAnnouncements: "නිවේදන නොමැත",
    noAnnouncementsDescription: "යාවත්කාලීන කිරීම් සඳහා පසුව නැවත බලන්න",
    failedToLoad: "නිවේදන පූරණය කිරීමට අසමත් විය.",
    loginRequired: "නිවේදන බැලීමට කරුණාකර පිවිසෙන්න.",
    authError: "සත්‍යාපන දෝෂයක් ඇති විය. කරුණාකර නැවත පිවිසෙන්න.",
    justNow: "දැන්ම",
    minAgo: "මිනිත්තු පෙර",
    hrAgo: "පැය පෙර",
    daysAgo: "දින පෙර",
    categories: {
      urgent: "හදිසි",
      warning: "අවවාදයයි",
      info: "තොරතුරු",
      health: "සෞඛ්‍ය",
      general: "සාමාන්‍ය",
    },
  },

  ta: {
    title: "அறிவிப்புகள்",
    subtitle: "சமீபத்திய புதுப்பிப்புகளை அறிந்து கொள்ளுங்கள்",
    active: "செயலில்",
    translating: "அறிவிப்புகள் மொழிபெயர்க்கப்படுகின்றன...",
    noAnnouncements: "அறிவிப்புகள் இல்லை",
    noAnnouncementsDescription: "புதுப்பிப்புகளுக்காக பின்னர் மீண்டும் பார்க்கவும்",
    failedToLoad: "அறிவிப்புகளை ஏற்ற முடியவில்லை.",
    loginRequired: "அறிவிப்புகளை பார்க்க தயவுசெய்து உள்நுழையவும்.",
    authError: "அங்கீகாரப் பிழை ஏற்பட்டது. தயவுசெய்து மீண்டும் உள்நுழையவும்.",
    justNow: "இப்போதுதான்",
    minAgo: "நிமிடங்களுக்கு முன்",
    hrAgo: "மணிநேரங்களுக்கு முன்",
    daysAgo: "நாட்களுக்கு முன்",
    categories: {
      urgent: "அவசரம்",
      warning: "எச்சரிக்கை",
      info: "தகவல்",
      health: "சுகாதாரம்",
      general: "பொது",
    },
  },
};