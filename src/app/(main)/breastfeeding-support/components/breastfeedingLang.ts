import type { LanguageCode } from "@/components/common/useLanguage";

type BreastfeedingTranslation = {
  pageTitle: string;
  pageSubtitle: string;
  authenticationRequired: string;
  loginRequired: string;
  authError: string;
  userIdError: string;

  tabs: {
    sessions: string;
    issues: string;
    tips: string;
  };

  summary: {
    overviewTitle: string;
    todaySessions: string;
    totalDurationToday: string;
    milkExpressedToday: string;
    unresolvedIssues: string;
    sessionsUnit: string;
    minutesUnit: string;
    mlUnit: string;
    issuesUnit: string;
    totalSessionsLogged: string;
    allTimeRecords: string;
    todayProgress: (today: number, total: number) => string;
  };

  sessions: {
    title: string;
    logSession: string;
    noSessionsTitle: string;
    noSessionsDescription: string;
    failedDelete: string;
    notes: string;
    noNotes: string;
    durationMin: (value: number) => string;
    milkMl: (value: number) => string;
  };

  sessionForm: {
    editTitle: string;
    createTitle: string;
    feedingTime: string;
    feedingSide: string;
    duration: string;
    milkAmount: string;
    pumpingOptional: string;
    notes: string;
    optional: string;
    cancel: string;
    saving: string;
    updateSession: string;
    logSession: string;
    durationPlaceholder: string;
    milkPlaceholder: string;
    notesPlaceholder: string;
    validationFeedingTime: string;
    validationDuration: string;
    validationMilk: string;
    saveFailed: string;
  };

  issues: {
    title: string;
    unresolvedCount: (count: number) => string;
    reportIssue: string;
    failedDelete: string;
    failedUpdate: string;
    all: string;
    unresolved: string;
    resolved: string;
    noIssuesTitle: string;
    noUnresolvedTitle: string;
    noResolvedTitle: string;
    noIssuesDescription: string;
    midwifeNotes: string;
    reported: string;
    markResolvedTitle: string;
  };

  issueForm: {
    editTitle: string;
    createTitle: string;
    issueType: string;
    severity: string;
    description: string;
    descriptionPlaceholder: string;
    reportedAt: string;
    midwifeNotes: string;
    addedByMidwife: string;
    noMidwifeNotes: string;
    markResolved: string;
    markResolvedDescription: string;
    cancel: string;
    saving: string;
    updateIssue: string;
    reportIssue: string;
    validationDescription: string;
    validationReportedAt: string;
    saveFailed: string;
  };

  tips: {
    title: string;
    readOnly: string;
    all: string;
    noTipsTitle: string;
    noTipsDescription: string;
    added: string;
  };

  labels: {
    sides: Record<string, string>;
    issueTypes: Record<string, string>;
    severity: Record<string, string>;
    categories: Record<string, string>;
  };
};

export const breastfeedingTranslations: Record<LanguageCode, BreastfeedingTranslation> = {
  en: {
    pageTitle: "Breastfeeding Support",
    pageSubtitle: "Track sessions, report issues and read expert tips",
    authenticationRequired: "Authentication Required",
    loginRequired: "Please log in to access the Breastfeeding Support section.",
    authError: "Authentication error. Please log in again.",
    userIdError: "Could not resolve your user ID. Please log in again.",

    tabs: {
      sessions: "Sessions",
      issues: "Issues",
      tips: "Tips",
    },

    summary: {
      overviewTitle: "Today's Overview",
      todaySessions: "Today's Sessions",
      totalDurationToday: "Total Duration Today",
      milkExpressedToday: "Milk Expressed Today",
      unresolvedIssues: "Unresolved Issues",
      sessionsUnit: "sessions",
      minutesUnit: "minutes",
      mlUnit: "ml",
      issuesUnit: "issues",
      totalSessionsLogged: "Total Sessions Logged",
      allTimeRecords: "All time breastfeeding records",
      todayProgress: (today, total) => `${today} of ${total} sessions are from today`,
    },

    sessions: {
      title: "Feeding Sessions",
      logSession: "Log Session",
      noSessionsTitle: "No feeding sessions logged yet",
      noSessionsDescription: 'Tap "Log Session" to record your first breastfeeding session',
      failedDelete: "Failed to delete session. Please try again.",
      notes: "Notes",
      noNotes: "No notes added.",
      durationMin: (value) => `${value} min`,
      milkMl: (value) => `${value} ml`,
    },

    sessionForm: {
      editTitle: "Edit Session",
      createTitle: "Log Feeding Session",
      feedingTime: "Feeding Time",
      feedingSide: "Feeding Side",
      duration: "Duration (minutes)",
      milkAmount: "Milk Amount (ml)",
      pumpingOptional: "— optional, for pumping",
      notes: "Notes",
      optional: "— optional",
      cancel: "Cancel",
      saving: "Saving...",
      updateSession: "Update Session",
      logSession: "Log Session",
      durationPlaceholder: "e.g. 15",
      milkPlaceholder: "e.g. 120",
      notesPlaceholder: "e.g. Baby fed well, no discomfort...",
      validationFeedingTime: "Feeding time is required.",
      validationDuration: "Please enter a valid duration.",
      validationMilk: "Milk amount cannot be negative.",
      saveFailed: "Failed to save session. Please try again.",
    },

    issues: {
      title: "Issue Tracker",
      unresolvedCount: (count) => `${count} unresolved`,
      reportIssue: "Report Issue",
      failedDelete: "Failed to delete issue. Please try again.",
      failedUpdate: "Failed to update issue. Please try again.",
      all: "All",
      unresolved: "Unresolved",
      resolved: "Resolved",
      noIssuesTitle: "No issues reported yet",
      noUnresolvedTitle: "No unresolved issues 🎉",
      noResolvedTitle: "No resolved issues yet",
      noIssuesDescription: 'Tap "Report Issue" to log a breastfeeding concern',
      midwifeNotes: "Midwife Notes",
      reported: "Reported",
      markResolvedTitle: "Mark as resolved",
    },

    issueForm: {
      editTitle: "Edit Issue",
      createTitle: "Report Issue",
      issueType: "Issue Type",
      severity: "Severity",
      description: "Description",
      descriptionPlaceholder: "Describe your issue in detail...",
      reportedAt: "Reported At",
      midwifeNotes: "Midwife Notes",
      addedByMidwife: "— added by your midwife",
      noMidwifeNotes: "No midwife notes yet.",
      markResolved: "Mark as Resolved",
      markResolvedDescription: "Toggle if this issue has been resolved",
      cancel: "Cancel",
      saving: "Saving...",
      updateIssue: "Update Issue",
      reportIssue: "Report Issue",
      validationDescription: "Please describe the issue.",
      validationReportedAt: "Please select a reported date and time.",
      saveFailed: "Failed to save issue. Please try again.",
    },

    tips: {
      title: "Expert Tips",
      readOnly: "📖 Read Only",
      all: "🌟 All",
      noTipsTitle: "No tips available yet",
      noTipsDescription: "Tips added by your midwife will appear here",
      added: "Added",
    },

    labels: {
      sides: {
        LEFT: "⬅️ Left",
        RIGHT: "➡️ Right",
        BOTH: "↔️ Both",
      },
      issueTypes: {
        PAIN: "🔴 Pain",
        LATCH_PROBLEM: "🟠 Latch Problem",
        LOW_SUPPLY: "🟡 Low Supply",
        ENGORGEMENT: "🟣 Engorgement",
        MASTITIS: "⚫ Mastitis",
        OTHER: "🔵 Other",
      },
      severity: {
        MILD: "Mild",
        MODERATE: "Moderate",
        SEVERE: "Severe",
      },
      categories: {
        LATCH_TECHNIQUE: "👶 Latch Technique",
        MILK_SUPPLY: "🍼 Milk Supply",
        PAIN_RELIEF: "💊 Pain Relief",
        NUTRITION: "🥗 Nutrition",
        PUMPING: "🔵 Pumping",
        GENERAL: "💡 General",
      },
    },
  },

  si: {
    pageTitle: "මව්කිරි සහාය",
    pageSubtitle: "කිරිදීමේ සැසි සටහන් කරන්න, ගැටලු වාර්තා කරන්න සහ විශේෂඥ උපදෙස් කියවන්න",
    authenticationRequired: "පිවිසුම අවශ්‍යයි",
    loginRequired: "මව්කිරි සහාය කොටසට පිවිසීමට කරුණාකර ලොග් වන්න.",
    authError: "සත්‍යාපන දෝෂයක්. කරුණාකර නැවත ලොග් වන්න.",
    userIdError: "ඔබගේ පරිශීලක හැඳුනුම්පත සොයාගත නොහැක. කරුණාකර නැවත ලොග් වන්න.",

    tabs: {
      sessions: "සැසි",
      issues: "ගැටලු",
      tips: "උපදෙස්",
    },

    summary: {
      overviewTitle: "අද සාරාංශය",
      todaySessions: "අද සැසි",
      totalDurationToday: "අද මුළු කාලය",
      milkExpressedToday: "අද පොම්ප කළ කිරි",
      unresolvedIssues: "නොවිසඳුණු ගැටලු",
      sessionsUnit: "සැසි",
      minutesUnit: "මිනිත්තු",
      mlUnit: "මි.ලි.",
      issuesUnit: "ගැටලු",
      totalSessionsLogged: "සටහන් කළ මුළු සැසි",
      allTimeRecords: "සියලු මව්කිරි සටහන්",
      todayProgress: (today, total) => `සැසි ${total}න් ${today}ක් අද දිනයේය`,
    },

    sessions: {
      title: "කිරිදීමේ සැසි",
      logSession: "සැසිය සටහන් කරන්න",
      noSessionsTitle: "තවම කිරිදීමේ සැසි සටහන් කර නැත",
      noSessionsDescription: 'ඔබගේ පළමු කිරිදීමේ සැසිය සටහන් කිරීමට "සැසිය සටහන් කරන්න" තට්ටු කරන්න',
      failedDelete: "සැසිය මකා දැමීමට අසමත් විය. කරුණාකර නැවත උත්සාහ කරන්න.",
      notes: "සටහන්",
      noNotes: "සටහන් එකතු කර නැත.",
      durationMin: (value) => `${value} මිනි`,
      milkMl: (value) => `${value} මි.ලි.`,
    },

    sessionForm: {
      editTitle: "සැසිය සංස්කරණය කරන්න",
      createTitle: "කිරිදීමේ සැසිය සටහන් කරන්න",
      feedingTime: "කිරිදුන් වේලාව",
      feedingSide: "කිරිදුන් පැත්ත",
      duration: "කාලය (මිනිත්තු)",
      milkAmount: "කිරි ප්‍රමාණය (මි.ලි.)",
      pumpingOptional: "— විකල්පයි, පොම්ප කිරීම සඳහා",
      notes: "සටහන්",
      optional: "— විකල්පයි",
      cancel: "අවලංගු කරන්න",
      saving: "සුරකිමින්...",
      updateSession: "සැසිය යාවත්කාලීන කරන්න",
      logSession: "සැසිය සටහන් කරන්න",
      durationPlaceholder: "උදා. 15",
      milkPlaceholder: "උදා. 120",
      notesPlaceholder: "උදා. බබා හොඳින් කිරි බීවා, අපහසුතාවයක් නැත...",
      validationFeedingTime: "කිරිදුන් වේලාව අවශ්‍යයි.",
      validationDuration: "කරුණාකර වලංගු කාලයක් ඇතුළත් කරන්න.",
      validationMilk: "කිරි ප්‍රමාණය ඍණ අගයක් විය නොහැක.",
      saveFailed: "සැසිය සුරැකීමට අසමත් විය. කරුණාකර නැවත උත්සාහ කරන්න.",
    },

    issues: {
      title: "ගැටලු පසු විපරම",
      unresolvedCount: (count) => `නොවිසඳුණු ${count}`,
      reportIssue: "ගැටලුව වාර්තා කරන්න",
      failedDelete: "ගැටලුව මකා දැමීමට අසමත් විය. කරුණාකර නැවත උත්සාහ කරන්න.",
      failedUpdate: "ගැටලුව යාවත්කාලීන කිරීමට අසමත් විය. කරුණාකර නැවත උත්සාහ කරන්න.",
      all: "සියල්ල",
      unresolved: "නොවිසඳුණු",
      resolved: "විසඳුණු",
      noIssuesTitle: "තවම ගැටලු වාර්තා කර නැත",
      noUnresolvedTitle: "නොවිසඳුණු ගැටලු නැත 🎉",
      noResolvedTitle: "විසඳුණු ගැටලු තවම නැත",
      noIssuesDescription: 'මව්කිරි සම්බන්ධ ගැටලුවක් සටහන් කිරීමට "ගැටලුව වාර්තා කරන්න" තට්ටු කරන්න',
      midwifeNotes: "මවුසරණියගේ සටහන්",
      reported: "වාර්තා කළේ",
      markResolvedTitle: "විසඳුණු ලෙස සලකුණු කරන්න",
    },

    issueForm: {
      editTitle: "ගැටලුව සංස්කරණය කරන්න",
      createTitle: "ගැටලුව වාර්තා කරන්න",
      issueType: "ගැටලු වර්ගය",
      severity: "බරපතලත්වය",
      description: "විස්තරය",
      descriptionPlaceholder: "ඔබගේ ගැටලුව විස්තරාත්මකව ලියන්න...",
      reportedAt: "වාර්තා කළ වේලාව",
      midwifeNotes: "මවුසරණියගේ සටහන්",
      addedByMidwife: "— ඔබගේ මවුසරණිය එක් කළ සටහන්",
      noMidwifeNotes: "තවම මවුසරණියගේ සටහන් නැත.",
      markResolved: "විසඳුණු ලෙස සලකුණු කරන්න",
      markResolvedDescription: "මෙම ගැටලුව විසඳී ඇත්නම් මෙය සක්‍රිය කරන්න",
      cancel: "අවලංගු කරන්න",
      saving: "සුරකිමින්...",
      updateIssue: "ගැටලුව යාවත්කාලීන කරන්න",
      reportIssue: "ගැටලුව වාර්තා කරන්න",
      validationDescription: "කරුණාකර ගැටලුව විස්තර කරන්න.",
      validationReportedAt: "කරුණාකර වාර්තා කළ දිනය සහ වේලාව තෝරන්න.",
      saveFailed: "ගැටලුව සුරැකීමට අසමත් විය. කරුණාකර නැවත උත්සාහ කරන්න.",
    },

    tips: {
      title: "විශේෂඥ උපදෙස්",
      readOnly: "📖 කියවීමට පමණි",
      all: "🌟 සියල්ල",
      noTipsTitle: "තවම උපදෙස් නැත",
      noTipsDescription: "ඔබගේ මවුසරණිය එක් කරන උපදෙස් මෙහි පෙන්වනු ඇත",
      added: "එක් කළ දිනය",
    },

    labels: {
      sides: {
        LEFT: "⬅️ වම",
        RIGHT: "➡️ දකුණ",
        BOTH: "↔️ දෙපසම",
      },
      issueTypes: {
        PAIN: "🔴 වේදනාව",
        LATCH_PROBLEM: "🟠 අල්ලාගැනීමේ ගැටලුව",
        LOW_SUPPLY: "🟡 කිරි සැපයුම අඩුයි",
        ENGORGEMENT: "🟣 පියයුරු පිරී වේදනාකාරී වීම",
        MASTITIS: "⚫ මැස්ටයිටිස්",
        OTHER: "🔵 වෙනත්",
      },
      severity: {
        MILD: "සුළු",
        MODERATE: "මධ්‍යම",
        SEVERE: "බරපතල",
      },
      categories: {
        LATCH_TECHNIQUE: "👶 අල්ලාගැනීමේ තාක්ෂණය",
        MILK_SUPPLY: "🍼 කිරි සැපයුම",
        PAIN_RELIEF: "💊 වේදනා සහනය",
        NUTRITION: "🥗 පෝෂණය",
        PUMPING: "🔵 පොම්ප කිරීම",
        GENERAL: "💡 සාමාන්‍ය",
      },
    },
  },

  ta: {
    pageTitle: "தாய்ப்பால் ஆதரவு",
    pageSubtitle: "பாலூட்டும் அமர்வுகளை பதிவு செய்யவும், பிரச்சினைகளை தெரிவிக்கவும், நிபுணர் குறிப்புகளை படிக்கவும்",
    authenticationRequired: "உள்நுழைவு தேவை",
    loginRequired: "தாய்ப்பால் ஆதரவு பகுதியை அணுக தயவுசெய்து உள்நுழையவும்.",
    authError: "அங்கீகாரப் பிழை. தயவுசெய்து மீண்டும் உள்நுழையவும்.",
    userIdError: "உங்கள் பயனர் ID-ஐ கண்டறிய முடியவில்லை. தயவுசெய்து மீண்டும் உள்நுழையவும்.",

    tabs: {
      sessions: "அமர்வுகள்",
      issues: "பிரச்சினைகள்",
      tips: "குறிப்புகள்",
    },

    summary: {
      overviewTitle: "இன்றைய சுருக்கம்",
      todaySessions: "இன்றைய அமர்வுகள்",
      totalDurationToday: "இன்றைய மொத்த நேரம்",
      milkExpressedToday: "இன்று எடுத்த பால்",
      unresolvedIssues: "தீர்க்கப்படாத பிரச்சினைகள்",
      sessionsUnit: "அமர்வுகள்",
      minutesUnit: "நிமிடங்கள்",
      mlUnit: "மி.லி.",
      issuesUnit: "பிரச்சினைகள்",
      totalSessionsLogged: "பதிவு செய்யப்பட்ட மொத்த அமர்வுகள்",
      allTimeRecords: "அனைத்து தாய்ப்பால் பதிவுகள்",
      todayProgress: (today, total) => `${total} அமர்வுகளில் ${today} இன்று பதிவானவை`,
    },

    sessions: {
      title: "பாலூட்டும் அமர்வுகள்",
      logSession: "அமர்வை பதிவு செய்",
      noSessionsTitle: "இதுவரை பாலூட்டும் அமர்வுகள் பதிவு செய்யப்படவில்லை",
      noSessionsDescription: 'உங்கள் முதல் தாய்ப்பால் அமர்வை பதிவு செய்ய "அமர்வை பதிவு செய்" என்பதைத் தட்டவும்',
      failedDelete: "அமர்வை நீக்க முடியவில்லை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.",
      notes: "குறிப்புகள்",
      noNotes: "குறிப்புகள் சேர்க்கப்படவில்லை.",
      durationMin: (value) => `${value} நிமி`,
      milkMl: (value) => `${value} மி.லி.`,
    },

    sessionForm: {
      editTitle: "அமர்வை திருத்து",
      createTitle: "பாலூட்டும் அமர்வை பதிவு செய்",
      feedingTime: "பாலூட்டிய நேரம்",
      feedingSide: "பாலூட்டிய பக்கம்",
      duration: "நேரம் (நிமிடங்கள்)",
      milkAmount: "பால் அளவு (மி.லி.)",
      pumpingOptional: "— விருப்பம், பம்ப் செய்வதற்கு",
      notes: "குறிப்புகள்",
      optional: "— விருப்பம்",
      cancel: "ரத்து செய்",
      saving: "சேமிக்கிறது...",
      updateSession: "அமர்வை புதுப்பி",
      logSession: "அமர்வை பதிவு செய்",
      durationPlaceholder: "எ.கா. 15",
      milkPlaceholder: "எ.கா. 120",
      notesPlaceholder: "எ.கா. குழந்தை நன்றாக குடித்தது, அசௌகரியம் இல்லை...",
      validationFeedingTime: "பாலூட்டிய நேரம் தேவை.",
      validationDuration: "சரியான நேரத்தை உள்ளிடவும்.",
      validationMilk: "பால் அளவு எதிர்மறையாக இருக்க முடியாது.",
      saveFailed: "அமர்வை சேமிக்க முடியவில்லை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.",
    },

    issues: {
      title: "பிரச்சினை கண்காணிப்பு",
      unresolvedCount: (count) => `${count} தீர்க்கப்படாதவை`,
      reportIssue: "பிரச்சினையை தெரிவி",
      failedDelete: "பிரச்சினையை நீக்க முடியவில்லை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.",
      failedUpdate: "பிரச்சினையை புதுப்பிக்க முடியவில்லை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.",
      all: "அனைத்தும்",
      unresolved: "தீர்க்கப்படாதவை",
      resolved: "தீர்க்கப்பட்டவை",
      noIssuesTitle: "இதுவரை பிரச்சினைகள் தெரிவிக்கப்படவில்லை",
      noUnresolvedTitle: "தீர்க்கப்படாத பிரச்சினைகள் இல்லை 🎉",
      noResolvedTitle: "தீர்க்கப்பட்ட பிரச்சினைகள் இன்னும் இல்லை",
      noIssuesDescription: 'தாய்ப்பால் தொடர்பான கவலைகளை பதிவு செய்ய "பிரச்சினையை தெரிவி" என்பதைத் தட்டவும்',
      midwifeNotes: "மருத்துவச்சியின் குறிப்புகள்",
      reported: "தெரிவிக்கப்பட்டது",
      markResolvedTitle: "தீர்க்கப்பட்டது என குறி",
    },

    issueForm: {
      editTitle: "பிரச்சினையை திருத்து",
      createTitle: "பிரச்சினையை தெரிவி",
      issueType: "பிரச்சினை வகை",
      severity: "தீவிரம்",
      description: "விளக்கம்",
      descriptionPlaceholder: "உங்கள் பிரச்சினையை விரிவாக விளக்கவும்...",
      reportedAt: "தெரிவித்த நேரம்",
      midwifeNotes: "மருத்துவச்சியின் குறிப்புகள்",
      addedByMidwife: "— உங்கள் மருத்துவச்சி சேர்த்தது",
      noMidwifeNotes: "மருத்துவச்சி குறிப்புகள் இன்னும் இல்லை.",
      markResolved: "தீர்க்கப்பட்டது என குறி",
      markResolvedDescription: "இந்த பிரச்சினை தீர்க்கப்பட்டிருந்தால் மாற்றியை இயக்கவும்",
      cancel: "ரத்து செய்",
      saving: "சேமிக்கிறது...",
      updateIssue: "பிரச்சினையை புதுப்பி",
      reportIssue: "பிரச்சினையை தெரிவி",
      validationDescription: "பிரச்சினையை விளக்கவும்.",
      validationReportedAt: "தெரிவித்த தேதி மற்றும் நேரத்தைத் தேர்ந்தெடுக்கவும்.",
      saveFailed: "பிரச்சினையை சேமிக்க முடியவில்லை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.",
    },

    tips: {
      title: "நிபுணர் குறிப்புகள்",
      readOnly: "📖 படிக்க மட்டும்",
      all: "🌟 அனைத்தும்",
      noTipsTitle: "குறிப்புகள் இன்னும் இல்லை",
      noTipsDescription: "உங்கள் மருத்துவச்சி சேர்க்கும் குறிப்புகள் இங்கே தோன்றும்",
      added: "சேர்க்கப்பட்டது",
    },

    labels: {
      sides: {
        LEFT: "⬅️ இடது",
        RIGHT: "➡️ வலது",
        BOTH: "↔️ இரண்டும்",
      },
      issueTypes: {
        PAIN: "🔴 வலி",
        LATCH_PROBLEM: "🟠 பிடிப்பதில் பிரச்சினை",
        LOW_SUPPLY: "🟡 பால் சுரப்பு குறைவு",
        ENGORGEMENT: "🟣 மார்பக வீக்கம்",
        MASTITIS: "⚫ மாஸ்டைட்டிஸ்",
        OTHER: "🔵 பிற",
      },
      severity: {
        MILD: "லேசான",
        MODERATE: "மிதமான",
        SEVERE: "கடுமையான",
      },
      categories: {
        LATCH_TECHNIQUE: "👶 பிடிப்பு முறைகள்",
        MILK_SUPPLY: "🍼 பால் சுரப்பு",
        PAIN_RELIEF: "💊 வலி நிவாரணம்",
        NUTRITION: "🥗 ஊட்டச்சத்து",
        PUMPING: "🔵 பம்ப் செய்தல்",
        GENERAL: "💡 பொதுவான",
      },
    },
  },
};
