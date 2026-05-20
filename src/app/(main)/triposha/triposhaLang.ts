import type { LanguageCode } from "@/components/common/useLanguage";

type TriposhaTranslation = {
  popupTitle: string;
  popupDescription: string;
  loadingRecords: string;
  authRequired: string;
  loadFailed: string;

  trackingTitle: string;
  add: string;
  noRecords: string;
  next: string;
  packs: string;

  editTriposha: string;
  addTriposha: string;
  closePopup: string;
  closeForm: string;
  editRecord: string;
  deleteRecord: string;

  status: {
    GIVEN: string;
    PENDING: string;
    MISSED: string;
  };
};

export const triposhaTranslations: Record<LanguageCode, TriposhaTranslation> = {
  en: {
    popupTitle: "My Triposha Records",
    popupDescription: "Track your nutrition support and upcoming allocations",
    loadingRecords: "Loading Triposha records...",
    authRequired: "You are not authenticated. Please sign in again.",
    loadFailed: "Failed to load Triposha records.",

    trackingTitle: "Triposha Tracking",
    add: "+ Add",
    noRecords: "No Triposha records available.",
    next: "Next",
    packs: "packs",

    editTriposha: "Edit Triposha",
    addTriposha: "Add Triposha",
    closePopup: "Close Triposha popup",
    closeForm: "Close Triposha form",
    editRecord: "Edit Triposha record",
    deleteRecord: "Delete Triposha record",

    status: {
      GIVEN: "Given",
      PENDING: "Pending",
      MISSED: "Missed",
    },
  },

  si: {
    popupTitle: "මගේ ත්‍රිපෝෂ රිපෝට්ස්",
    popupDescription: "ඔබගේ පෝෂණ සහාය සහ ඉදිරි බෙදාහැරීම් නිරීක්ෂණය කරන්න",
    loadingRecords: "ත්‍රිපෝෂ රිපෝට්ස් පූරණය වෙමින් පවතී...",
    authRequired: "ඔබ සත්‍යාපනය වී නොමැත. කරුණාකර නැවත පුරනය වන්න.",
    loadFailed: "ත්‍රිපෝෂ රිපෝට්ස් පූරණය කිරීමට අසමත් විය.",

    trackingTitle: "ත්‍රිපෝෂ නිරීක්ෂණය",
    add: "+ එක් කරන්න",
    noRecords: "ත්‍රිපෝෂ රිපෝට්ස් නොමැත.",
    next: "ඊළඟ",
    packs: "පැකට්",

    editTriposha: "ත්‍රිපෝෂ සංස්කරණය කරන්න",
    addTriposha: "ත්‍රිපෝෂ එක් කරන්න",
    closePopup: "ත්‍රිපෝෂ කවුළුව වසන්න",
    closeForm: "ත්‍රිපෝෂ පෝරමය වසන්න",
    editRecord: "ත්‍රිපෝෂ රිපෝට්ස් සංස්කරණය කරන්න",
    deleteRecord: "ත්‍රිපෝෂ රිපෝට්ස් මකන්න",

    status: {
      GIVEN: "ලබා දී ඇත",
      PENDING: "පොරොත්තුවෙන්",
      MISSED: "මඟහැරී ඇත",
    },
  },

  ta: {
    popupTitle: "என் திரிபோஷா பதிவுகள்",
    popupDescription: "உங்கள் ஊட்டச்சத்து ஆதரவு மற்றும் வரவிருக்கும் ஒதுக்கீடுகளை கண்காணிக்கவும்",
    loadingRecords: "திரிபோஷா பதிவுகள் ஏற்றப்படுகின்றன...",
    authRequired: "நீங்கள் அங்கீகரிக்கப்படவில்லை. மீண்டும் உள்நுழையவும்.",
    loadFailed: "திரிபோஷா பதிவுகளை ஏற்ற முடியவில்லை.",

    trackingTitle: "திரிபோஷா கண்காணிப்பு",
    add: "+ சேர்க்க",
    noRecords: "திரிபோஷா பதிவுகள் இல்லை.",
    next: "அடுத்து",
    packs: "பொட்டலங்கள்",

    editTriposha: "திரிபோஷாவை திருத்தவும்",
    addTriposha: "திரிபோஷாவை சேர்க்கவும்",
    closePopup: "திரிபோஷா சாளரத்தை மூடவும்",
    closeForm: "திரிபோஷா படிவத்தை மூடவும்",
    editRecord: "திரிபோஷா பதிவை திருத்தவும்",
    deleteRecord: "திரிபோஷா பதிவை நீக்கவும்",

    status: {
      GIVEN: "வழங்கப்பட்டது",
      PENDING: "நிலுவையில்",
      MISSED: "தவறியது",
    },
  },
};