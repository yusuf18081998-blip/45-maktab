import { Appeal } from '../types';

export const INITIAL_APPEALS: Appeal[] = [
  {
    id: 'app-45-001',
    trackingCode: 'SD-45-7821',
    studentName: 'Sardorbek Rahimov',
    studentClass: '10-"A"',
    studentPhone: '+998 90 123 45 67',
    isAnonymous: false,
    category: 'schedule',
    title: 'Chorshanba kungi Kimyo darsini 3-soatga surish iltimosi',
    description: 'Chorshanba kunlari 1-soatda Kimyo darsimiz bor. Lekin 1-soatda kimyo laboratoriya xonasida 11-sinflar tajriba o‘tkazayotgan bo‘ladi. Agar darsimizni 3-soatga surilsa, biz ham amaliy tajribalarni bemalol laboratoriyada o‘tkaza olardik.',
    urgency: 'important',
    scheduleDetails: {
      subject: 'Kimyo',
      dayOfWeek: 'Chorshanba',
      currentSlot: '1-soat (08:30)',
      proposedSlot: '3-soat (10:10)',
      reason: 'Laboratoriya xonasi bandligi va amaliy tajribalar o‘tkazish zarurati'
    },
    status: 'pending',
    createdAt: '2026-09-28T09:15:00.000Z',
    updatedAt: '2026-09-28T09:15:00.000Z',
    statusHistory: [
      {
        timestamp: '2026-09-28T09:15:00.000Z',
        status: 'pending',
        note: 'Ariza tizimga muvaffaqiyatli kiritildi va o‘quv bo‘limiga yuborildi.',
        actor: 'Sardorbek Rahimov (10-"A")'
      }
    ]
  },
  {
    id: 'app-45-002',
    trackingCode: 'SD-45-8142',
    studentName: 'Madinabonu Karimova',
    studentClass: '11-"B"',
    studentPhone: '+998 93 987 65 43',
    isAnonymous: false,
    category: 'teaching',
    title: 'Matematika darslarida DTM testlari va amaliy tahlillarni ko‘paytirish',
    description: '11-sinf bo‘lganimiz sababli oliygohlarga kirish imtihonlariga tayyorlanyapmiz. Hurmatli ma’muriyat, Algebra darslarida nazariy qismdan tashqari haftada 1 soat murakkab va mantiqiy testlar yechish usullarini ko‘rib chiqishni yo‘lga qo‘yishda yordam berishingizni so‘raymiz.',
    urgency: 'important',
    teachingDetails: {
      subject: 'Algebra va matematik analiz',
      teacherName: 'Qodirov A. S.',
      suggestionArea: 'Amaliy mashg‘ulotlar va DTM test tahlillari'
    },
    status: 'approved',
    createdAt: '2026-09-25T11:20:00.000Z',
    updatedAt: '2026-09-26T14:30:00.000Z',
    adminResponse: {
      answeredAt: '2026-09-26T14:30:00.000Z',
      responderTitle: 'Maktab Direktori',
      responderName: 'Xodoyqulova Ximiraxon Chinpolatovna',
      comment: 'So‘rov to‘liq qo‘llab-quvvatlandi. Fan o‘qituvchisi Qodirov A. S. bilan suhbatlashildi. Juma kungi 2-soat to‘liq test yechish va tahlil qilish mashg‘ulotiga aylantirildi. O‘quvchilarga omad tilaymiz!',
      decisionNote: 'O‘quv rejasiga o‘zgartirish kiritildi'
    },
    statusHistory: [
      {
        timestamp: '2026-09-25T11:20:00.000Z',
        status: 'pending',
        note: 'Ariza qabul qilindi.',
        actor: 'Madinabonu Karimova'
      },
      {
        timestamp: '2026-09-26T14:30:00.000Z',
        status: 'approved',
        note: 'Maktab ma’muriyati tomonidan ijobiy xulosa berildi va ijroga yo‘naltirildi.',
        actor: 'Maktab Direktori (Xodoyqulova X. Ch.)'
      }
    ]
  },
  {
    id: 'app-45-003',
    trackingCode: 'SD-45-9203',
    studentName: 'Jasurbek Omonov',
    studentClass: '9-"A"',
    studentPhone: '+998 94 333 22 11',
    isAnonymous: false,
    category: 'general',
    title: 'Maktab kutubxonasida darsdan keyingi mutolaa va erkin koworking hududi',
    description: 'Darslardan so‘ng fan olimpiadalariga tayyorlanadigan o‘quvchilar uchun kutubxonada tinch o‘qish burchagi va 2 ta noutbuk uchun elektr rozetkalari o‘rnatilishi juda qulay bo‘lardi.',
    urgency: 'normal',
    status: 'approved',
    createdAt: '2026-09-22T15:45:00.000Z',
    updatedAt: '2026-09-24T10:00:00.000Z',
    adminResponse: {
      answeredAt: '2026-09-24T10:00:00.000Z',
      responderTitle: 'Xo‘jalik ishlari bo‘yicha mudir',
      responderName: 'N. T. Saidov',
      comment: 'Ajoyib tashabbus! Kutubxona mudirasi bilan kelishildi, kutubxona o‘quv zaliga qo‘shimcha rozetkalar o‘rnatildi va darsdan so‘ng soat 17:30 gacha ishlashi yo‘lga qo‘yildi.',
      decisionNote: 'Moddiy-texnik ta’minot yakunlandi'
    },
    statusHistory: [
      {
        timestamp: '2026-09-22T15:45:00.000Z',
        status: 'pending',
        note: 'Ariza qabul qilindi.',
        actor: 'Jasurbek Omonov'
      },
      {
        timestamp: '2026-09-24T10:00:00.000Z',
        status: 'approved',
        note: 'So‘rov qanoatlantirildi.',
        actor: 'Xo‘jalik mudiri (N. T. Saidov)'
      }
    ]
  },
  {
    id: 'app-45-004',
    trackingCode: 'SD-45-6319',
    studentName: 'Bekzod Mirzayev',
    studentClass: '11-"A"',
    studentPhone: '+998 97 765 43 21',
    isAnonymous: false,
    category: 'schedule',
    title: 'Juma kungi Jismoniy tarbiya darsini 2-soatga o‘tkazish',
    description: 'Juma kungi oxirgi soatda hamma charchagan bo‘ladi. Iloji bo‘lsa jismoniy tarbiya darsini ertalabki 2-soatga surib berishingizni so‘raymiz.',
    urgency: 'normal',
    scheduleDetails: {
      subject: 'Jismoniy tarbiya',
      dayOfWeek: 'Juma',
      currentSlot: '6-soat (13:10)',
      proposedSlot: '2-soat (09:20)',
      reason: 'Ertalabki soatda faolroq shug‘ullanish maqsadi'
    },
    status: 'rejected',
    createdAt: '2026-09-20T12:00:00.000Z',
    updatedAt: '2026-09-21T16:15:00.000Z',
    adminResponse: {
      answeredAt: '2026-09-21T16:15:00.000Z',
      responderTitle: 'O‘quv ishlari bo‘yicha direktor o‘rinbosari',
      responderName: 'D. Sh. Normatova',
      comment: 'Hurmatli Bekzod, taklifingiz o‘rganib chiqildi. Juma kuni 2-soatda sport zalida 8-"A" va 8-"B" sinflar darsi rejalashtirilgan bo‘lib, sport zal sig‘imi sanitariya me’yorlaridan oshib ketishi sababli ushbu soatga ko‘chirishning imkoni yo‘q.',
      decisionNote: 'Zal sig‘imi cheklovi tufayli rad etildi'
    },
    statusHistory: [
      {
        timestamp: '2026-09-20T12:00:00.000Z',
        status: 'pending',
        note: 'Ariza qabul qilindi.',
        actor: 'Bekzod Mirzayev'
      },
      {
        timestamp: '2026-09-21T16:15:00.000Z',
        status: 'rejected',
        note: 'Sanitariya talablari va bandlik sababli rad etildi.',
        actor: 'O‘quv ishlari bo‘yicha o‘rinbosar (D. Sh. Normatova)'
      }
    ]
  },
  {
    id: 'app-45-005',
    trackingCode: 'SD-45-9934',
    studentName: 'Zulayho Akramova',
    studentClass: '10-"B"',
    studentPhone: '+998 91 555 77 88',
    isAnonymous: false,
    category: 'teaching',
    title: 'Ingliz tili darslarida "Speaking Club" va debatlarni ko‘paytirish',
    description: 'Bizning sinfda grammatika qoidalarini yaxshi o‘rganyapmiz, biroq erkin so‘zlashuv mashg‘ulotlari kamroq bo‘lmoqda. O‘qituvchimiz har chorshanba kuni mini-debatlar yoki suhbatlar tashkil qilsa til o‘rganishimiz ancha tezlashardi.',
    urgency: 'important',
    teachingDetails: {
      subject: 'Ingliz tili',
      teacherName: 'Usmonova G. T.',
      suggestionArea: 'Og‘zaki nutq va muloqot mashg‘ulotlari'
    },
    status: 'pending',
    createdAt: '2026-09-30T08:10:00.000Z',
    updatedAt: '2026-09-30T08:10:00.000Z',
    statusHistory: [
      {
        timestamp: '2026-09-30T08:10:00.000Z',
        status: 'pending',
        note: 'Ariza qabul qilindi va chet tillari uslubiy birlashmasiga topshirildi.',
        actor: 'Zulayho Akramova'
      }
    ]
  }
];
