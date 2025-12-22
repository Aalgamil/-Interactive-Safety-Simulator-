export type MessageType = 'email' | 'sms' | 'whatsapp';

export type CyberMessage = {
  id: number;
  type: MessageType;
  from: { en: string; ar: string };
  subject?: { en: string; ar: string };
  content: { en: string; ar: string };
  isScam: boolean;
  redFlags: { en: string[]; ar: string[] };
  safetyTip: { en: string; ar: string };
};

export const cyberMessages: CyberMessage[] = [
  {
    id: 1,
    type: 'email',
    from: { en: 'security@dubaipolicee.gov.ae', ar: 'security@dubaipolicee.gov.ae' },
    subject: { en: 'URGENT: Fine Payment Required', ar: 'عاجل: مطلوب دفع غرامة' },
    content: {
      en: 'Dear Citizen, You have an outstanding traffic fine of AED 5,000. Click here to pay immediately to avoid legal action: http://dubai-police-pay.xyz/fine',
      ar: 'عزيزي المواطن، لديك غرامة مرورية مستحقة بقيمة 5000 درهم. انقر هنا للدفع فوراً لتجنب الإجراءات القانونية: http://dubai-police-pay.xyz/fine',
    },
    isScam: true,
    redFlags: {
      en: [
        'Misspelled domain (dubaipolicee instead of dubaipolice)',
        'Suspicious URL (not official dubai police website)',
        'Creates urgency and pressure',
        'Dubai Police never asks for payment via email links',
      ],
      ar: [
        'نطاق مُهجّأ بشكل خاطئ (dubaipolicee بدلاً من dubaipolice)',
        'رابط مشبوه (ليس الموقع الرسمي لشرطة دبي)',
        'يخلق إلحاحاً وضغطاً',
        'شرطة دبي لا تطلب الدفع عبر روابط البريد الإلكتروني أبداً',
      ],
    },
    safetyTip: {
      en: 'Always verify sender email domains carefully. Dubai Police communications come from official .gov.ae domains and never request payment through email links.',
      ar: 'تحقق دائماً من نطاقات البريد الإلكتروني للمرسل بعناية. اتصالات شرطة دبي تأتي من نطاقات .gov.ae الرسمية ولا تطلب الدفع عبر روابط البريد الإلكتروني أبداً.',
    },
  },
  {
    id: 2,
    type: 'sms',
    from: { en: '+971-50-XXX-XXXX', ar: '+971-50-XXX-XXXX' },
    content: {
      en: 'Dubai Police: Your vehicle registration renewal is due. Visit any RTA center or use the official Dubai Police app to renew. Reference: DXB2025-12345',
      ar: 'شرطة دبي: موعد تجديد تسجيل مركبتك مستحق. قم بزيارة أي مركز للطرق والمواصلات أو استخدم تطبيق شرطة دبي الرسمي للتجديد. المرجع: DXB2025-12345',
    },
    isScam: false,
    redFlags: { en: [], ar: [] },
    safetyTip: {
      en: 'This is a legitimate reminder message. It doesn\'t ask for payment or personal information via SMS and directs you to official channels.',
      ar: 'هذه رسالة تذكير شرعية. لا تطلب الدفع أو المعلومات الشخصية عبر الرسائل النصية وتوجهك إلى القنوات الرسمية.',
    },
  },
  {
    id: 3,
    type: 'whatsapp',
    from: { en: 'Unknown Number', ar: 'رقم غير معروف' },
    content: {
      en: 'Hello! I am Inspector Ahmed from CID. We detected suspicious activity on your bank account. Please share your bank details and OTP immediately for verification. This is urgent!',
      ar: 'مرحباً! أنا المفتش أحمد من إدارة التحقيقات الجنائية. اكتشفنا نشاطاً مشبوهاً في حسابك المصرفي. يرجى مشاركة بيانات البنك ورمز OTP فوراً للتحقق. هذا عاجل!',
    },
    isScam: true,
    redFlags: {
      en: [
        'Unsolicited message from unknown number',
        'Requests sensitive information (bank details, OTP)',
        'Creates false urgency',
        'Police never ask for OTPs or bank details via WhatsApp',
      ],
      ar: [
        'رسالة غير مرغوب فيها من رقم غير معروف',
        'يطلب معلومات حساسة (بيانات البنك، رمز OTP)',
        'يخلق إلحاحاً كاذباً',
        'الشرطة لا تطلب رموز OTP أو بيانات البنك عبر واتساب أبداً',
      ],
    },
    safetyTip: {
      en: 'Never share OTPs, passwords, or bank details with anyone via messaging apps. Official police investigations never request such information through WhatsApp.',
      ar: 'لا تشارك رموز OTP أو كلمات المرور أو بيانات البنك مع أي شخص عبر تطبيقات المراسلة. التحقيقات الشرطية الرسمية لا تطلب هذه المعلومات عبر واتساب أبداً.',
    },
  },
  {
    id: 4,
    type: 'email',
    from: { en: 'noreply@dubaipolice.gov.ae', ar: 'noreply@dubaipolice.gov.ae' },
    subject: { en: 'Crime Report Confirmation', ar: 'تأكيد تقرير الجريمة' },
    content: {
      en: 'Thank you for submitting your report (Ref: DP-2025-8765). A case officer will contact you within 2 business days. For inquiries, call 901 or visit your nearest police station.',
      ar: 'شكراً لك على تقديم تقريرك (المرجع: DP-2025-8765). سيتصل بك ضابط القضية خلال يومي عمل. للاستفسارات، اتصل على 901 أو قم بزيارة أقرب مركز شرطة.',
    },
    isScam: false,
    redFlags: { en: [], ar: [] },
    safetyTip: {
      en: 'Legitimate confirmation from official domain. Provides reference number and directs to official channels for follow-up.',
      ar: 'تأكيد شرعي من نطاق رسمي. يقدم رقم مرجعي ويوجه إلى القنوات الرسمية للمتابعة.',
    },
  },
  {
    id: 5,
    type: 'sms',
    from: { en: 'DubaiPolice', ar: 'DubaiPolice' },
    content: {
      en: 'CONGRATULATIONS! You won AED 50,000 in Dubai Police lottery! Send your Emirates ID copy and bank details to claim. Reply NOW!',
      ar: 'مبروك! لقد ربحت 50,000 درهم في يانصيب شرطة دبي! أرسل نسخة من الهوية الإماراتية وبيانات البنك للمطالبة. رد الآن!',
    },
    isScam: true,
    redFlags: {
      en: [
        'Dubai Police doesn\'t run lotteries',
        'Requests personal documents and bank information',
        'Too good to be true offer',
        'Pressure to respond immediately',
      ],
      ar: [
        'شرطة دبي لا تدير يانصيب',
        'يطلب وثائق شخصية ومعلومات مصرفية',
        'عرض جيد جداً لدرجة يصعب تصديقه',
        'ضغط للرد فوراً',
      ],
    },
    safetyTip: {
      en: 'Government agencies don\'t run lotteries or giveaways. Never send copies of your Emirates ID or bank details via SMS.',
      ar: 'الوكالات الحكومية لا تدير يانصيب أو هدايا. لا ترسل نسخاً من هويتك الإماراتية أو بيانات البنك عبر الرسائل النصية أبداً.',
    },
  },
  {
    id: 6,
    type: 'email',
    from: { en: 'support@bankofdubai.ae.verify-account.com', ar: 'support@bankofdubai.ae.verify-account.com' },
    subject: { en: 'Account Security Alert', ar: 'تنبيه أمان الحساب' },
    content: {
      en: 'We detected unusual activity on your account. Your account will be suspended unless you verify your identity immediately. Click here to verify: http://verify-dxb-bank.com',
      ar: 'اكتشفنا نشاطاً غير معتاد في حسابك. سيتم تعليق حسابك ما لم تتحقق من هويتك فوراً. انقر هنا للتحقق: http://verify-dxb-bank.com',
    },
    isScam: true,
    redFlags: {
      en: [
        'Suspicious subdomain (verify-account.com is the actual domain)',
        'Threats of account suspension',
        'External link that doesn\'t match bank domain',
        'Generic greeting (no personalization)',
      ],
      ar: [
        'نطاق فرعي مشبوه (verify-account.com هو النطاق الفعلي)',
        'تهديدات بتعليق الحساب',
        'رابط خارجي لا يتطابق مع نطاق البنك',
        'تحية عامة (بدون تخصيص)',
      ],
    },
    safetyTip: {
      en: 'Check the actual domain carefully - scammers create fake subdomains. Banks never ask you to verify via external links sent through email.',
      ar: 'تحقق من النطاق الفعلي بعناية - المحتالون ينشئون نطاقات فرعية مزيفة. البنوك لا تطلب منك التحقق عبر روابط خارجية مرسلة عبر البريد الإلكتروني أبداً.',
    },
  },
  {
    id: 7,
    type: 'sms',
    from: { en: '901', ar: '901' },
    content: {
      en: 'Your inquiry #45678 regarding lost document has been processed. Collect from Al Barsha Police Station during working hours (8AM-8PM). Bring Emirates ID.',
      ar: 'تم معالجة استفسارك رقم 45678 بخصوص الوثيقة المفقودة. استلمها من مركز شرطة البرشاء خلال ساعات العمل (8 صباحاً - 8 مساءً). أحضر الهوية الإماراتية.',
    },
    isScam: false,
    redFlags: { en: [], ar: [] },
    safetyTip: {
      en: 'Legitimate message from official number 901. Provides specific details and clear instructions without requesting sensitive information.',
      ar: 'رسالة شرعية من الرقم الرسمي 901. تقدم تفاصيل محددة وتعليمات واضحة دون طلب معلومات حساسة.',
    },
  },
  {
    id: 8,
    type: 'whatsapp',
    from: { en: 'Delivery Service', ar: 'خدمة التوصيل' },
    content: {
      en: 'Your package from Dubai Police Lost & Found is ready for delivery. Pay AED 50 delivery fee via this link: bit.ly/dp-delivery123',
      ar: 'طردك من مكتب المفقودات بشرطة دبي جاهز للتسليم. ادفع 50 درهم رسوم توصيل عبر هذا الرابط: bit.ly/dp-delivery123',
    },
    isScam: true,
    redFlags: {
      en: [
        'Dubai Police doesn\'t charge delivery fees via WhatsApp',
        'Uses URL shortener (suspicious)',
        'Requests payment through unofficial channel',
        'Unsolicited message about unknown package',
      ],
      ar: [
        'شرطة دبي لا تفرض رسوم توصيل عبر واتساب',
        'يستخدم مختصر الروابط (مشبوه)',
        'يطلب الدفع عبر قناة غير رسمية',
        'رسالة غير مرغوب فيها حول طرد غير معروف',
      ],
    },
    safetyTip: {
      en: 'Dubai Police doesn\'t charge delivery fees for lost and found items via WhatsApp links. Always verify through official channels by calling 901.',
      ar: 'شرطة دبي لا تفرض رسوم توصيل للأغراض المفقودة والموجودة عبر روابط واتساب. تحقق دائماً عبر القنوات الرسمية بالاتصال على 901.',
    },
  },
  {
    id: 9,
    type: 'email',
    from: { en: 'careers@dubaipolice.gov.ae', ar: 'careers@dubaipolice.gov.ae' },
    subject: { en: 'Your Job Application Status', ar: 'حالة طلب التوظيف الخاص بك' },
    content: {
      en: 'Dear Applicant, Your application for Position Ref #2025-DP-567 has been received. Track your application status on our official careers portal: careers.dubaipolice.gov.ae',
      ar: 'عزيزي المتقدم، تم استلام طلبك للمنصب المرجع رقم 2025-DP-567. تتبع حالة طلبك على بوابة التوظيف الرسمية لدينا: careers.dubaipolice.gov.ae',
    },
    isScam: false,
    redFlags: { en: [], ar: [] },
    safetyTip: {
      en: 'Official email from verified domain. Directs to official website without requesting sensitive information or payment.',
      ar: 'بريد إلكتروني رسمي من نطاق موثق. يوجه إلى الموقع الرسمي دون طلب معلومات حساسة أو دفع.',
    },
  },
  {
    id: 10,
    type: 'sms',
    from: { en: '+44-XXX-XXXX-XXX', ar: '+44-XXX-XXXX-XXX' },
    content: {
      en: 'This is Interpol. You are involved in international fraud case. Transfer AED 20,000 to case ref account to avoid arrest warrant. Respond in 24 hours.',
      ar: 'هذا الإنتربول. أنت متورط في قضية احتيال دولية. حوّل 20,000 درهم إلى حساب مرجع القضية لتجنب مذكرة التوقيف. رد خلال 24 ساعة.',
    },
    isScam: true,
    redFlags: {
      en: [
        'Interpol doesn\'t contact individuals via SMS',
        'International number claiming to be law enforcement',
        'Demands payment to avoid arrest',
        'Creates fear and urgency',
        'No case officer name or official reference',
      ],
      ar: [
        'الإنتربول لا يتصل بالأفراد عبر الرسائل النصية',
        'رقم دولي يدعي أنه من إنفاذ القانون',
        'يطالب بالدفع لتجنب التوقيف',
        'يخلق خوفاً وإلحاحاً',
        'لا يوجد اسم ضابط القضية أو مرجع رسمي',
      ],
    },
    safetyTip: {
      en: 'Law enforcement agencies never demand payments via SMS to "avoid arrest". This is a classic scam. Report such messages to Dubai Police via 901.',
      ar: 'وكالات إنفاذ القانون لا تطالب بالدفع عبر الرسائل النصية "لتجنب التوقيف" أبداً. هذا احتيال كلاسيكي. أبلغ عن هذه الرسائل لشرطة دبي عبر 901.',
    },
  },
];
