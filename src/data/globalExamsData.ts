import { GlobalExamRecord } from '../types/globalScholarships';

export const GLOBAL_EXAMS_DATA: GlobalExamRecord[] = [
  {
    id: 'exam-ielts',
    examName: 'International English Language Testing System (IELTS Academic)',
    abbreviation: 'IELTS',
    examType: 'LANGUAGE_PROFICIENCY',
    conductingOrganization: 'British Council, IDP: IELTS Australia, Cambridge University Press & Assessment',
    countryOrGlobal: 'Global (Accepted in 140+ countries)',
    purpose: 'Standardized assessment of English language proficiency across Listening, Reading, Writing, and Speaking for global higher education and immigration.',
    typicalMinimumScores: '6.0 to 7.5 overall band (e.g. Australia Awards mandates min 6.5 with no band < 6.0; DAAD EPOS typically requires 6.0–6.5; Chevening-affiliated UK universities require 6.5–7.5).',
    connectedScholarshipIds: [
      'australia-awards-scholarship',
      'csc-chinese-university-program',
      'daad-epos-germany',
      'erasmus-mundus-joint-masters',
      'chevening-fcdio-uk-master',
      'fulbright-nehru-us-masters',
      'gks-global-korea-scholarship'
    ],
    officialWebsite: 'https://www.ielts.org',
    officialSourceUrl: 'https://www.ielts.org/about-ielts',
    verificationStatus: 'VERIFIED_OFFICIAL',
    lastVerifiedDate: '2026-09-20'
  },
  {
    id: 'exam-toefl',
    examName: 'Test of English as a Foreign Language (TOEFL iBT)',
    abbreviation: 'TOEFL iBT',
    examType: 'LANGUAGE_PROFICIENCY',
    conductingOrganization: 'Educational Testing Service (ETS), USA',
    countryOrGlobal: 'Global (Accepted by 12,000+ universities worldwide)',
    purpose: 'Measures how well non-native speakers use and understand English as it is read, written, heard, and spoken in university classrooms.',
    typicalMinimumScores: '80 to 100+ on iBT scale (e.g. Fulbright-Nehru American university placement requires 90–100+; Australia Awards accepts 84+ with min 21 in all subtests; Chinese university English-taught programs accept 80+).',
    connectedScholarshipIds: [
      'fulbright-nehru-us-masters',
      'australia-awards-scholarship',
      'csc-chinese-university-program',
      'daad-epos-germany',
      'erasmus-mundus-joint-masters',
      'gks-global-korea-scholarship'
    ],
    officialWebsite: 'https://www.ets.org/toefl',
    officialSourceUrl: 'https://www.ets.org/toefl/test-takers/ibt/about.html',
    verificationStatus: 'VERIFIED_OFFICIAL',
    lastVerifiedDate: '2026-09-18'
  },
  {
    id: 'exam-hsk',
    examName: 'Hanyu Shuiping Kaoshi (Chinese Proficiency Test)',
    abbreviation: 'HSK',
    examType: 'LANGUAGE_PROFICIENCY',
    conductingOrganization: 'Center for Language Education and Cooperation (CLEC) / Ministry of Education, China',
    countryOrGlobal: 'China / Global Test Centers',
    purpose: 'China standardized national test of Chinese language proficiency for non-native speakers, required for academic degree enrollment in Chinese-taught programs.',
    typicalMinimumScores: 'HSK Level 4 (score >= 180 or 210) for Science/Engineering; HSK Level 5 (score >= 180) for Liberal Arts, Economics, and Medicine at Chinese host universities.',
    connectedScholarshipIds: [
      'csc-chinese-university-program'
    ],
    officialWebsite: 'https://www.chinesetest.cn',
    officialSourceUrl: 'https://www.chinesetest.cn/gosign.do?id=1&lid=0',
    verificationStatus: 'VERIFIED_OFFICIAL',
    lastVerifiedDate: '2026-09-19'
  },
  {
    id: 'exam-mext-embassy',
    examName: 'MEXT Written Examination for Undergraduate & Research Students',
    abbreviation: 'MEXT Exam',
    examType: 'SCHOLARSHIP_TEST',
    conductingOrganization: 'Ministry of Education, Culture, Sports, Science and Technology (MEXT), Japan & Japanese Embassies',
    countryOrGlobal: 'Japan (Administered at Japanese Diplomatic Missions Globally)',
    purpose: 'Dedicated competitive written selection exam conducted directly for the Japanese Government MEXT scholarship award covering Mathematics, English, Japanese, Chemistry, Physics, and Biology.',
    typicalMinimumScores: 'Embassy-determined national merit threshold (highest scoring candidates in each subject cohort are invited to embassy interviews).',
    connectedScholarshipIds: [
      'mext-embassy-undergraduate-japan'
    ],
    officialWebsite: 'https://www.studyinjapan.go.jp/en/planning/scholarship/application/examination/',
    officialSourceUrl: 'https://www.studyinjapan.go.jp',
    verificationStatus: 'VERIFIED_OFFICIAL',
    lastVerifiedDate: '2026-09-18'
  },
  {
    id: 'exam-gre',
    examName: 'Graduate Record Examination (GRE General Test)',
    abbreviation: 'GRE',
    examType: 'UNIVERSITY_ADMISSION',
    conductingOrganization: 'Educational Testing Service (ETS), USA',
    countryOrGlobal: 'United States & Worldwide Graduate Schools',
    purpose: 'Standardized graduate admission test assessing verbal reasoning, quantitative reasoning, and analytical writing required for admission to US Master and Doctoral programs.',
    typicalMinimumScores: 'Competitive percentiles (typically 155+ Verbal, 160+ Quantitative for STEM disciplines at top US Fulbright placement institutions).',
    connectedScholarshipIds: [
      'fulbright-nehru-us-masters'
    ],
    officialWebsite: 'https://www.ets.org/gre',
    officialSourceUrl: 'https://www.ets.org/gre/test-takers/general-test/about.html',
    verificationStatus: 'VERIFIED_OFFICIAL',
    lastVerifiedDate: '2026-09-16'
  },
  {
    id: 'exam-singapore-moe',
    examName: 'Singapore Ministry of Education Scholarship Selection Test (English, Math, GAT)',
    abbreviation: 'MOE Selection Test',
    examType: 'SCHOLARSHIP_TEST',
    conductingOrganization: 'Ministry of Education (MOE), Singapore',
    countryOrGlobal: 'Singapore (Administered in regional test centers across Asia)',
    purpose: 'Standardized written examination testing English proficiency, advanced mathematics problem solving, and general cognitive ability directly for Singapore Government scholarship award.',
    typicalMinimumScores: 'Competitive percentile cutoff determined by Singapore MOE board for each national cohort.',
    connectedScholarshipIds: [
      'singapore-moe-pre-university'
    ],
    officialWebsite: 'https://www.moe.gov.sg/financial-matters/awards-scholarships/asean-scholarships',
    officialSourceUrl: 'https://www.moe.gov.sg',
    verificationStatus: 'VERIFIED_OFFICIAL',
    lastVerifiedDate: '2026-09-15'
  },
  {
    id: 'exam-ugc-net',
    examName: 'UGC-NET (National Eligibility Test) for Junior Research Fellowship (JRF)',
    abbreviation: 'UGC-NET / JRF',
    examType: 'SCHOLARSHIP_TEST',
    conductingOrganization: 'National Testing Agency (NTA) on behalf of University Grants Commission (UGC), India',
    countryOrGlobal: 'India',
    purpose: 'National competitive examination testing teaching and research aptitude plus subject domain competence to award Junior Research Fellowships for PhD in India.',
    typicalMinimumScores: 'Top percentile cutoff (approximately top 1% to 2% of candidates qualifying in each subject domain are awarded JRF).',
    connectedScholarshipIds: [
      'ugc-net-jrf-fellowship-india'
    ],
    officialWebsite: 'https://ugcnet.nta.ac.in',
    officialSourceUrl: 'https://www.ugc.gov.in',
    verificationStatus: 'VERIFIED_OFFICIAL',
    lastVerifiedDate: '2026-09-19'
  },
  {
    id: 'exam-jee-neet',
    examName: 'National Level Engineering & Medical Entrances (JEE Main / JEE Advanced / NEET)',
    abbreviation: 'JEE / NEET',
    examType: 'NATIONAL_ENTRANCE',
    conductingOrganization: 'National Testing Agency (NTA) / IIT Joint Admission Board, India',
    countryOrGlobal: 'India',
    purpose: 'National entrance examination for engineering and medicine; top merit ranks (e.g. top 10,000) are recognized by Indian government science scholarships like INSPIRE SHE.',
    typicalMinimumScores: 'Top 10,000 national rank for automatic qualification under Government of India INSPIRE SHE basic sciences fellowship.',
    connectedScholarshipIds: [
      'inspire-she-dst-india'
    ],
    officialWebsite: 'https://jeemain.nta.nic.in',
    officialSourceUrl: 'https://online-inspire.gov.in',
    verificationStatus: 'VERIFIED_OFFICIAL',
    lastVerifiedDate: '2026-09-18'
  },
  {
    id: 'exam-topik',
    examName: 'Test of Proficiency in Korean (TOPIK)',
    abbreviation: 'TOPIK',
    examType: 'LANGUAGE_PROFICIENCY',
    conductingOrganization: 'National Institute for International Education (NIIED), Ministry of Education, South Korea',
    countryOrGlobal: 'South Korea / Global Test Centers',
    purpose: 'Assesses Korean language proficiency across reading, listening, and writing; mandatory for progression into Korean university degrees under GKS.',
    typicalMinimumScores: 'TOPIK Level 3 or higher required by NIIED prior to starting degree courses; TOPIK Level 5 or higher exempts scholars from 1-year language institute.',
    connectedScholarshipIds: [
      'gks-global-korea-scholarship'
    ],
    officialWebsite: 'https://www.topik.go.kr',
    officialSourceUrl: 'https://www.studyinkorea.go.kr',
    verificationStatus: 'VERIFIED_OFFICIAL',
    lastVerifiedDate: '2026-09-19'
  }
];
