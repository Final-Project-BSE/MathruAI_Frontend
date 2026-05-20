import type { LanguageCode } from "@/components/common/useLanguage";

export type BirthControlMethodTranslation = {
  title: string;
  description: string;
};

export type BirthControlTranslations = {
  pageTitle: string;
  pageSubtitle: string;
  notFound: string;
  methods: Record<string, BirthControlMethodTranslation>;
};

export const birthControlTranslations: Record<
  LanguageCode,
  BirthControlTranslations
> = {
  en: {
    pageTitle: "Birth Control Methods",
    pageSubtitle:
      "Learn about different methods to plan your family with confidence",
    notFound: "Not found",
    methods: {
      pill: {
        title: "The Oral Contraceptive Pill",
        description:
          "The oral contraceptive pill, often called the Pill, must be taken daily. It is easy to use and safe to self-manage. It can be purchased at a pharmacy. The Pill is highly effective and may reduce painful or heavy periods, but you need to remember to take it on time.",
      },
      condom: {
        title: "Condoms",
        description:
          "Condoms are a widely used contraceptive method that help prevent pregnancy and protect against HIV and other sexually transmitted infections. They work by covering the penis during sex and stopping sperm from entering the vagina. Using condoms every time during oral, anal, or vaginal sex reduces infection risk by preventing contact with bodily fluids.",
      },
      implant: {
        title: "Implant",
        description:
          "The contraceptive implant is a highly effective long-term birth control method placed under the skin. It can protect against pregnancy for up to 5 years. It releases hormones that stop ovulation and thicken cervical mucus to block sperm. It can be removed at any time, and fertility usually returns quickly after removal. It does not protect against STIs, so condoms are recommended.",
      },
      iud: {
        title: "IUD",
        description:
          "An IUD, or intrauterine device, is a small flexible device placed in the uterus to prevent pregnancy. It is a long-term method that can work for up to 10 years and is over 99% effective. It prevents pregnancy by affecting sperm movement so sperm cannot reach an egg. Fertility usually returns quickly after removal. It can also be used as emergency contraception within 5 days of unprotected sex.",
      },
      injection: {
        title: "Contraceptive Injection",
        description:
          "Depo-Provera, also called the Depo shot, is a contraceptive injection given every 3 months. It contains progestin, which prevents pregnancy by stopping ovulation and thickening cervical mucus to block sperm. It is safe and effective when taken on time. If it is not started within the first 7 days of your period, extra protection such as condoms is needed for the first week.",
      },
      EmergencyPill: {
        title: "Emergency Contraceptive Pill",
        description:
          "Emergency contraception is used to prevent pregnancy after unprotected vaginal sex or when a regular contraceptive method fails, such as a broken condom or missed pills. It should not be used as a regular birth control method and does not protect against HIV or other STIs. The emergency contraceptive pill can be taken within 72 hours of unprotected sex and works best the sooner it is taken.",
      },
      ring: {
        title: "Vaginal Ring",
        description:
          "The vaginal ring is a hormonal birth control method placed inside the vagina. It releases estrogen and progestin to stop ovulation and block sperm. It is worn for 3 weeks, then removed for 1 week before using a new one. It is effective and convenient, but it does not protect against STIs, so condoms are recommended.",
      },
      diaphragm: {
        title: "Diaphragm",
        description:
          "A diaphragm is a small flexible silicone cup placed inside the vagina to cover the cervix. It works as a barrier method by stopping sperm from reaching the egg. It is usually used with spermicide to increase effectiveness. The diaphragm must be inserted before sex and left in place for several hours after sex. It does not protect against HIV or other STIs.",
      },
      sterilization: {
        title: "Sterilization",
        description:
          "Sterilization is a permanent method used to prevent pregnancy. In women, it involves blocking or cutting the fallopian tubes so the egg cannot meet sperm. In men, it is called a vasectomy, where the tubes that carry sperm are cut or sealed. Sterilization is very effective but usually cannot be reversed, so it is suitable only for people who are sure they do not want children in the future. It does not protect against HIV or other STIs.",
      },
    },
  },

  si: {
    pageTitle: "ගර්භනිරෝධන ක්‍රම",
    pageSubtitle:
      "විශ්වාසයෙන් පවුල් සැලසුම් කිරීමට විවිධ ගර්භනිරෝධන ක්‍රම ගැන ඉගෙන ගන්න",
    notFound: "සොයාගත නොහැක",
    methods: {
      pill: {
        title: "මුඛ ගර්භනිරෝධන පෙති",
        description:
          "මුඛ ගර්භනිරෝධන පෙති, සාමාන්‍යයෙන් Pill ලෙස හැඳින්වේ, දිනපතා ගත යුතුය. එය භාවිතා කිරීමට පහසු අතර ඔබටම කළමනාකරණය කළ හැකි ආරක්ෂිත ක්‍රමයකි. එය ඖෂධසැලකින් මිලදී ගත හැකිය. මෙම පෙති ඉතා කාර්යක්ෂම වන අතර වේදනාකාරී හෝ අධික මාසික රුධිර වහනය අඩු කිරීමටද උපකාරී විය හැක. නමුත් එය නියමිත වේලාවට ගන්නා බව මතක තබා ගත යුතුය.",
      },
      condom: {
        title: "කොන්ඩම්",
        description:
          "කොන්ඩම් යනු ගර්භධාරණය වැළැක්වීමට සහ HIV ඇතුළු ලිංගිකව සම්ප්‍රේෂණය වන ආසාදනවලින් ආරක්ෂාව ලබාදීමට උපකාරී වන බහුලව භාවිතා වන ගර්භනිරෝධන ක්‍රමයකි. ලිංගික සම්බන්ධතාවයේදී ලිංගය ආවරණය කර ශුක්‍රාණු යෝනියට ඇතුළු වීම වැළැක්වීමෙන් එය ක්‍රියා කරයි. මුඛ, ගුද, හෝ යෝනි ලිංගික සම්බන්ධතාවයේදී සෑම විටම කොන්ඩම් භාවිතා කිරීම දේහ ද්‍රව සමඟ සම්බන්ධ වීම අඩු කර ආසාදන අවදානම අඩු කරයි.",
      },
      implant: {
        title: "ඉම්ප්ලාන්ට්",
        description:
          "ගර්භනිරෝධන ඉම්ප්ලාන්ට් යනු සම යට තබන දිගුකාලීන සහ ඉතා කාර්යක්ෂම ගර්භනිරෝධන ක්‍රමයකි. එය වසර 5ක් දක්වා ගර්භධාරණයෙන් ආරක්ෂාව ලබාදිය හැක. එය හෝමෝන නිකුත් කර ඩිම්බ නිකුත් වීම නවත්වන අතර, ශුක්‍රාණු අවහිර කිරීමට ගැබ්ගෙල මියුකස් ඝන කරයි. ඕනෑම වේලාවක ඉවත් කළ හැකි අතර, ඉවත් කිරීමෙන් පසු සාමාන්‍යයෙන් සරුභාවය ඉක්මනින් නැවත පැමිණේ. මෙය STIs වලින් ආරක්ෂාව ලබා නොදෙන නිසා කොන්ඩම් භාවිතය නිර්දේශ කෙරේ.",
      },
      iud: {
        title: "IUD",
        description:
          "IUD, හෙවත් ගර්භාශය තුළ තබන උපකරණය, ගර්භධාරණය වැළැක්වීමට ගර්භාශය තුළ තබන කුඩා නමනසුළු උපකරණයකි. එය වසර 10ක් දක්වා ක්‍රියා කළ හැකි දිගුකාලීන ක්‍රමයක් වන අතර 99%කට වැඩි කාර්යක්ෂමතාවක් ඇත. ශුක්‍රාණු බිජයකට ළඟා වීම වැළැක්වීමට ශුක්‍රාණු චලනයට බලපාමින් එය ක්‍රියා කරයි. ඉවත් කිරීමෙන් පසු සාමාන්‍යයෙන් සරුභාවය ඉක්මනින් නැවත පැමිණේ. ආරක්ෂාවකින් තොර ලිංගික සම්බන්ධතාවයකින් දින 5ක් ඇතුළත හදිසි ගර්භනිරෝධනයක් ලෙසද භාවිතා කළ හැක.",
      },
      injection: {
        title: "ගර්භනිරෝධන එන්නත",
        description:
          "Depo-Provera, හෝ Depo shot ලෙස හැඳින්වෙන ගර්භනිරෝධන එන්නත, මාස 3කට වරක් ලබාදෙයි. එහි progestin අඩංගු වන අතර, එය ඩිම්බ නිකුත් වීම නවත්වමින් සහ ශුක්‍රාණු අවහිර කිරීමට ගැබ්ගෙල මියුකස් ඝන කරමින් ගර්භධාරණය වැළැක්වීමට උපකාරී වේ. නියමිත වේලාවට ලබාගත් විට එය ආරක්ෂිත සහ කාර්යක්ෂම ක්‍රමයකි. මාසික රුධිර වහනය ආරම්භ වූ පළමු දින 7 ඇතුළත ආරම්භ නොකළහොත්, පළමු සතිය සඳහා කොන්ඩම් වැනි අමතර ආරක්ෂාවක් අවශ්‍ය වේ.",
      },
      EmergencyPill: {
        title: "හදිසි ගර්භනිරෝධන පෙති",
        description:
          "හදිසි ගර්භනිරෝධනය භාවිතා කරන්නේ ආරක්ෂාවකින් තොර යෝනි ලිංගික සම්බන්ධතාවයකින් පසු හෝ සාමාන්‍ය ගර්භනිරෝධන ක්‍රමයක් අසාර්ථක වූ විටය, උදාහරණයක් ලෙස කොන්ඩම් කැඩීම හෝ පෙති මඟහැරීම. එය සාමාන්‍ය ගර්භනිරෝධන ක්‍රමයක් ලෙස භාවිතා නොකළ යුතු අතර HIV හෝ වෙනත් STIs වලින් ආරක්ෂාව ලබා නොදේ. හදිසි ගර්භනිරෝධන පෙති ආරක්ෂාවකින් තොර ලිංගික සම්බන්ධතාවයකින් පැය 72ක් ඇතුළත ගත හැකි අතර ඉක්මනින් ගන්නා තරමට වඩා හොඳින් ක්‍රියා කරයි.",
      },
      ring: {
        title: "යෝනි වළල්ල",
        description:
          "යෝනි වළල්ල යනු යෝනිය තුළ තබන හෝමෝන ගර්භනිරෝධන ක්‍රමයකි. එය estrogen සහ progestin නිකුත් කර ඩිම්බ නිකුත් වීම නවත්වමින් සහ ශුක්‍රාණු අවහිර කරමින් ක්‍රියා කරයි. එය සති 3ක් පැළඳ සිටි පසු සතියක් ඉවත් කර නව වළල්ලක් භාවිතා කරයි. එය කාර්යක්ෂම සහ පහසු ක්‍රමයක් නමුත් STIs වලින් ආරක්ෂාව ලබා නොදෙන නිසා කොන්ඩම් නිර්දේශ කෙරේ.",
      },
      diaphragm: {
        title: "ඩයෆ්‍රැම්",
        description:
          "ඩයෆ්‍රැම් යනු යෝනිය තුළ තබා ගැබ්ගෙල ආවරණය කරන සිලිකෝන් වලින් සාදන ලද කුඩා නමනසුළු කෝප්පයකි. එය ශුක්‍රාණු බිජයට ළඟා වීම වැළැක්වීමෙන් බාධක ක්‍රමයක් ලෙස ක්‍රියා කරයි. කාර්යක්ෂමතාව වැඩි කිරීමට සාමාන්‍යයෙන් spermicide සමඟ භාවිතා කරයි. ලිංගික සම්බන්ධතාවයට පෙර ඇතුළු කළ යුතු අතර, සම්බන්ධතාවයෙන් පසු පැය කිහිපයක් තබා ගත යුතුය. මෙය HIV හෝ වෙනත් STIs වලින් ආරක්ෂාව ලබා නොදේ.",
      },
      sterilization: {
        title: "ස්ථිර ගර්භනිරෝධනය",
        description:
          "ස්ථිර ගර්භනිරෝධනය යනු ගර්භධාරණය වැළැක්වීමට භාවිතා කරන ස්ථිර ක්‍රමයකි. කාන්තාවන්ගේදී, බිජය ශුක්‍රාණු සමඟ හමුවීම වැළැක්වීමට fallopian tubes අවහිර කිරීම හෝ කපා දැමීම සිදු කරයි. පිරිමින්ගේදී, එය vasectomy ලෙස හැඳින්වෙන අතර ශුක්‍රාණු රැගෙන යන නාල කපා හෝ මුද්‍රා තබයි. එය ඉතා කාර්යක්ෂම නමුත් සාමාන්‍යයෙන් නැවත හැරවිය නොහැකි නිසා අනාගතයේ දරුවන් අවශ්‍ය නොවන බවට නියත පුද්ගලයන්ට පමණක් සුදුසුය. මෙය HIV හෝ වෙනත් STIs වලින් ආරක්ෂාව ලබා නොදේ.",
      },
    },
  },

  ta: {
    pageTitle: "கர்ப்பத் தடுப்பு முறைகள்",
    pageSubtitle:
      "நம்பிக்கையுடன் குடும்பத்தை திட்டமிட பல்வேறு கர்ப்பத் தடுப்பு முறைகள் பற்றி அறிக",
    notFound: "கிடைக்கவில்லை",
    methods: {
      pill: {
        title: "வாய்வழி கர்ப்பத் தடுப்பு மாத்திரை",
        description:
          "வாய்வழி கர்ப்பத் தடுப்பு மாத்திரை, பொதுவாக Pill என அழைக்கப்படுகிறது, தினமும் எடுத்துக்கொள்ள வேண்டும். இது பயன்படுத்த எளிதானதும், நீங்களே நிர்வகிக்கக்கூடிய பாதுகாப்பான முறையுமாகும். இதை மருந்தகத்தில் வாங்கலாம். இந்த மாத்திரை மிகவும் பயனுள்ளதாக இருக்கிறது. மேலும் வலியுடன் கூடிய அல்லது அதிகமான மாதவிடாயை குறைக்கவும் உதவலாம். ஆனால் அதை சரியான நேரத்தில் எடுத்துக்கொள்ள நினைவில் வைத்திருக்க வேண்டும்.",
      },
      condom: {
        title: "கொண்டோம்",
        description:
          "கொண்டோம் என்பது கர்ப்பத்தைத் தடுப்பதற்கும் HIV மற்றும் பிற பாலியல் மூலம் பரவும் தொற்றுகளிலிருந்து பாதுகாப்பதற்கும் உதவும் பரவலாகப் பயன்படுத்தப்படும் கர்ப்பத் தடுப்பு முறை. இது உடலுறவின்போது ஆணுறுப்பை மூடி, விந்தணுக்கள் யோனிக்குள் செல்லாமல் தடுக்கிறது. வாய்வழி, குடல், அல்லது யோனி உடலுறவின்போது ஒவ்வொரு முறையும் கொண்டோம் பயன்படுத்துவது உடல் திரவங்களுடன் தொடர்பு ஏற்படுவதைத் தடுத்து தொற்று அபாயத்தை குறைக்கிறது.",
      },
      implant: {
        title: "இம்ப்ளாண்ட்",
        description:
          "கர்ப்பத் தடுப்பு இம்ப்ளாண்ட் என்பது தோலுக்குக் கீழ் வைக்கப்படும், நீண்டகாலம் செயல்படும் மிகவும் பயனுள்ள கர்ப்பத் தடுப்பு முறை. இது 5 ஆண்டுகள் வரை கர்ப்பத்திலிருந்து பாதுகாப்பளிக்க முடியும். இது ஹார்மோன்களை வெளியிட்டு முட்டை வெளியாவதைத் தடுக்கிறது மற்றும் விந்தணுக்களைத் தடுக்க கருப்பைக்கழுத்து சளியை அடர்த்தியாக்குகிறது. இதை எப்போது வேண்டுமானாலும் அகற்றலாம். அகற்றிய பிறகு பொதுவாக கருவுறும் திறன் விரைவில் திரும்பும். இது STIs-இலிருந்து பாதுகாப்பளிக்காது, எனவே கொண்டோம் பயன்படுத்துவது பரிந்துரைக்கப்படுகிறது.",
      },
      iud: {
        title: "IUD",
        description:
          "IUD, அல்லது intrauterine device, கர்ப்பத்தைத் தடுப்பதற்காக கருப்பைக்குள் வைக்கப்படும் சிறிய நெகிழ்வான சாதனம். இது 10 ஆண்டுகள் வரை செயல்படக்கூடிய நீண்டகால முறை மற்றும் 99%க்கும் மேல் பயனுள்ளதாகும். விந்தணுக்கள் முட்டையை அடைய முடியாதபடி அவற்றின் இயக்கத்தை பாதித்து கர்ப்பத்தைத் தடுக்கிறது. அகற்றிய பிறகு பொதுவாக கருவுறும் திறன் விரைவில் திரும்பும். பாதுகாப்பற்ற உடலுறவுக்குப் பிறகு 5 நாட்களுக்குள் அவசர கர்ப்பத் தடுப்பாகவும் பயன்படுத்தலாம்.",
      },
      injection: {
        title: "கர்ப்பத் தடுப்பு ஊசி",
        description:
          "Depo-Provera, அல்லது Depo shot, 3 மாதங்களுக்கு ஒருமுறை கொடுக்கப்படும் கர்ப்பத் தடுப்பு ஊசி. இதில் progestin உள்ளது. இது முட்டை வெளியாவதைத் தடுத்து, விந்தணுக்களைத் தடுக்க கருப்பைக்கழுத்து சளியை அடர்த்தியாக்கி கர்ப்பத்தைத் தடுக்கும். சரியான நேரத்தில் எடுத்துக்கொண்டால் இது பாதுகாப்பானதும் பயனுள்ளதுமாகும். மாதவிடாயின் முதல் 7 நாட்களுக்குள் தொடங்கப்படாவிட்டால், முதல் வாரத்திற்கு கொண்டோம் போன்ற கூடுதல் பாதுகாப்பு தேவைப்படும்.",
      },
      EmergencyPill: {
        title: "அவசர கர்ப்பத் தடுப்பு மாத்திரை",
        description:
          "அவசர கர்ப்பத் தடுப்பு பாதுகாப்பற்ற யோனி உடலுறவுக்குப் பிறகு அல்லது வழக்கமான கர்ப்பத் தடுப்பு முறை தோல்வியடைந்தால், உதாரணமாக கொண்டோம் கிழிதல் அல்லது மாத்திரைகள் தவறுதல் போன்ற சூழலில், கர்ப்பத்தைத் தடுக்க பயன்படுத்தப்படுகிறது. இது வழக்கமான கர்ப்பத் தடுப்பு முறையாக பயன்படுத்தப்படக்கூடாது மற்றும் HIV அல்லது பிற STIs-இலிருந்து பாதுகாப்பளிக்காது. அவசர கர்ப்பத் தடுப்பு மாத்திரை பாதுகாப்பற்ற உடலுறவுக்குப் பிறகு 72 மணிநேரத்திற்குள் எடுத்துக்கொள்ளலாம். விரைவில் எடுத்துக்கொண்டால் சிறப்பாக செயல்படும்.",
      },
      ring: {
        title: "யோனி வளையம்",
        description:
          "யோனி வளையம் என்பது யோனிக்குள் வைக்கப்படும் ஹார்மோன் கர்ப்பத் தடுப்பு முறை. இது estrogen மற்றும் progestin வெளியிட்டு முட்டை வெளியாவதைத் தடுத்து, விந்தணுக்களைத் தடுக்கிறது. இது 3 வாரங்கள் அணியப்படும். பின்னர் 1 வாரம் அகற்றப்பட்டு புதிய வளையம் பயன்படுத்தப்படுகிறது. இது பயனுள்ளதும் வசதியானதுமாகும். ஆனால் STIs-இலிருந்து பாதுகாப்பளிக்காது, எனவே கொண்டோம் பரிந்துரைக்கப்படுகிறது.",
      },
      diaphragm: {
        title: "டயாஃப்ரம்",
        description:
          "டயாஃப்ரம் என்பது யோனிக்குள் வைத்து கருப்பைக்கழுத்தை மூடும் சிறிய நெகிழ்வான சிலிகான் கப். இது விந்தணுக்கள் முட்டையை அடையாமல் தடுத்து தடுப்பு முறையாக செயல்படுகிறது. பயன்திறனை அதிகரிக்க பொதுவாக spermicide உடன் பயன்படுத்தப்படுகிறது. உடலுறவுக்கு முன் இதை உள்ளே வைக்க வேண்டும் மற்றும் உடலுறவுக்குப் பிறகு சில மணிநேரங்கள் இடத்தில் வைத்திருக்க வேண்டும். இது HIV அல்லது பிற STIs-இலிருந்து பாதுகாப்பளிக்காது.",
      },
      sterilization: {
        title: "நிரந்தர கர்ப்பத் தடுப்பு",
        description:
          "நிரந்தர கர்ப்பத் தடுப்பு என்பது கர்ப்பத்தைத் தடுக்க பயன்படுத்தப்படும் நிரந்தர முறை. பெண்களில், முட்டை விந்தணுவைச் சந்திக்காமல் இருக்க fallopian tubes அடைக்கப்படுகின்றன அல்லது வெட்டப்படுகின்றன. ஆண்களில், இது vasectomy என அழைக்கப்படுகிறது. இதில் விந்தணுக்களை எடுத்துச் செல்லும் குழாய்கள் வெட்டப்படுகின்றன அல்லது மூடப்படுகின்றன. இது மிகவும் பயனுள்ளதாகும், ஆனால் பொதுவாக மாற்ற முடியாதது. எனவே எதிர்காலத்தில் குழந்தைகள் வேண்டாம் என்று உறுதியாக முடிவு செய்தவர்களுக்கு மட்டுமே இது பொருத்தமானது. இது HIV அல்லது பிற STIs-இலிருந்து பாதுகாப்பளிக்காது.",
      },
    },
  },
};

export function getBirthControlMethodTranslation(
  id: string,
  language: LanguageCode
): BirthControlMethodTranslation | null {
  return birthControlTranslations[language].methods[id] ?? null;
}