import type { LanguageCode } from "@/components/common/useLanguage";

export const healthRecordTranslations: Record<
  LanguageCode,
  {
    title: string;
    subtitle: string;
    totalCategories: string;
    totalRecords: string;
    lastUpdated: string;
    today: string;
    unauthorized: string;
    loadCategoriesError: string;
    loadRecordsError: string;
    loadRecordDetailsError: string;
    saveRecordError: string;
    deleteRecordError: string;
    updateRecordError: string;
    recordNotFound: string;
    error: string;
    records: string;
    latest: string;
    addRecord: string;
    add: string;
    noRecordsYet: string;
    noRecordsHelp: string;
    record: string;
    recordsPlural: string;
    file: string;
    files: string;
    filesAttached: string;
    noFiles: string;
    noFilesAttached: string;
    edit: string;
    delete: string;
    download: string;
    backToCategory: string;
    date: string;
    description: string;
    images: string;
    documents: string;
    failedToLoad: string;
    preview: string;
    healthRecordsBreadcrumb: string;

    form: {
      addNewRecord: string;
      editRecord: string;
      recordName: string;
      recordNamePlaceholder: string;
      recordNameRequired: string;
      date: string;
      dateRequired: string;
      description: string;
      descriptionOptional: string;
      descriptionPlaceholder: string;
      attachFiles: string;
      attachFilesHelp: string;
      clickOrDrag: string;
      supports: string;
      cancel: string;
      saveChanges: string;
      addRecord: string;
    };

    deleteModal: {
      delete: string;
      confirmPrefix: string;
      confirmSuffix: string;
      cannotBeUndone: string;
      cancel: string;
    };

    categories: Record<string, string>;
  }
> = {
  en: {
    title: "Health Records",
    subtitle: "View and manage your health records by category",
    totalCategories: "Total Categories",
    totalRecords: "Total Records",
    lastUpdated: "Last Updated",
    today: "Today",
    unauthorized: "Unauthorized. Please login.",
    loadCategoriesError: "Failed to load health record categories.",
    loadRecordsError: "Failed to load health records.",
    loadRecordDetailsError: "Failed to load record details.",
    saveRecordError: "Failed to save record. Please try again.",
    deleteRecordError: "Failed to delete record.",
    updateRecordError: "Failed to update record. Please try again.",
    recordNotFound: "Record not found",
    error: "Error",
    records: "Records",
    latest: "Latest",
    addRecord: "Add Record",
    add: "Add",
    noRecordsYet: "No records yet",
    noRecordsHelp: 'Click "Add Record" to add your first record.',
    record: "record",
    recordsPlural: "records",
    file: "file",
    files: "files",
    filesAttached: "attached",
    noFiles: "No files",
    noFilesAttached: "No files attached",
    edit: "Edit",
    delete: "Delete",
    download: "Download",
    backToCategory: "Back to",
    date: "Date",
    description: "Description",
    images: "Images",
    documents: "Documents",
    failedToLoad: "Failed to load",
    preview: "Preview",
    healthRecordsBreadcrumb: "Health Records",

    form: {
      addNewRecord: "Add New Record",
      editRecord: "Edit Record",
      recordName: "Record Name",
      recordNamePlaceholder: "e.g. Annual Blood Panel",
      recordNameRequired: "Record name is required.",
      date: "Date",
      dateRequired: "Date is required.",
      description: "Description",
      descriptionOptional: "optional",
      descriptionPlaceholder: "Add notes or details about this record...",
      attachFiles: "Attach Files",
      attachFilesHelp: "images, PDFs — multiple allowed",
      clickOrDrag: "Click or drag & drop files here",
      supports: "Supports: JPG, PNG, WEBP, GIF, PDF",
      cancel: "Cancel",
      saveChanges: "Save Changes",
      addRecord: "Add Record",
    },

    deleteModal: {
      delete: "Delete",
      confirmPrefix: "Are you sure you want to delete",
      confirmSuffix: "?",
      cannotBeUndone: "This action cannot be undone.",
      cancel: "Cancel",
    },

    categories: {
      "medical-checkups": "Medical Checkups",
      "lab-test-results": "Lab Test Results",
      "ultrasound-scans": "Ultrasound & Scans",
      "medications-supplements": "Medications & Supplements",
      vaccinations: "Vaccinations",
      "personal-health-notes": "Personal Health Notes",
      others: "Others",
    },
  },

  si: {
    title: "සෞඛ්‍ය වාර්තා",
    subtitle: "ඔබේ සෞඛ්‍ය වාර්තා වර්ග අනුව බලන්න සහ කළමනාකරණය කරන්න",
    totalCategories: "මුළු වර්ග",
    totalRecords: "මුළු වාර්තා",
    lastUpdated: "අවසන් යාවත්කාලීන කිරීම",
    today: "අද",
    unauthorized: "අවසර නැත. කරුණාකර පුරනය වන්න.",
    loadCategoriesError: "සෞඛ්‍ය වාර්තා වර්ග පූරණය කළ නොහැකි විය.",
    loadRecordsError: "සෞඛ්‍ය වාර්තා පූරණය කළ නොහැකි විය.",
    loadRecordDetailsError: "වාර්තා විස්තර පූරණය කළ නොහැකි විය.",
    saveRecordError: "වාර්තාව සුරැකීමට නොහැකි විය. නැවත උත්සාහ කරන්න.",
    deleteRecordError: "වාර්තාව මකා දැමීමට නොහැකි විය.",
    updateRecordError: "වාර්තාව යාවත්කාලීන කිරීමට නොහැකි විය. නැවත උත්සාහ කරන්න.",
    recordNotFound: "වාර්තාව සොයාගත නොහැක",
    error: "දෝෂය",
    records: "වාර්තා",
    latest: "නවතම",
    addRecord: "වාර්තාවක් එක් කරන්න",
    add: "එක් කරන්න",
    noRecordsYet: "තවම වාර්තා නැත",
    noRecordsHelp: '"වාර්තාවක් එක් කරන්න" ක්ලික් කර ඔබේ පළමු වාර්තාව එක් කරන්න.',
    record: "වාර්තාව",
    recordsPlural: "වාර්තා",
    file: "ගොනුව",
    files: "ගොනු",
    filesAttached: "අමුණා ඇත",
    noFiles: "ගොනු නැත",
    noFilesAttached: "අමුණා ඇති ගොනු නැත",
    edit: "සංස්කරණය",
    delete: "මකන්න",
    download: "බාගන්න",
    backToCategory: "ආපසු",
    date: "දිනය",
    description: "විස්තරය",
    images: "පින්තූර",
    documents: "ලේඛන",
    failedToLoad: "පූරණය අසාර්ථකයි",
    preview: "පෙරදසුන",
    healthRecordsBreadcrumb: "සෞඛ්‍ය වාර්තා",

    form: {
      addNewRecord: "නව වාර්තාවක් එක් කරන්න",
      editRecord: "වාර්තාව සංස්කරණය කරන්න",
      recordName: "වාර්තා නම",
      recordNamePlaceholder: "උදා. වාර්ෂික රුධිර පරීක්ෂණය",
      recordNameRequired: "වාර්තා නම අවශ්‍යයි.",
      date: "දිනය",
      dateRequired: "දිනය අවශ්‍යයි.",
      description: "විස්තරය",
      descriptionOptional: "විකල්ප",
      descriptionPlaceholder: "මෙම වාර්තාව පිළිබඳ සටහන් හෝ විස්තර එක් කරන්න...",
      attachFiles: "ගොනු අමුණන්න",
      attachFilesHelp: "පින්තූර, PDF — එකකට වඩා අවසර ඇත",
      clickOrDrag: "ගොනු මෙතැනට ක්ලික් කරන්න හෝ ඇද දමන්න",
      supports: "සහාය දක්වයි: JPG, PNG, WEBP, GIF, PDF",
      cancel: "අවලංගු කරන්න",
      saveChanges: "වෙනස්කම් සුරකින්න",
      addRecord: "වාර්තාව එක් කරන්න",
    },

    deleteModal: {
      delete: "මකන්න",
      confirmPrefix: "ඔබට මකා දැමීමට අවශ්‍ය බව විශ්වාසද",
      confirmSuffix: "?",
      cannotBeUndone: "මෙම ක්‍රියාව ආපසු හැරවිය නොහැක.",
      cancel: "අවලංගු කරන්න",
    },

    categories: {
      "medical-checkups": "වෛද්‍ය පරීක්ෂණ",
      "lab-test-results": "රසායනාගාර පරීක්ෂණ ප්‍රතිඵල",
      "ultrasound-scans": "අල්ට්‍රාසවුන්ඩ් සහ ස්කෑන්",
      "medications-supplements": "ඖෂධ සහ පෝෂණ අතිරේක",
      vaccinations: "එන්නත්",
      "personal-health-notes": "පුද්ගලික සෞඛ්‍ය සටහන්",
      others: "වෙනත්",
    },
  },

  ta: {
    title: "சுகாதார பதிவுகள்",
    subtitle: "உங்கள் சுகாதார பதிவுகளை வகைப்படி பார்க்கவும் நிர்வகிக்கவும்",
    totalCategories: "மொத்த வகைகள்",
    totalRecords: "மொத்த பதிவுகள்",
    lastUpdated: "கடைசியாக புதுப்பிக்கப்பட்டது",
    today: "இன்று",
    unauthorized: "அங்கீகாரம் இல்லை. தயவுசெய்து உள்நுழையவும்.",
    loadCategoriesError: "சுகாதார பதிவு வகைகளை ஏற்ற முடியவில்லை.",
    loadRecordsError: "சுகாதார பதிவுகளை ஏற்ற முடியவில்லை.",
    loadRecordDetailsError: "பதிவு விவரங்களை ஏற்ற முடியவில்லை.",
    saveRecordError: "பதிவை சேமிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
    deleteRecordError: "பதிவை நீக்க முடியவில்லை.",
    updateRecordError: "பதிவை புதுப்பிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
    recordNotFound: "பதிவு கிடைக்கவில்லை",
    error: "பிழை",
    records: "பதிவுகள்",
    latest: "சமீபத்தியது",
    addRecord: "பதிவு சேர்க்கவும்",
    add: "சேர்",
    noRecordsYet: "இன்னும் பதிவுகள் இல்லை",
    noRecordsHelp: 'உங்கள் முதல் பதிவை சேர்க்க "பதிவு சேர்க்கவும்" என்பதைக் கிளிக் செய்யவும்.',
    record: "பதிவு",
    recordsPlural: "பதிவுகள்",
    file: "கோப்பு",
    files: "கோப்புகள்",
    filesAttached: "இணைக்கப்பட்டது",
    noFiles: "கோப்புகள் இல்லை",
    noFilesAttached: "இணைக்கப்பட்ட கோப்புகள் இல்லை",
    edit: "திருத்து",
    delete: "நீக்கு",
    download: "பதிவிறக்கு",
    backToCategory: "திரும்ப",
    date: "தேதி",
    description: "விளக்கம்",
    images: "படங்கள்",
    documents: "ஆவணங்கள்",
    failedToLoad: "ஏற்ற முடியவில்லை",
    preview: "முன்னோட்டம்",
    healthRecordsBreadcrumb: "சுகாதார பதிவுகள்",

    form: {
      addNewRecord: "புதிய பதிவு சேர்க்கவும்",
      editRecord: "பதிவை திருத்தவும்",
      recordName: "பதிவு பெயர்",
      recordNamePlaceholder: "உதா. வருடாந்திர இரத்த பரிசோதனை",
      recordNameRequired: "பதிவு பெயர் தேவை.",
      date: "தேதி",
      dateRequired: "தேதி தேவை.",
      description: "விளக்கம்",
      descriptionOptional: "விருப்பத்தேர்வு",
      descriptionPlaceholder: "இந்த பதிவைப் பற்றிய குறிப்புகள் அல்லது விவரங்களைச் சேர்க்கவும்...",
      attachFiles: "கோப்புகளை இணைக்கவும்",
      attachFilesHelp: "படங்கள், PDF — பல கோப்புகள் அனுமதிக்கப்படும்",
      clickOrDrag: "கோப்புகளை இங்கே கிளிக் செய்யவும் அல்லது இழுத்து விடவும்",
      supports: "ஆதரவு: JPG, PNG, WEBP, GIF, PDF",
      cancel: "ரத்து செய்",
      saveChanges: "மாற்றங்களை சேமி",
      addRecord: "பதிவு சேர்க்கவும்",
    },

    deleteModal: {
      delete: "நீக்கு",
      confirmPrefix: "நீங்கள் நிச்சயமாக நீக்க விரும்புகிறீர்களா",
      confirmSuffix: "?",
      cannotBeUndone: "இந்த செயலை மீண்டும் மாற்ற முடியாது.",
      cancel: "ரத்து செய்",
    },

    categories: {
      "medical-checkups": "மருத்துவ பரிசோதனைகள்",
      "lab-test-results": "ஆய்வக பரிசோதனை முடிவுகள்",
      "ultrasound-scans": "அல்ட்ராசவுண்ட் மற்றும் ஸ்கேன்",
      "medications-supplements": "மருந்துகள் மற்றும் கூடுதல் ஊட்டச்சத்துகள்",
      vaccinations: "தடுப்பூசிகள்",
      "personal-health-notes": "தனிப்பட்ட சுகாதார குறிப்புகள்",
      others: "மற்றவை",
    },
  },
};