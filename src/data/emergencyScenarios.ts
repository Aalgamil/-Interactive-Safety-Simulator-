export type EmergencyScenario = {
  id: number;
  situation: { en: string; ar: string };
  correctAnswer: '999' | '901';
  explanation: { en: string; ar: string };
};

export const emergencyScenarios: EmergencyScenario[] = [
  {
    id: 1,
    situation: {
      en: 'A person is having a heart attack',
      ar: 'شخص يتعرض لنوبة قلبية',
    },
    correctAnswer: '999',
    explanation: {
      en: 'Life-threatening medical emergencies require immediate response via 999.',
      ar: 'الحالات الطبية الطارئة المهددة للحياة تتطلب استجابة فورية عبر 999.',
    },
  },
  {
    id: 2,
    situation: {
      en: 'Minor car scratch in parking lot, no injuries',
      ar: 'خدش بسيط في السيارة بموقف السيارات، بدون إصابات',
    },
    correctAnswer: '901',
    explanation: {
      en: 'Minor property damage with no injuries is non-urgent. Use 901.',
      ar: 'الأضرار البسيطة في الممتلكات بدون إصابات غير عاجلة. استخدم 901.',
    },
  },
  {
    id: 3,
    situation: {
      en: 'Building on fire with people trapped inside',
      ar: 'مبنى يحترق وأشخاص محاصرون بالداخل',
    },
    correctAnswer: '999',
    explanation: {
      en: 'Fire with endangered lives is a critical emergency requiring 999.',
      ar: 'حريق مع أرواح في خطر حالة طارئة حرجة تتطلب 999.',
    },
  },
  {
    id: 4,
    situation: {
      en: 'Noise complaint from neighbors',
      ar: 'شكوى ضوضاء من الجيران',
    },
    correctAnswer: '901',
    explanation: {
      en: 'Noise complaints are non-emergency matters handled via 901.',
      ar: 'شكاوى الضوضاء أمور غير طارئة يتم التعامل معها عبر 901.',
    },
  },
  {
    id: 5,
    situation: {
      en: 'Armed robbery in progress',
      ar: 'سرقة مسلحة جارية',
    },
    correctAnswer: '999',
    explanation: {
      en: 'Active crimes with weapons are life-threatening emergencies requiring 999.',
      ar: 'الجرائم النشطة بالأسلحة حالات طارئة مهددة للحياة تتطلب 999.',
    },
  },
  {
    id: 6,
    situation: {
      en: 'Lost wallet with ID cards',
      ar: 'محفظة مفقودة تحتوي على بطاقات هوية',
    },
    correctAnswer: '901',
    explanation: {
      en: 'Lost items with no immediate danger are reported via 901.',
      ar: 'الأغراض المفقودة بدون خطر مباشر يتم الإبلاغ عنها عبر 901.',
    },
  },
  {
    id: 7,
    situation: {
      en: 'Child choking and turning blue',
      ar: 'طفل يختنق ويتحول لونه إلى الأزرق',
    },
    correctAnswer: '999',
    explanation: {
      en: 'Choking is a life-threatening emergency requiring immediate 999 call.',
      ar: 'الاختناق حالة طارئة مهددة للحياة تتطلب الاتصال الفوري على 999.',
    },
  },
  {
    id: 8,
    situation: {
      en: 'Suspicious package left unattended at mall',
      ar: 'طرد مشبوه متروك بدون مراقبة في المول',
    },
    correctAnswer: '999',
    explanation: {
      en: 'Potential security threats require immediate 999 response.',
      ar: 'التهديدات الأمنية المحتملة تتطلب استجابة فورية على 999.',
    },
  },
  {
    id: 9,
    situation: {
      en: 'Report a traffic violation you witnessed yesterday',
      ar: 'الإبلاغ عن مخالفة مرورية شاهدتها بالأمس',
    },
    correctAnswer: '901',
    explanation: {
      en: 'Past incidents with no immediate danger are reported via 901.',
      ar: 'الحوادث السابقة بدون خطر مباشر يتم الإبلاغ عنها عبر 901.',
    },
  },
  {
    id: 10,
    situation: {
      en: 'Person drowning at the beach',
      ar: 'شخص يغرق في الشاطئ',
    },
    correctAnswer: '999',
    explanation: {
      en: 'Drowning is a life-threatening emergency requiring immediate 999 call.',
      ar: 'الغرق حالة طارئة مهددة للحياة تتطلب الاتصال الفوري على 999.',
    },
  },
];
