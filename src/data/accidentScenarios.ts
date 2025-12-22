export type AccidentScenario = {
  id: number;
  scenario: { en: string; ar: string };
  question: { en: string; ar: string };
  options: {
    text: { en: string; ar: string };
    correct: boolean;
    feedback: { en: string; ar: string };
  }[];
};

export const accidentScenarios: AccidentScenario[] = [
  {
    id: 1,
    scenario: {
      en: 'You witness a two-car collision at an intersection. One driver appears injured and the other is standing outside their vehicle.',
      ar: 'تشهد تصادماً بين سيارتين في تقاطع. يبدو أحد السائقين مصاباً والآخر واقف خارج مركبته.',
    },
    question: {
      en: 'What should you do first?',
      ar: 'ماذا يجب أن تفعل أولاً؟',
    },
    options: [
      {
        text: {
          en: 'Immediately move the vehicles off the road',
          ar: 'نقل المركبات فوراً من الطريق',
        },
        correct: false,
        feedback: {
          en: 'Never move vehicles or injured persons unless there is immediate danger (fire, explosion risk). This can worsen injuries and destroy evidence.',
          ar: 'لا تنقل المركبات أو الأشخاص المصابين أبداً إلا إذا كان هناك خطر مباشر (حريق، خطر انفجار). قد يؤدي ذلك إلى تفاقم الإصابات وتدمير الأدلة.',
        },
      },
      {
        text: {
          en: 'Ensure the scene is safe, then call 999',
          ar: 'التأكد من سلامة المكان، ثم الاتصال على 999',
        },
        correct: true,
        feedback: {
          en: 'Correct! First assess if it\'s safe to approach, then call emergency services immediately for injuries.',
          ar: 'صحيح! قيّم أولاً ما إذا كان من الآمن الاقتراب، ثم اتصل بخدمات الطوارئ فوراً للإصابات.',
        },
      },
      {
        text: {
          en: 'Take photos of the accident scene',
          ar: 'التقاط صور لمكان الحادث',
        },
        correct: false,
        feedback: {
          en: 'While documenting is important, calling 999 for injured persons takes priority.',
          ar: 'بينما التوثيق مهم، فإن الاتصال على 999 للأشخاص المصابين له الأولوية.',
        },
      },
      {
        text: {
          en: 'Ask the standing driver what happened',
          ar: 'سؤال السائق الواقف عما حدث',
        },
        correct: false,
        feedback: {
          en: 'Getting emergency medical help should be your first priority when someone is injured.',
          ar: 'يجب أن تكون الحصول على المساعدة الطبية الطارئة أولويتك الأولى عند إصابة شخص ما.',
        },
      },
    ],
  },
  {
    id: 2,
    scenario: {
      en: 'Emergency services are on the way. The injured person is conscious but bleeding from their arm.',
      ar: 'خدمات الطوارئ في الطريق. الشخص المصاب واعٍ لكنه ينزف من ذراعه.',
    },
    question: {
      en: 'What should you do while waiting for help?',
      ar: 'ماذا يجب أن تفعل أثناء انتظار المساعدة؟',
    },
    options: [
      {
        text: {
          en: 'Give them water to drink',
          ar: 'إعطاؤهم ماءً للشرب',
        },
        correct: false,
        feedback: {
          en: 'Never give food or water to an injured person who may need surgery. They should remain fasting.',
          ar: 'لا تعطِ الطعام أو الماء أبداً لشخص مصاب قد يحتاج لعملية جراحية. يجب أن يبقى صائماً.',
        },
      },
      {
        text: {
          en: 'Apply pressure to stop the bleeding using clean cloth',
          ar: 'الضغط لإيقاف النزيف باستخدام قماش نظيف',
        },
        correct: true,
        feedback: {
          en: 'Excellent! Direct pressure helps control bleeding. Keep the person calm and still until help arrives.',
          ar: 'ممتاز! الضغط المباشر يساعد في السيطرة على النزيف. حافظ على هدوء الشخص وثباته حتى تصل المساعدة.',
        },
      },
      {
        text: {
          en: 'Help them walk to the sidewalk',
          ar: 'مساعدتهم على المشي إلى الرصيف',
        },
        correct: false,
        feedback: {
          en: 'Don\'t move an injured person unless there\'s immediate danger. They may have hidden injuries.',
          ar: 'لا تنقل شخصاً مصاباً إلا إذا كان هناك خطر مباشر. قد يكون لديه إصابات مخفية.',
        },
      },
      {
        text: {
          en: 'Remove their jacket to check for injuries',
          ar: 'إزالة سترتهم للتحقق من الإصابات',
        },
        correct: false,
        feedback: {
          en: 'Unless absolutely necessary, avoid moving clothing. Let trained medical professionals assess injuries.',
          ar: 'ما لم يكن ضرورياً للغاية، تجنب تحريك الملابس. دع المهنيين الطبيين المدربين يقيّمون الإصابات.',
        },
      },
    ],
  },
  {
    id: 3,
    scenario: {
      en: 'The ambulance has taken the injured person. Police arrive to document the accident.',
      ar: 'نقلت سيارة الإسعاف الشخص المصاب. تصل الشرطة لتوثيق الحادث.',
    },
    question: {
      en: 'What information should you provide to police?',
      ar: 'ما المعلومات التي يجب تقديمها للشرطة؟',
    },
    options: [
      {
        text: {
          en: 'Only give your opinion about who was at fault',
          ar: 'إعطاء رأيك فقط حول من كان المخطئ',
        },
        correct: false,
        feedback: {
          en: 'Never speculate about fault. Provide only factual observations.',
          ar: 'لا تتكهن أبداً بشأن الخطأ. قدم ملاحظات واقعية فقط.',
        },
      },
      {
        text: {
          en: 'Describe exactly what you saw happen',
          ar: 'وصف ما رأيته بالضبط',
        },
        correct: true,
        feedback: {
          en: 'Perfect! Witness statements should be factual, clear, and based only on what you actually observed.',
          ar: 'مثالي! يجب أن تكون شهادات الشهود واقعية وواضحة وتستند فقط إلى ما لاحظته بالفعل.',
        },
      },
      {
        text: {
          en: 'Share rumors you heard from other witnesses',
          ar: 'مشاركة الشائعات التي سمعتها من شهود آخرين',
        },
        correct: false,
        feedback: {
          en: 'Only report what you personally witnessed. Hearsay is not helpful to investigations.',
          ar: 'أبلغ فقط عما شهدته شخصياً. الشائعات ليست مفيدة للتحقيقات.',
        },
      },
      {
        text: {
          en: 'Refuse to give a statement',
          ar: 'رفض تقديم بيان',
        },
        correct: false,
        feedback: {
          en: 'Witness testimony is crucial for accident investigations. Cooperating with police helps ensure justice.',
          ar: 'شهادة الشهود حاسمة للتحقيقات في الحوادث. التعاون مع الشرطة يساعد في ضمان العدالة.',
        },
      },
    ],
  },
  {
    id: 4,
    scenario: {
      en: 'You notice fluid leaking from one of the vehicles and smell gasoline.',
      ar: 'تلاحظ تسرب سائل من إحدى المركبات وتشم رائحة البنزين.',
    },
    question: {
      en: 'What action should you take?',
      ar: 'ما الإجراء الذي يجب أن تتخذه؟',
    },
    options: [
      {
        text: {
          en: 'Try to plug the leak with cloth',
          ar: 'محاولة سد التسرب بقماش',
        },
        correct: false,
        feedback: {
          en: 'Never approach a gasoline leak. The risk of fire or explosion is too high.',
          ar: 'لا تقترب أبداً من تسرب البنزين. خطر الحريق أو الانفجار مرتفع جداً.',
        },
      },
      {
        text: {
          en: 'Immediately alert everyone to move away and call 999',
          ar: 'تنبيه الجميع فوراً للابتعاد والاتصال على 999',
        },
        correct: true,
        feedback: {
          en: 'Correct! Gasoline leaks create serious fire hazards. Clear the area and inform emergency services immediately.',
          ar: 'صحيح! تسريبات البنزين تخلق مخاطر حريق خطيرة. أخلِ المنطقة وأبلغ خدمات الطوارئ فوراً.',
        },
      },
      {
        text: {
          en: 'Take a photo to document the leak',
          ar: 'التقاط صورة لتوثيق التسرب',
        },
        correct: false,
        feedback: {
          en: 'Your safety comes first. A gasoline leak can ignite at any moment. Move away immediately.',
          ar: 'سلامتك تأتي أولاً. يمكن أن يشتعل تسرب البنزين في أي لحظة. ابتعد فوراً.',
        },
      },
      {
        text: {
          en: 'Start the vehicle to move it away',
          ar: 'تشغيل المركبة لنقلها بعيداً',
        },
        correct: false,
        feedback: {
          en: 'Starting a vehicle with a fuel leak could cause a fire or explosion. Never attempt this.',
          ar: 'تشغيل مركبة بها تسرب وقود قد يسبب حريقاً أو انفجاراً. لا تحاول هذا أبداً.',
        },
      },
    ],
  },
  {
    id: 5,
    scenario: {
      en: 'A minor fender-bender occurs with no injuries and minimal damage. Both drivers are present.',
      ar: 'يحدث تصادم طفيف بدون إصابات وأضرار طفيفة. كلا السائقين حاضران.',
    },
    question: {
      en: 'What is the appropriate emergency number to call?',
      ar: 'ما هو رقم الطوارئ المناسب للاتصال به؟',
    },
    options: [
      {
        text: {
          en: 'Call 999 for all accidents',
          ar: 'الاتصال على 999 لجميع الحوادث',
        },
        correct: false,
        feedback: {
          en: '999 is for life-threatening emergencies only. Misuse can delay help for critical cases.',
          ar: '999 للحالات الطارئة المهددة للحياة فقط. سوء الاستخدام قد يؤخر المساعدة للحالات الحرجة.',
        },
      },
      {
        text: {
          en: 'Call 901 for non-urgent police assistance',
          ar: 'الاتصال على 901 للمساعدة الشرطية غير العاجلة',
        },
        correct: true,
        feedback: {
          en: 'Exactly right! 901 is for non-emergency situations like minor accidents with no injuries.',
          ar: 'صحيح تماماً! 901 للحالات غير الطارئة مثل الحوادث البسيطة بدون إصابات.',
        },
      },
      {
        text: {
          en: 'Don\'t call anyone, just exchange insurance information',
          ar: 'عدم الاتصال بأحد، فقط تبادل معلومات التأمين',
        },
        correct: false,
        feedback: {
          en: 'In UAE, all accidents must be reported to police to get an official accident report for insurance.',
          ar: 'في الإمارات، يجب الإبلاغ عن جميع الحوادث للشرطة للحصول على تقرير حادث رسمي للتأمين.',
        },
      },
      {
        text: {
          en: 'Call your insurance company first',
          ar: 'الاتصال بشركة التأمين أولاً',
        },
        correct: false,
        feedback: {
          en: 'You must report to police first using 901. Insurance companies require an official police report.',
          ar: 'يجب الإبلاغ للشرطة أولاً باستخدام 901. شركات التأمين تطلب تقرير شرطة رسمي.',
        },
      },
    ],
  },
];
