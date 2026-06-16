import type { LanguageCode } from "@/components/common/useLanguage";

export const reproductiveTranslations: Record<
  LanguageCode,
  {
    dashboard: {
      title: string;
      subtitle: string;
      healthyMessage: string;
      nextPeriodIn: string;
    };

    features: {
      appointment: string;
      emergencyNumbers: string;
      notes: string;
      analytics: string;
      openAppointment: string;
      openEmergencyNumbers: string;
      openNotes: string;
      openAnalytics: string;
    };

    health: {
      title: string;
      noAssessment: string;
      goodHealth: string;
      needsAttention: string;
      highRisk: string;
      riskConfidence: string;
      assessment: string;
      bmi: string;
      bloodPressure: string;
      heartRate: string;
      loading: string;
      loginRequired: string;
      failed: string;
      noSaved: string;
      justNow: string;
      minAgo: string;
      hrAgo: string;
      dayAgo: string;
      daysAgo: string;
    };

    cycle: {
      title: string;
      loading: string;
      loginRequired: string;
      failed: string;
      noData: string;
      noDataDesc: string;
      nextPeriod: string;
      cycleLength: string;
      ovulation: string;
      fertileWindow: string;
      expectedOn: string;
      in: string;
      notCalculated: string;
      invalidDate: string;
    };

    announcement: {
      title: string;
      loading: string;
      loginRequired: string;
      failed: string;
      noActive: string;
      noActiveDesc: string;
      urgent: string;
      warning: string;
      info: string;
      health: string;
    };

    midwife: {
      title: string;
      loading: string;
      noAssigned: string;
      noAssignedDesc: string;
      findMidwife: string;
      assignedMidwife: string;
      askQuestion: string;
      notLoggedIn: string;
      identifyFailed: string;
      noMidwifeServer: string;
      loadFailed: string;
    };
  }
> = {
  en: {
    dashboard: {
      title: "Reproductive Planning Dashboard",
      subtitle: "Current Cycle Day",
      healthyMessage: "Your cycle is looking healthy!",
      nextPeriodIn: "Next period in",
    },

    features: {
      appointment: "Appointment",
      emergencyNumbers: "Emergency Numbers",
      notes: "Notes",
      analytics: "Analytics",
      openAppointment: "Open appointment",
      openEmergencyNumbers: "Open emergency numbers",
      openNotes: "Open notes",
      openAnalytics: "Open analytics",
    },

    health: {
      title: "Health Status Summary",
      noAssessment: "No assessment yet",
      goodHealth: "Good Health Status",
      needsAttention: "Needs Attention",
      highRisk: "High Risk",
      riskConfidence: "Risk Confidence",
      assessment: "Assessment",
      bmi: "BMI",
      bloodPressure: "Blood Pressure",
      heartRate: "Heart Rate",
      loading: "Loading health status...",
      loginRequired: "Please log in to see your health summary.",
      failed: "Failed to load summary.",
      noSaved:
        "No saved assessment yet. Click to add vitals and get your first assessment.",
      justNow: "just now",
      minAgo: "min ago",
      hrAgo: "hr ago",
      dayAgo: "day ago",
      daysAgo: "days ago",
    },

    cycle: {
      title: "Cycle Tracker",
      loading: "Loading cycle data...",
      loginRequired: "Please log in to view your cycle tracker.",
      failed: "Failed to load cycle tracker data.",
      noData: "No cycle data available",
      noDataDesc:
        "Calculate your fertility window to see your cycle summary here.",
      nextPeriod: "Next Period",
      cycleLength: "Cycle Length",
      ovulation: "Ovulation",
      fertileWindow: "Fertile Window",
      expectedOn: "Expected on",
      in: "in",
      notCalculated: "Not calculated",
      invalidDate: "Invalid date",
    },

    announcement: {
      title: "Announcements",
      loading: "Loading announcements...",
      loginRequired: "Please log in to view announcements.",
      failed: "Failed to load announcements.",
      noActive: "No active announcements",
      noActiveDesc: "New updates will appear here when available.",
      urgent: "Urgent",
      warning: "Warning",
      info: "Info",
      health: "Health",
    },

    midwife: {
      title: "Midwife Connectivity",
      loading: "Loading assigned midwife...",
      noAssigned: "No midwife assigned",
      noAssignedDesc: "Connect with a midwife to share health updates.",
      findMidwife: "Find Midwife",
      assignedMidwife: "Assigned Midwife",
      askQuestion: "Ask Question",
      notLoggedIn: "You are not logged in.",
      identifyFailed: "Could not identify the current user.",
      noMidwifeServer: "No midwife is currently assigned.",
      loadFailed: "Failed to load assigned midwife.",
    },
  },

  si: {
    dashboard: {
      title: "ප්‍රජනන සැලසුම් පුවරුව",
      subtitle: "වත්මන් චක්‍ර දිනය",
      healthyMessage: "ඔබේ චක්‍රය සෞඛ්‍ය සම්පන්නව පෙනේ!",
      nextPeriodIn: "ඊළඟ මාසිකයට තව",
    },

    features: {
      appointment: "පත්වීම",
      emergencyNumbers: "හදිසි අංක",
      notes: "සටහන්",
      analytics: "විශ්ලේෂණ",
      openAppointment: "පත්වීම් විවෘත කරන්න",
      openEmergencyNumbers: "හදිසි අංක විවෘත කරන්න",
      openNotes: "සටහන් විවෘත කරන්න",
      openAnalytics: "විශ්ලේෂණ විවෘත කරන්න",
    },

    health: {
      title: "සෞඛ්‍ය තත්ත්ව සාරාංශය",
      noAssessment: "තවම තක්සේරුවක් නැත",
      goodHealth: "හොඳ සෞඛ්‍ය තත්ත්වයක්",
      needsAttention: "අවධානය අවශ්‍යයි",
      highRisk: "ඉහළ අවදානම",
      riskConfidence: "අවදානම් විශ්වාස මට්ටම",
      assessment: "තක්සේරුව",
      bmi: "BMI",
      bloodPressure: "රුධිර පීඩනය",
      heartRate: "හෘද ස්පන්දන වේගය",
      loading: "සෞඛ්‍ය තත්ත්වය පූරණය වෙමින්...",
      loginRequired: "ඔබේ සෞඛ්‍ය සාරාංශය බැලීමට ලොග් වන්න.",
      failed: "සාරාංශය පූරණය කිරීමට අසමත් විය.",
      noSaved:
        "තවම සුරකින ලද තක්සේරුවක් නැත. පළමු තක්සේරුව ලබා ගැනීමට විටල්ස් එක් කරන්න.",
      justNow: "දැන්ම",
      minAgo: "මිනිත්තු පෙර",
      hrAgo: "පැය පෙර",
      dayAgo: "දිනකට පෙර",
      daysAgo: "දින පෙර",
    },

    cycle: {
      title: "චක්‍ර නිරීක්ෂකය",
      loading: "චක්‍ර දත්ත පූරණය වෙමින්...",
      loginRequired: "චක්‍ර නිරීක්ෂකය බැලීමට ලොග් වන්න.",
      failed: "චක්‍ර දත්ත පූරණය කිරීමට අසමත් විය.",
      noData: "චක්‍ර දත්ත නොමැත",
      noDataDesc:
        "ඔබේ චක්‍ර සාරාංශය බැලීමට සරු කාලය ගණනය කරන්න.",
      nextPeriod: "ඊළඟ මාසිකය",
      cycleLength: "චක්‍ර දිග",
      ovulation: "ඩිම්බනීකරණය",
      fertileWindow: "සරු කාලය",
      expectedOn: "අපේක්ෂිත දිනය",
      in: "තව",
      notCalculated: "ගණනය කර නැත",
      invalidDate: "වලංගු නොවන දිනය",
    },

    announcement: {
      title: "නිවේදන",
      loading: "නිවේදන පූරණය වෙමින්...",
      loginRequired: "නිවේදන බැලීමට ලොග් වන්න.",
      failed: "නිවේදන පූරණය කිරීමට අසමත් විය.",
      noActive: "ක්‍රියාකාරී නිවේදන නැත",
      noActiveDesc: "නව යාවත්කාලීන මෙහි පෙන්වනු ඇත.",
      urgent: "හදිසි",
      warning: "අනතුරු ඇඟවීම",
      info: "තොරතුරු",
      health: "සෞඛ්‍ය",
    },

    midwife: {
      title: "වින්නඹු මාතා සම්බන්ධතාව",
      loading: "පවරා ඇති වින්නඹු මාතාව පූරණය වෙමින්...",
      noAssigned: "වින්නඹු මාතාවක් පවරා නැත",
      noAssignedDesc:
        "සෞඛ්‍ය යාවත්කාලීන බෙදා ගැනීමට වින්නඹු මාතාවක් සමඟ සම්බන්ධ වන්න.",
      findMidwife: "වින්නඹු මාතාව සොයන්න",
      assignedMidwife: "පවරා ඇති වින්නඹු මාතාව",
      askQuestion: "ප්‍රශ්නයක් අසන්න",
      notLoggedIn: "ඔබ ලොග් වී නොමැත.",
      identifyFailed: "වත්මන් පරිශීලකයා හඳුනාගත නොහැකි විය.",
      noMidwifeServer: "දැනට වින්නඹු මාතාවක් පවරා නැත.",
      loadFailed: "වින්නඹු මාතාව පූරණය කිරීමට අසමත් විය.",
    },
  },

  ta: {
    dashboard: {
      title: "இனப்பெருக்க திட்டமிடல் டாஷ்போர்டு",
      subtitle: "தற்போதைய சுழற்சி நாள்",
      healthyMessage: "உங்கள் சுழற்சி ஆரோக்கியமாக தெரிகிறது!",
      nextPeriodIn: "அடுத்த மாதவிடாய் இன்னும்",
    },

    features: {
      appointment: "நேர்காணல்",
      emergencyNumbers: "அவசர எண்கள்",
      notes: "குறிப்புகள்",
      analytics: "பகுப்பாய்வு",
      openAppointment: "நேர்காணலை திற",
      openEmergencyNumbers: "அவசர எண்களை திற",
      openNotes: "குறிப்புகளை திற",
      openAnalytics: "பகுப்பாய்வை திற",
    },

    health: {
      title: "ஆரோக்கிய நிலை சுருக்கம்",
      noAssessment: "இன்னும் மதிப்பீடு இல்லை",
      goodHealth: "நல்ல ஆரோக்கிய நிலை",
      needsAttention: "கவனம் தேவை",
      highRisk: "அதிக ஆபத்து",
      riskConfidence: "ஆபத்து நம்பிக்கை",
      assessment: "மதிப்பீடு",
      bmi: "BMI",
      bloodPressure: "இரத்த அழுத்தம்",
      heartRate: "இதய துடிப்பு",
      loading: "ஆரோக்கிய நிலை ஏற்றுகிறது...",
      loginRequired: "உங்கள் ஆரோக்கிய சுருக்கத்தைப் பார்க்க உள்நுழையவும்.",
      failed: "சுருக்கத்தை ஏற்ற முடியவில்லை.",
      noSaved:
        "சேமிக்கப்பட்ட மதிப்பீடு இல்லை. முதல் மதிப்பீட்டை பெற விவரங்களைச் சேர்க்கவும்.",
      justNow: "இப்போது",
      minAgo: "நிமிடங்களுக்கு முன்",
      hrAgo: "மணி நேரங்களுக்கு முன்",
      dayAgo: "நாள் முன்",
      daysAgo: "நாட்களுக்கு முன்",
    },

    cycle: {
      title: "சுழற்சி கண்காணிப்பு",
      loading: "சுழற்சி தரவு ஏற்றுகிறது...",
      loginRequired: "சுழற்சி கண்காணிப்பைப் பார்க்க உள்நுழையவும்.",
      failed: "சுழற்சி தரவை ஏற்ற முடியவில்லை.",
      noData: "சுழற்சி தரவு இல்லை",
      noDataDesc:
        "உங்கள் சுழற்சி சுருக்கத்தைப் பார்க்க கருவுறும் காலத்தை கணக்கிடவும்.",
      nextPeriod: "அடுத்த மாதவிடாய்",
      cycleLength: "சுழற்சி நீளம்",
      ovulation: "முட்டையிடுதல்",
      fertileWindow: "கருவுறும் காலம்",
      expectedOn: "எதிர்பார்க்கப்படும் தேதி",
      in: "இன்னும்",
      notCalculated: "கணக்கிடப்படவில்லை",
      invalidDate: "தவறான தேதி",
    },

    announcement: {
      title: "அறிவிப்புகள்",
      loading: "அறிவிப்புகள் ஏற்றுகிறது...",
      loginRequired: "அறிவிப்புகளைப் பார்க்க உள்நுழையவும்.",
      failed: "அறிவிப்புகளை ஏற்ற முடியவில்லை.",
      noActive: "செயலில் உள்ள அறிவிப்புகள் இல்லை",
      noActiveDesc: "புதிய புதுப்பிப்புகள் இங்கே தோன்றும்.",
      urgent: "அவசரம்",
      warning: "எச்சரிக்கை",
      info: "தகவல்",
      health: "ஆரோக்கியம்",
    },

    midwife: {
      title: "மருத்துவச்சி இணைப்பு",
      loading: "ஒதுக்கப்பட்ட மருத்துவச்சி ஏற்றப்படுகிறது...",
      noAssigned: "மருத்துவச்சி ஒதுக்கப்படவில்லை",
      noAssignedDesc:
        "ஆரோக்கிய புதுப்பிப்புகளைப் பகிர மருத்துவச்சியுடன் இணைக்கவும்.",
      findMidwife: "மருத்துவச்சியை கண்டுபிடி",
      assignedMidwife: "ஒதுக்கப்பட்ட மருத்துவச்சி",
      askQuestion: "கேள்வி கேள்",
      notLoggedIn: "நீங்கள் உள்நுழையவில்லை.",
      identifyFailed: "தற்போதைய பயனரை அடையாளம் காண முடியவில்லை.",
      noMidwifeServer: "தற்போது மருத்துவச்சி ஒதுக்கப்படவில்லை.",
      loadFailed: "மருத்துவச்சியை ஏற்ற முடியவில்லை.",
    },
  },
};