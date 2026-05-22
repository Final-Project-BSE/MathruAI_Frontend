import type { LanguageCode } from "@/components/common/useLanguage";

export const postpartumTranslations: Record<
  LanguageCode,
  {
    page: {
      title: string;
      subtitle: string;
      loading: string;
    };

    topbar: {
      trackRecoveryProgress: string;
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

    recovery: {
      title: string;
      loading: string;
      loginRequired: string;
      identifyFailed: string;
      failed: string;
      currentRecoveryDay: string;
      day: string;
      dailyCompletion: string;
      of: string;
      tasks: string;
      notesTitle: string;
      notesDescription: string;
    };
  }
> = {
  en: {
    page: {
      title: "Postpartum Dashboard",
      subtitle: "Track your recovery progress",
      loading: "Loading postpartum data...",
    },

    topbar: {
      trackRecoveryProgress: "Track your recovery progress",
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

    recovery: {
      title: "Recovery Tracking",
      loading: "Loading recovery progress...",
      loginRequired: "Please log in to view recovery tracking.",
      identifyFailed: "Unable to identify patient account.",
      failed: "Failed to load recovery tracking.",
      currentRecoveryDay: "Current Recovery Day",
      day: "Day",
      dailyCompletion: "Daily completion",
      of: "of",
      tasks: "tasks",
      notesTitle: "Keep your daily recovery notes updated",
      notesDescription:
        "Track symptoms, physical recovery, nutrition, baby care, and mental wellbeing.",
    },
  },

  si: {
    page: {
      title: "ප්‍රසූතියෙන් පසු පුවරුව",
      subtitle: "ඔබේ සුවය ලැබීමේ ප්‍රගතිය නිරීක්ෂණය කරන්න",
      loading: "ප්‍රසූතියෙන් පසු දත්ත පූරණය වෙමින්...",
    },

    topbar: {
      trackRecoveryProgress: "ඔබේ සුවය ලැබීමේ ප්‍රගතිය නිරීක්ෂණය කරන්න",
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
      failed: "සෞඛ්‍ය සාරාංශය පූරණය කිරීමට අසමත් විය.",
      noSaved:
        "තවම සුරකින ලද තක්සේරුවක් නැත. පළමු තක්සේරුව ලබා ගැනීමට විටල්ස් එක් කරන්න.",
      justNow: "දැන්ම",
      minAgo: "මිනිත්තු පෙර",
      hrAgo: "පැය පෙර",
      dayAgo: "දිනකට පෙර",
      daysAgo: "දින පෙර",
    },

    recovery: {
      title: "සුවය ලැබීම නිරීක්ෂණය",
      loading: "සුවය ලැබීමේ ප්‍රගතිය පූරණය වෙමින්...",
      loginRequired: "සුවය ලැබීම නිරීක්ෂණය බැලීමට ලොග් වන්න.",
      identifyFailed: "රෝගී ගිණුම හඳුනාගත නොහැක.",
      failed: "සුවය ලැබීමේ දත්ත පූරණය කිරීමට අසමත් විය.",
      currentRecoveryDay: "වත්මන් සුවය ලැබීමේ දිනය",
      day: "දිනය",
      dailyCompletion: "දෛනික සම්පූර්ණ කිරීම",
      of: "න්",
      tasks: "කාර්යයන්",
      notesTitle: "ඔබේ දෛනික සුවය ලැබීමේ සටහන් යාවත්කාලීනව තබා ගන්න",
      notesDescription:
        "ලක්ෂණ, ශාරීරික සුවය, පෝෂණය, බිළිඳාගේ සත්කාරය සහ මානසික යහපැවැත්ම නිරීක්ෂණය කරන්න.",
    },
  },

  ta: {
    page: {
      title: "பிரசவத்திற்குப் பிந்தைய டாஷ்போர்டு",
      subtitle: "உங்கள் மீட்பு முன்னேற்றத்தை கண்காணிக்கவும்",
      loading: "பிரசவத்திற்குப் பிந்தைய தரவு ஏற்றப்படுகிறது...",
    },

    topbar: {
      trackRecoveryProgress: "உங்கள் மீட்பு முன்னேற்றத்தை கண்காணிக்கவும்",
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
      failed: "ஆரோக்கிய சுருக்கத்தை ஏற்ற முடியவில்லை.",
      noSaved:
        "சேமிக்கப்பட்ட மதிப்பீடு இல்லை. முதல் மதிப்பீட்டை பெற விவரங்களைச் சேர்க்கவும்.",
      justNow: "இப்போது",
      minAgo: "நிமிடங்களுக்கு முன்",
      hrAgo: "மணி நேரங்களுக்கு முன்",
      dayAgo: "நாள் முன்",
      daysAgo: "நாட்களுக்கு முன்",
    },

    recovery: {
      title: "மீட்பு கண்காணிப்பு",
      loading: "மீட்பு முன்னேற்றம் ஏற்றப்படுகிறது...",
      loginRequired: "மீட்பு கண்காணிப்பைப் பார்க்க உள்நுழையவும்.",
      identifyFailed: "நோயாளர் கணக்கை அடையாளம் காண முடியவில்லை.",
      failed: "மீட்பு கண்காணிப்பை ஏற்ற முடியவில்லை.",
      currentRecoveryDay: "தற்போதைய மீட்பு நாள்",
      day: "நாள்",
      dailyCompletion: "தினசரி நிறைவு",
      of: "இல்",
      tasks: "பணிகள்",
      notesTitle: "உங்கள் தினசரி மீட்பு குறிப்புகளை புதுப்பித்துக் கொள்ளுங்கள்",
      notesDescription:
        "அறிகுறிகள், உடல் மீட்பு, ஊட்டச்சத்து, குழந்தை பராமரிப்பு மற்றும் மனநலத்தை கண்காணிக்கவும்.",
    },
  },
};