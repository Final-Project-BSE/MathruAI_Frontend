import type { LanguageCode } from "@/components/common/useLanguage";

export const recoveryTrackingTranslations: Record<
  LanguageCode,
  {
    title: string;
    postpartumDay: string;
    day: string;
    dailyCompletion: string;
    of: string;
    tasks: string;
    completed: string;
    saveProgress: string;
    saving: string;
    saveSuccess: string;
    saveError: string;
    dailyNotesTitle: string;
    dailyNotesPlaceholder: string;
    needHelp: string;
    contactMidwife: string;
    loadingTranslations: string;
    categories: {
      physical: string;
      nutrition: string;
      baby: string;
      mental: string;
      medical: string;
      warning: string;
    };
  }
> = {
  en: {
    title: "Recovery Tracking",
    postpartumDay: "Postpartum Day",
    day: "Day",
    dailyCompletion: "Daily completion",
    of: "of",
    tasks: "tasks",
    completed: "completed",
    saveProgress: "Save Progress",
    saving: "Saving...",
    saveSuccess: "Progress saved successfully!",
    saveError: "Failed to save progress. Please try again.",
    dailyNotesTitle: "Daily Notes & Symptoms",
    dailyNotesPlaceholder:
      "How are you feeling today? Any specific symptoms or thoughts?",
    needHelp: "Need help?",
    contactMidwife: "Contact Midwife",
    loadingTranslations: "Translating recovery guidance...",
    categories: {
      physical: "Physical Recovery",
      nutrition: "Nutrition & Hydration",
      baby: "Baby Care",
      mental: "Mental Health & Well-being",
      medical: "Medical Care & Follow-ups",
      warning: "Emergency Warning Signs",
    },
  },

  si: {
    title: "ප්‍රතිසාධන නිරීක්ෂණය",
    postpartumDay: "ප්‍රසවයෙන් පසු දිනය",
    day: "දිනය",
    dailyCompletion: "දෛනික සම්පූර්ණ කිරීම",
    of: "න්",
    tasks: "කාර්යයන්",
    completed: "සම්පූර්ණයි",
    saveProgress: "ප්‍රගතිය සුරකින්න",
    saving: "සුරකිමින්...",
    saveSuccess: "ප්‍රගතිය සාර්ථකව සුරකින ලදී!",
    saveError: "ප්‍රගතිය සුරැකීමට අසමත් විය. කරුණාකර නැවත උත්සාහ කරන්න.",
    dailyNotesTitle: "දෛනික සටහන් සහ රෝග ලක්ෂණ",
    dailyNotesPlaceholder:
      "අද ඔබට කොහොමද දැනෙන්නේ? විශේෂ රෝග ලක්ෂණ හෝ සිතුවිලි තිබේද?",
    needHelp: "උදව් අවශ්‍යද?",
    contactMidwife: "මධ්‍යමහෙදිය අමතන්න",
    loadingTranslations: "ප්‍රතිසාධන උපදෙස් පරිවර්තනය කරමින්...",
    categories: {
      physical: "ශාරීරික ප්‍රතිසාධනය",
      nutrition: "පෝෂණය සහ දියර ලබා ගැනීම",
      baby: "බිළිඳාගේ රැකවරණය",
      mental: "මානසික සෞඛ්‍යය සහ යහපැවැත්ම",
      medical: "වෛද්‍ය රැකවරණය සහ පසු විපරම්",
      warning: "හදිසි අනතුරු ඇඟවීමේ ලක්ෂණ",
    },
  },

  ta: {
    title: "மீட்பு கண்காணிப்பு",
    postpartumDay: "பிரசவத்திற்குப் பிந்தைய நாள்",
    day: "நாள்",
    dailyCompletion: "தினசரி நிறைவு",
    of: "இல்",
    tasks: "பணிகள்",
    completed: "நிறைவு",
    saveProgress: "முன்னேற்றத்தைச் சேமிக்கவும்",
    saving: "சேமிக்கிறது...",
    saveSuccess: "முன்னேற்றம் வெற்றிகரமாக சேமிக்கப்பட்டது!",
    saveError:
      "முன்னேற்றத்தைச் சேமிக்க முடியவில்லை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.",
    dailyNotesTitle: "தினசரி குறிப்புகள் மற்றும் அறிகுறிகள்",
    dailyNotesPlaceholder:
      "இன்று நீங்கள் எப்படி உணர்கிறீர்கள்? ஏதேனும் குறிப்பிட்ட அறிகுறிகள் அல்லது எண்ணங்கள் உள்ளனவா?",
    needHelp: "உதவி தேவையா?",
    contactMidwife: "மருத்துவச்சியை தொடர்புகொள்ளவும்",
    loadingTranslations: "மீட்பு வழிகாட்டுதலை மொழிபெயர்க்கிறது...",
    categories: {
      physical: "உடல் மீட்பு",
      nutrition: "ஊட்டச்சத்து மற்றும் நீர்ப்போதுமை",
      baby: "குழந்தை பராமரிப்பு",
      mental: "மனநலம் மற்றும் நலன்",
      medical: "மருத்துவ பராமரிப்பு மற்றும் பின்தொடர்வுகள்",
      warning: "அவசர எச்சரிக்கை அறிகுறிகள்",
    },
  },
};