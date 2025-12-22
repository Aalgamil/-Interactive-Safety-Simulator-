import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navbar
    'nav.title': 'Dubai Police Safety Simulator',
    'nav.login': 'Login / Sign Up',
    'nav.logout': 'Logout',
    'nav.back': 'Back to Home',
    
    // Home Page
    'home.hero.title': 'Learn Safety Through Interactive Simulations',
    'home.hero.subtitle': 'Practice real-world emergency scenarios, improve your response time, and protect yourself from cybercrime threats.',
    'home.hero.cta': 'Get Started',
    'home.features.title': 'Interactive Training Modules',
    'home.features.accident.title': 'Accident Reaction Simulator',
    'home.features.accident.description': 'Experience realistic road accident scenarios and learn the correct procedures to follow. Make decisions under pressure and see the consequences.',
    'home.features.accident.list1': '• Scene assessment',
    'home.features.accident.list2': '• Emergency calling',
    'home.features.accident.list3': '• First aid basics',
    'home.features.accident.list4': '• Evidence preservation',
    'home.features.emergency.title': 'Emergency Reporting Game',
    'home.features.emergency.description': 'Test your knowledge and reaction time. Quickly identify whether to call 999 or 901 based on various scenarios.',
    'home.features.emergency.list1': '• 999 vs 901 differentiation',
    'home.features.emergency.list2': '• Speed challenges',
    'home.features.emergency.list3': '• Score tracking',
    'home.features.emergency.list4': '• Real-time feedback',
    'home.features.cyber.title': 'Cybercrime Detection',
    'home.features.cyber.description': 'Identify phishing attempts, fraudulent messages, and online scams. Learn to protect yourself in the digital world.',
    'home.features.cyber.list1': '• Phishing identification',
    'home.features.cyber.list2': '• Fraud detection',
    'home.features.cyber.list3': '• Safe browsing tips',
    'home.features.cyber.list4': '• Instant guidance',
    'home.stats.title': 'Why Practice Matters',
    'home.stats.stat1': '3x',
    'home.stats.stat1.text': 'Faster response time with practice',
    'home.stats.stat2': '85%',
    'home.stats.stat2.text': 'Improvement in correct decision-making',
    'home.stats.stat3': '90%',
    'home.stats.stat3.text': 'Better cybercrime awareness',
    'home.cta.title': 'Ready to Enhance Your Safety Skills?',
    'home.cta.subtitle': 'Join thousands of community members learning essential safety behaviors through interactive simulations.',
    'home.cta.button': 'Start Learning Now',
    'home.footer': '© 2025 Dubai Police Safety Simulator. Supporting community safety through innovation.',
    
    // Login Page
    'login.welcome': 'Welcome Back',
    'login.subtitle': 'Sign in to continue your safety training',
    'login.username': 'Username',
    'login.username.placeholder': 'Enter your username',
    'login.username.required': 'Username is required',
    'login.username.minlength': 'Username must be at least 3 characters',
    'login.email': 'Email Address',
    'login.email.placeholder': 'Enter your email',
    'login.email.required': 'Email is required',
    'login.email.invalid': 'Please enter a valid email address',
    'login.submit': 'Sign In / Sign Up',
    'login.success': 'Login successful! Redirecting...',
    'login.note': 'New users will be automatically registered. Your progress will be saved locally.',
    
    // Dashboard
    'dashboard.welcome': 'Welcome back',
    'dashboard.subtitle': 'Continue your safety training journey',
    'dashboard.progress': 'Your Progress',
    'dashboard.totalScore': 'Total Score',
    'dashboard.modules': 'Training Modules',
    'dashboard.bestScore': 'Best Score',
    'dashboard.start': 'Start Simulation',
    'dashboard.startGame': 'Start Game',
    'dashboard.startDetection': 'Start Detection',
    'dashboard.accident.title': 'Accident Reaction',
    'dashboard.accident.description': 'Practice responding to road accidents',
    'dashboard.emergency.title': 'Emergency Reporting',
    'dashboard.emergency.description': 'Test your speed and accuracy',
    'dashboard.cyber.title': 'Cybercrime Detection',
    'dashboard.cyber.description': 'Identify threats and scams',
    'dashboard.tips': 'Quick Safety Tips',
    'dashboard.tips.emergency': 'Emergency Numbers',
    'dashboard.tips.emergency1': '• 999 - Life-threatening emergencies only',
    'dashboard.tips.emergency2': '• 901 - Non-urgent police matters',
    'dashboard.tips.emergency3': '• Always stay calm and provide clear information',
    'dashboard.tips.cyber': 'Cybersecurity',
    'dashboard.tips.cyber1': '• Never share personal information via suspicious links',
    'dashboard.tips.cyber2': '• Verify sender email addresses carefully',
    'dashboard.tips.cyber3': '• Dubai Police will never ask for payment via SMS/email',
    
    // Common
    'common.back': 'Back',
    'common.score': 'Score',
    'common.next': 'Next Scenario',
    'common.complete': 'Complete Simulation',
    'common.tryAgain': 'Try Again',
    'common.backToDashboard': 'Back to Dashboard',
    'common.playAgain': 'Play Again',
    'common.step': 'Step',
    'common.of': 'of',
    'common.round': 'Round',
    'common.message': 'Message',
    
    // Accident Simulation
    'accident.complete': 'Simulation Complete!',
    'accident.yourScore': 'Your Score',
    'accident.takeaways': 'Key Takeaways:',
    'accident.takeaway1': '• Always ensure scene safety before approaching an accident',
    'accident.takeaway2': '• Call 999 for injuries or life-threatening situations',
    'accident.takeaway3': '• Call 901 for minor accidents with no injuries',
    'accident.takeaway4': '• Never move injured persons unless there\'s immediate danger',
    'accident.takeaway5': '• Provide only factual information to police',
    'accident.takeaway6': '• Be aware of hazards like fuel leaks',
    'accident.scenario': 'Scenario',
    
    // Emergency Reporting Game
    'emergency.complete': 'Game Complete!',
    'emergency.finalScore': 'Final Score',
    'emergency.correct': 'Correct Answers',
    'emergency.accuracy': 'Accuracy',
    'emergency.totalTime': 'Total Time',
    'emergency.remember': 'Remember:',
    'emergency.999': '999 - Emergency (Life-threatening)',
    'emergency.999.desc': 'Fire, medical emergencies, crimes in progress, accidents with injuries',
    'emergency.901': '901 - Non-Emergency',
    'emergency.901.desc': 'Minor accidents, noise complaints, lost items, past incidents',
    'emergency.callQuestion': 'Which number should you call?',
    'emergency.emergency': 'Emergency',
    'emergency.nonEmergency': 'Non-Emergency',
    'emergency.timeUp': 'Time\'s up! Correct answer:',
    'emergency.correctAnswer': 'Correct!',
    'emergency.incorrectAnswer': 'Incorrect.',
    
    // Cybercrime Game
    'cyber.complete': 'Detection Complete!',
    'cyber.identified': 'Correctly Identified',
    'cyber.detectionAccuracy': 'Detection Accuracy',
    'cyber.redFlags': 'Key Cybercrime Red Flags:',
    'cyber.redFlag1': '• Misspelled or suspicious email domains',
    'cyber.redFlag2': '• Requests for personal information, OTPs, or passwords',
    'cyber.redFlag3': '• Urgent threats or too-good-to-be-true offers',
    'cyber.redFlag4': '• Payment requests via unofficial channels',
    'cyber.redFlag5': '• Generic greetings with no personalization',
    'cyber.redFlag6': '• Links to external or shortened URLs',
    'cyber.isScam': 'Is this message a scam?',
    'cyber.yesScam': 'Yes, it\'s a SCAM',
    'cyber.noLegit': 'No, it\'s LEGITIMATE',
    'cyber.correct': 'Correct!',
    'cyber.incorrect': 'Incorrect',
    'cyber.thisIs': 'This message is',
    'cyber.scam': 'a SCAM',
    'cyber.legitimate': 'LEGITIMATE',
    'cyber.redFlagsTitle': 'Red Flags:',
    'cyber.safetyTip': 'Safety Tip:',
    'cyber.email': 'email',
    'cyber.sms': 'sms',
    'cyber.whatsapp': 'whatsapp',
  },
  ar: {
    // Navbar
    'nav.title': 'محاكي السلامة - شرطة دبي',
    'nav.login': 'تسجيل الدخول / التسجيل',
    'nav.logout': 'تسجيل الخروج',
    'nav.back': 'العودة للرئيسية',
    
    // Home Page
    'home.hero.title': 'تعلم السلامة من خلال المحاكاة التفاعلية',
    'home.hero.subtitle': 'مارس سيناريوهات الطوارئ الواقعية، وحسّن وقت استجابتك، واحمِ نفسك من تهديدات الجرائم الإلكترونية.',
    'home.hero.cta': 'ابدأ الآن',
    'home.features.title': 'وحدات التدريب التفاعلية',
    'home.features.accident.title': 'محاكي ردة فعل الحوادث',
    'home.features.accident.description': 'اختبر سيناريوهات حوادث الطرق الواقعية وتعلم الإجراءات الصحيحة التي يجب اتباعها. اتخذ القرارات تحت الضغط وشاهد العواقب.',
    'home.features.accident.list1': '• تقييم مكان الحادث',
    'home.features.accident.list2': '• الاتصال بالطوارئ',
    'home.features.accident.list3': '• أساسيات الإسعافات الأولية',
    'home.features.accident.list4': '• الحفاظ على الأدلة',
    'home.features.emergency.title': 'لعبة الإبلاغ عن الطوارئ',
    'home.features.emergency.description': 'اختبر معرفتك ووقت استجابتك. حدد بسرعة ما إذا كان يجب الاتصال على 999 أو 901 بناءً على سيناريوهات مختلفة.',
    'home.features.emergency.list1': '• التمييز بين 999 و 901',
    'home.features.emergency.list2': '• تحديات السرعة',
    'home.features.emergency.list3': '• تتبع النقاط',
    'home.features.emergency.list4': '• تعليقات فورية',
    'home.features.cyber.title': 'كشف الجرائم الإلكترونية',
    'home.features.cyber.description': 'تعرف على محاولات التصيد الاحتيالي والرسائل الاحتيالية وعمليات الاحتيال عبر الإنترنت. تعلم كيفية حماية نفسك في العالم الرقمي.',
    'home.features.cyber.list1': '• تحديد التصيد الاحتيالي',
    'home.features.cyber.list2': '• كشف الاحتيال',
    'home.features.cyber.list3': '• نصائح التصفح الآمن',
    'home.features.cyber.list4': '• إرشادات فورية',
    'home.stats.title': 'لماذا التدريب مهم',
    'home.stats.stat1': '3x',
    'home.stats.stat1.text': 'وقت استجابة أسرع مع التدريب',
    'home.stats.stat2': '85%',
    'home.stats.stat2.text': 'تحسن في اتخاذ القرار الصحيح',
    'home.stats.stat3': '90%',
    'home.stats.stat3.text': 'وعي أفضل بالجرائم الإلكترونية',
    'home.cta.title': 'هل أنت مستعد لتعزيز مهاراتك في السلامة؟',
    'home.cta.subtitle': 'انضم إلى آلاف أفراد المجتمع الذين يتعلمون سلوكيات السلامة الأساسية من خلال المحاكاة التفاعلية.',
    'home.cta.button': 'ابدأ التعلم الآن',
    'home.footer': '© 2025 محاكي السلامة - شرطة دبي. دعم سلامة المجتمع من خلال الابتكار.',
    
    // Login Page
    'login.welcome': 'مرحباً بعودتك',
    'login.subtitle': 'سجل الدخول لمتابعة تدريبك على السلامة',
    'login.username': 'اسم المستخدم',
    'login.username.placeholder': 'أدخل اسم المستخدم',
    'login.username.required': 'اسم المستخدم مطلوب',
    'login.username.minlength': 'يجب أن يكون اسم المستخدم 3 أحرف على الأقل',
    'login.email': 'البريد الإلكتروني',
    'login.email.placeholder': 'أدخل بريدك الإلكتروني',
    'login.email.required': 'البريد الإلكتروني مطلوب',
    'login.email.invalid': 'الرجاء إدخال عنوان بريد إلكتروني صالح',
    'login.submit': 'تسجيل الدخول / التسجيل',
    'login.success': 'تم تسجيل الدخول بنجاح! جاري التحويل...',
    'login.note': 'سيتم تسجيل المستخدمين الجدد تلقائياً. سيتم حفظ تقدمك محلياً.',
    
    // Dashboard
    'dashboard.welcome': 'مرحباً بعودتك',
    'dashboard.subtitle': 'تابع رحلتك التدريبية في السلامة',
    'dashboard.progress': 'تقدمك',
    'dashboard.totalScore': 'مجموع النقاط',
    'dashboard.modules': 'وحدات التدريب',
    'dashboard.bestScore': 'أفضل نتيجة',
    'dashboard.start': 'بدء المحاكاة',
    'dashboard.startGame': 'بدء اللعبة',
    'dashboard.startDetection': 'بدء الكشف',
    'dashboard.accident.title': 'ردة فعل الحوادث',
    'dashboard.accident.description': 'تدرب على الاستجابة لحوادث الطرق',
    'dashboard.emergency.title': 'الإبلاغ عن الطوارئ',
    'dashboard.emergency.description': 'اختبر سرعتك ودقتك',
    'dashboard.cyber.title': 'كشف الجرائم الإلكترونية',
    'dashboard.cyber.description': 'تحديد التهديدات والاحتيال',
    'dashboard.tips': 'نصائح سريعة للسلامة',
    'dashboard.tips.emergency': 'أرقام الطوارئ',
    'dashboard.tips.emergency1': '• 999 - للحالات الطارئة المهددة للحياة فقط',
    'dashboard.tips.emergency2': '• 901 - لأمور الشرطة غير العاجلة',
    'dashboard.tips.emergency3': '• حافظ دائماً على الهدوء وقدم معلومات واضحة',
    'dashboard.tips.cyber': 'الأمن السيبراني',
    'dashboard.tips.cyber1': '• لا تشارك أبداً المعلومات الشخصية عبر روابط مشبوهة',
    'dashboard.tips.cyber2': '• تحقق من عناوين البريد الإلكتروني للمرسل بعناية',
    'dashboard.tips.cyber3': '• لن تطلب شرطة دبي أبداً الدفع عبر الرسائل النصية/البريد الإلكتروني',
    
    // Common
    'common.back': 'رجوع',
    'common.score': 'النقاط',
    'common.next': 'السيناريو التالي',
    'common.complete': 'إكمال المحاكاة',
    'common.tryAgain': 'حاول مرة أخرى',
    'common.backToDashboard': 'العودة للوحة التحكم',
    'common.playAgain': 'العب مرة أخرى',
    'common.step': 'خطوة',
    'common.of': 'من',
    'common.round': 'جولة',
    'common.message': 'رسالة',
    
    // Accident Simulation
    'accident.complete': 'اكتملت المحاكاة!',
    'accident.yourScore': 'نتيجتك',
    'accident.takeaways': 'النقاط الرئيسية:',
    'accident.takeaway1': '• تأكد دائماً من سلامة مكان الحادث قبل الاقتراب',
    'accident.takeaway2': '• اتصل على 999 للإصابات أو المواقف المهددة للحياة',
    'accident.takeaway3': '• اتصل على 901 للحوادث البسيطة بدون إصابات',
    'accident.takeaway4': '• لا تنقل الأشخاص المصابين إلا إذا كان هناك خطر مباشر',
    'accident.takeaway5': '• قدم معلومات واقعية فقط للشرطة',
    'accident.takeaway6': '• كن على دراية بالمخاطر مثل تسرب الوقود',
    'accident.scenario': 'السيناريو',
    
    // Emergency Reporting Game
    'emergency.complete': 'اكتملت اللعبة!',
    'emergency.finalScore': 'النتيجة النهائية',
    'emergency.correct': 'إجابات صحيحة',
    'emergency.accuracy': 'الدقة',
    'emergency.totalTime': 'الوقت الإجمالي',
    'emergency.remember': 'تذكر:',
    'emergency.999': '999 - طوارئ (مهددة للحياة)',
    'emergency.999.desc': 'حرائق، طوارئ طبية، جرائم قيد التنفيذ، حوادث مع إصابات',
    'emergency.901': '901 - غير عاجل',
    'emergency.901.desc': 'حوادث بسيطة، شكاوى ضوضاء، أغراض مفقودة، حوادث سابقة',
    'emergency.callQuestion': 'أي رقم يجب أن تتصل عليه؟',
    'emergency.emergency': 'طوارئ',
    'emergency.nonEmergency': 'غير عاجل',
    'emergency.timeUp': 'انتهى الوقت! الإجابة الصحيحة:',
    'emergency.correctAnswer': 'صحيح!',
    'emergency.incorrectAnswer': 'خطأ.',
    
    // Cybercrime Game
    'cyber.complete': 'اكتمل الكشف!',
    'cyber.identified': 'تم التحديد بشكل صحيح',
    'cyber.detectionAccuracy': 'دقة الكشف',
    'cyber.redFlags': 'العلامات الحمراء للجرائم الإلكترونية:',
    'cyber.redFlag1': '• نطاقات البريد الإلكتروني المُهجّأة بشكل خاطئ أو المشبوهة',
    'cyber.redFlag2': '• طلبات للحصول على معلومات شخصية أو كلمات مرور OTP',
    'cyber.redFlag3': '• تهديدات عاجلة أو عروض جيدة جداً لدرجة يصعب تصديقها',
    'cyber.redFlag4': '• طلبات دفع عبر قنوات غير رسمية',
    'cyber.redFlag5': '• تحيات عامة بدون تخصيص',
    'cyber.redFlag6': '• روابط خارجية أو عناوين URL مختصرة',
    'cyber.isScam': 'هل هذه الرسالة احتيالية؟',
    'cyber.yesScam': 'نعم، إنها احتيال',
    'cyber.noLegit': 'لا، إنها شرعية',
    'cyber.correct': 'صحيح!',
    'cyber.incorrect': 'خطأ',
    'cyber.thisIs': 'هذه الرسالة',
    'cyber.scam': 'احتيال',
    'cyber.legitimate': 'شرعية',
    'cyber.redFlagsTitle': 'علامات تحذيرية:',
    'cyber.safetyTip': 'نصيحة أمان:',
    'cyber.email': 'بريد إلكتروني',
    'cyber.sms': 'رسالة نصية',
    'cyber.whatsapp': 'واتساب',
  },
};

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'ar' || saved === 'en') ? saved : 'en';
  });

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ar' : 'en';
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  // Set initial direction
  if (typeof document !== 'undefined') {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
