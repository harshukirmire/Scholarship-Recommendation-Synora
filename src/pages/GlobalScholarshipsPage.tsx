import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, Globe, Filter, RotateCcw, Sparkles, Building2, 
  CheckCircle2, ShieldCheck, HelpCircle, Layers, Award,
  GraduationCap, CheckCircle, FileText, AlertCircle
} from 'lucide-react';
import { GLOBAL_SCHOLARSHIPS_DATA } from '../data/globalScholarshipsData';
import { GLOBAL_EXAMS_DATA } from '../data/globalExamsData';
import { 
  GlobalScholarship, GlobalExamRecord, StudyLevel 
} from '../types/globalScholarships';
import { GlobalScholarshipCard } from '../components/global/GlobalScholarshipCard';
import { GlobalScholarshipDetailModal } from '../components/global/GlobalScholarshipDetailModal';
import { ExamCard } from '../components/global/ExamCard';
import { ExamDetailModal } from '../components/global/ExamDetailModal';

// Academic and Special Categories
const SCHOLARSHIP_CATEGORIES = [
  { id: 'All', label: 'All Categories', icon: '🌐' },
  { id: 'No Exam Required', label: 'No Exam Required', icon: '✨' },
  { id: 'Fully Funded', label: 'Full Funding', icon: '💎' },
  { id: 'Engineering', label: 'Engineering & Tech', icon: '⚙️' },
  { id: 'Sciences', label: 'Natural & Applied Sciences', icon: '🔬' },
  { id: 'Medicine', label: 'Medicine & Health', icon: '🩺' },
  { id: 'Economics', label: 'Business & Economics', icon: '📊' },
  { id: 'Humanities', label: 'Humanities & Social Sciences', icon: '📚' },
  { id: 'Undergraduate', label: 'Undergraduate Schemes', icon: '🎓' },
  { id: 'Postgraduate', label: "Master's & PhD Schemes", icon: '🏛️' }
];

export const GlobalScholarshipsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Navigation tab: 'scholarships' vs 'exams'
  const [activeView, setActiveView] = useState<'scholarships' | 'exams'>('scholarships');

  // Filter States
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedContinent, setSelectedContinent] = useState<string>('All');
  const [selectedExamRequirement, setSelectedExamRequirement] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedFunding, setSelectedFunding] = useState<string>('All');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');

  // Modal States
  const [selectedScholarship, setSelectedScholarship] = useState<GlobalScholarship | null>(null);
  const [selectedExam, setSelectedExam] = useState<GlobalExamRecord | null>(null);

  // Sync search query from URL params if present
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setSearchQuery(q);
    const view = searchParams.get('view');
    if (view === 'exams') setActiveView('exams');
  }, [searchParams]);

  // Continents list
  const continents: { key: string; label: string; icon: string }[] = [
    { key: 'All', label: 'All Regions', icon: '🌐' },
    { key: 'India', label: 'India', icon: '🇮🇳' },
    { key: 'North America', label: 'North America', icon: '🌎' },
    { key: 'Europe', label: 'Europe', icon: '🇪🇺' },
    { key: 'Asia', label: 'Asia', icon: '🌏' },
    { key: 'Middle East', label: 'Middle East', icon: '🌏' },
    { key: 'Africa', label: 'Africa', icon: '🌍' },
    { key: 'South America', label: 'South America', icon: '🌎' },
    { key: 'Oceania', label: 'Oceania', icon: '🌏' },
    { key: 'International', label: 'Multinational', icon: '🌐' }
  ];

  // Unique list of countries
  const availableCountries = useMemo(() => {
    const countries = new Set<string>();
    GLOBAL_SCHOLARSHIPS_DATA.forEach(s => countries.add(s.country));
    return ['All', ...Array.from(countries).sort()];
  }, []);

  // Compute item count per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: GLOBAL_SCHOLARSHIPS_DATA.length };

    SCHOLARSHIP_CATEGORIES.forEach(cat => {
      if (cat.id === 'All') return;

      if (cat.id === 'No Exam Required') {
        counts[cat.id] = GLOBAL_SCHOLARSHIPS_DATA.filter(
          s => s.examRequirement.examStatus === 'NO_SEPARATE_EXAM'
        ).length;
      } else if (cat.id === 'Fully Funded') {
        counts[cat.id] = GLOBAL_SCHOLARSHIPS_DATA.filter(
          s => s.fundingType === 'Full'
        ).length;
      } else if (cat.id === 'Undergraduate') {
        counts[cat.id] = GLOBAL_SCHOLARSHIPS_DATA.filter(
          s => s.studyLevels.includes('Undergraduate') || s.studyLevels.includes('All Levels')
        ).length;
      } else if (cat.id === 'Postgraduate') {
        counts[cat.id] = GLOBAL_SCHOLARSHIPS_DATA.filter(
          s => s.studyLevels.includes('Postgraduate') || s.studyLevels.includes('PhD') || s.studyLevels.includes('All Levels')
        ).length;
      } else {
        // Disciplinary fields (Engineering, Sciences, Medicine, Economics, Humanities)
        counts[cat.id] = GLOBAL_SCHOLARSHIPS_DATA.filter(
          s => s.fieldsOfStudy.some(f => f.toLowerCase().includes(cat.id.toLowerCase())) ||
               s.fieldsOfStudy.includes('All Disciplines')
        ).length;
      }
    });

    return counts;
  }, []);

  // Filtered Scholarships
  const filteredScholarships = useMemo(() => {
    return GLOBAL_SCHOLARSHIPS_DATA.filter((s) => {
      // 1. Text Search matching
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();

        if (q.includes('without') && (q.includes('exam') || q.includes('test'))) {
          if (s.examRequirement.examStatus !== 'NO_SEPARATE_EXAM') return false;
        } else if (q.includes('scholarship exam') || q.includes('scholarship test')) {
          if (s.examRequirement.examStatus !== 'SCHOLARSHIP_EXAM_REQUIRED') return false;
        } else if (q.includes('admission exam') || q.includes('entrance exam')) {
          if (s.examRequirement.examStatus !== 'ADMISSION_EXAM_REQUIRED') return false;
        } else if (q.includes('ielts')) {
          const mentionsIelts = 
            (s.examRequirement.primaryExamName?.toLowerCase().includes('ielts')) ||
            (s.examRequirement.acceptedAlternativeExams?.some(e => e.toLowerCase().includes('ielts'))) ||
            (s.languageRequirementsSummary.toLowerCase().includes('ielts')) ||
            (s.examRequirement.relationshipExplanation.toLowerCase().includes('ielts'));
          if (!mentionsIelts) return false;
        } else if (q.includes('sat')) {
          const mentionsSat = 
            (s.examRequirement.primaryExamName?.toLowerCase().includes('sat')) ||
            (s.examRequirement.acceptedAlternativeExams?.some(e => e.toLowerCase().includes('sat')));
          if (!mentionsSat) return false;
        } else if (q.includes('jee')) {
          const mentionsJee = 
            (s.examRequirement.primaryExamName?.toLowerCase().includes('jee')) ||
            (s.examRequirement.acceptedAlternativeExams?.some(e => e.toLowerCase().includes('jee')));
          if (!mentionsJee) return false;
        } else if (q.includes('mext')) {
          const mentionsMext = s.name.toLowerCase().includes('mext') || s.examRequirement.primaryExamName?.toLowerCase().includes('mext');
          if (!mentionsMext) return false;
        } else if (q.includes('csc')) {
          const mentionsCsc = s.name.toLowerCase().includes('csc') || s.provider.toLowerCase().includes('csc');
          if (!mentionsCsc) return false;
        } else {
          const nameMatch = s.name.toLowerCase().includes(q) || (s.shortName && s.shortName.toLowerCase().includes(q));
          const providerMatch = s.provider.toLowerCase().includes(q);
          const countryMatch = s.country.toLowerCase().includes(q) || s.continent.toLowerCase().includes(q);
          const examMatch = s.examRequirement.primaryExamName?.toLowerCase().includes(q) ||
                            s.examRequirement.displayHeadline.toLowerCase().includes(q) ||
                            s.examRequirement.relationshipExplanation.toLowerCase().includes(q);
          const fieldsMatch = s.fieldsOfStudy.some(f => f.toLowerCase().includes(q));

          if (!nameMatch && !providerMatch && !countryMatch && !examMatch && !fieldsMatch) {
            return false;
          }
        }
      }

      // 2. Category Filter
      if (selectedCategory !== 'All') {
        if (selectedCategory === 'No Exam Required') {
          if (s.examRequirement.examStatus !== 'NO_SEPARATE_EXAM') return false;
        } else if (selectedCategory === 'Fully Funded') {
          if (s.fundingType !== 'Full') return false;
        } else if (selectedCategory === 'Undergraduate') {
          if (!s.studyLevels.includes('Undergraduate') && !s.studyLevels.includes('All Levels')) return false;
        } else if (selectedCategory === 'Postgraduate') {
          if (!s.studyLevels.includes('Postgraduate') && !s.studyLevels.includes('PhD') && !s.studyLevels.includes('All Levels')) return false;
        } else {
          const matchesField = s.fieldsOfStudy.some(f => f.toLowerCase().includes(selectedCategory.toLowerCase())) ||
                               s.fieldsOfStudy.includes('All Disciplines');
          if (!matchesField) return false;
        }
      }

      // 3. Continent filter
      if (selectedContinent !== 'All' && s.continent !== selectedContinent) {
        return false;
      }

      // 4. Country filter
      if (selectedCountry !== 'All' && s.country !== selectedCountry) {
        return false;
      }

      // 5. Exam Requirement filter
      if (selectedExamRequirement !== 'All') {
        if (s.examRequirement.examStatus !== selectedExamRequirement) {
          return false;
        }
      }

      // 6. Level filter
      if (selectedLevel !== 'All') {
        if (!s.studyLevels.includes(selectedLevel as StudyLevel) && !s.studyLevels.includes('All Levels')) {
          return false;
        }
      }

      // 7. Funding filter
      if (selectedFunding !== 'All') {
        if (s.fundingType !== selectedFunding) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedContinent, selectedCountry, selectedExamRequirement, selectedLevel, selectedFunding]);

  // Filtered Exams
  const filteredExams = useMemo(() => {
    return GLOBAL_EXAMS_DATA.filter((exam) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = exam.examName.toLowerCase().includes(q) || (exam.abbreviation && exam.abbreviation.toLowerCase().includes(q));
        const orgMatch = exam.conductingOrganization.toLowerCase().includes(q);
        const purposeMatch = exam.purpose.toLowerCase().includes(q);
        if (!nameMatch && !orgMatch && !purposeMatch) return false;
      }
      return true;
    });
  }, [searchQuery]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedContinent('All');
    setSelectedExamRequirement('All');
    setSelectedLevel('All');
    setSelectedFunding('All');
    setSelectedCountry('All');
    setSearchParams({});
  };

  const handleQuickSearch = (queryText: string) => {
    setSearchQuery(queryText);
    setActiveView('scholarships');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* 1. Page Header */}
      <div className="space-y-4 border-b border-gray-200 pb-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black text-white text-xs font-semibold">
            <Globe size={14} className="text-emerald-400" />
            <span>Public Global Directory • Open Access</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Directory View:</span>
            <div className="bg-gray-100 p-1 rounded-xl flex items-center gap-1 border border-gray-200">
              <button
                onClick={() => setActiveView('scholarships')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  activeView === 'scholarships'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                Scholarships ({filteredScholarships.length})
              </button>
              <button
                onClick={() => setActiveView('exams')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  activeView === 'exams'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                Standardized Exams ({filteredExams.length})
              </button>
            </div>
          </div>
        </div>

        <div>
          <h1 className="text-3xl sm:text-5xl font-black text-black tracking-tight">
            Global Scholarships & Required Exams
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-4xl leading-relaxed">
            Browse verified scholarships from India, North America, Europe, Asia, and worldwide. Every scholarship card clearly highlights the <strong>Exam Required</strong> section so you know precisely what tests are needed.
          </p>
        </div>

        {/* Public Notice Banner */}
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex items-start sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-gray-700 font-medium">
            <ShieldCheck size={18} className="text-black shrink-0" />
            <span>
              <strong>Public Directory Mode:</strong> Displays verified scholarship eligibility, funding coverage, and examination rules worldwide with zero profile bias.
            </span>
          </div>
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider hidden sm:block shrink-0">
            Open Access
          </span>
        </div>
      </div>

      {/* 2. SEARCH BAR & QUICK CHIPS */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search scholarships, providers, countries, or exams (e.g., 'MEXT', 'CSC', 'IELTS', 'DAAD', 'Chevening', 'JEE')..."
            className="w-full pl-12 pr-16 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-black transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {/* Quick Search Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles size={11} className="text-amber-500" /> Quick Filters:
          </span>
          {[
            { label: 'No Exam Required', query: 'without exam' },
            { label: 'Requires IELTS', query: 'IELTS' },
            { label: 'Japan MEXT Exam', query: 'MEXT' },
            { label: 'China CSC Scholarship', query: 'CSC' },
            { label: 'Germany DAAD', query: 'DAAD' },
            { label: 'UK Chevening', query: 'Chevening' },
            { label: 'Requires JEE / NEET', query: 'JEE' }
          ].map((chip, i) => (
            <button
              key={i}
              onClick={() => handleQuickSearch(chip.query)}
              className="px-3 py-1.5 bg-gray-50 hover:bg-black hover:text-white border border-gray-200 text-gray-700 rounded-xl whitespace-nowrap transition-colors font-medium active:scale-95 shrink-0"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. CATEGORIES LIST */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
            <Layers size={14} className="text-black" />
            Scholarship Categories
          </span>
          {selectedCategory !== 'All' && (
            <button
              onClick={() => setSelectedCategory('All')}
              className="text-xs font-semibold text-gray-500 hover:text-black"
            >
              Clear Category Filter
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {SCHOLARSHIP_CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category.id;
            const count = categoryCounts[category.id] ?? 0;

            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-black text-white border-black shadow-sm'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Geographic Regions */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block px-1">
          Geographic Regions
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
          {continents.map((item) => (
            <button
              key={item.key}
              onClick={() => setSelectedContinent(item.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 border ${
                selectedContinent === item.key
                  ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 5. Multi-Parameter Filters */}
      {activeView === 'scholarships' && (
        <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-black flex items-center gap-2">
              <Filter size={14} /> Refine Directory
            </span>
            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-gray-500 hover:text-black flex items-center gap-1"
            >
              <RotateCcw size={12} /> Reset All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {/* Exam Requirement Filter */}
            <div>
              <label className="font-bold text-gray-600 block mb-1">Exam Requirement Status</label>
              <select
                value={selectedExamRequirement}
                onChange={(e) => setSelectedExamRequirement(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-black cursor-pointer"
              >
                <option value="All">All Exam Requirements</option>
                <option value="SCHOLARSHIP_EXAM_REQUIRED">Scholarship Exam Required</option>
                <option value="ADMISSION_EXAM_REQUIRED">Admission Entrance Exam Required</option>
                <option value="LANGUAGE_TEST_REQUIRED">Language Test Required (IELTS/TOEFL)</option>
                <option value="NO_SEPARATE_EXAM">No Separate Exam Required</option>
                <option value="CONDITIONAL_EXAM">Conditional (Program Dependent)</option>
              </select>
            </div>

            {/* Study Level Filter */}
            <div>
              <label className="font-bold text-gray-600 block mb-1">Study Level</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-black cursor-pointer"
              >
                <option value="All">All Study Levels</option>
                <option value="Undergraduate">Undergraduate Degree</option>
                <option value="Postgraduate">Postgraduate (Master's)</option>
                <option value="PhD">PhD / Doctoral</option>
                <option value="School">School / Pre-University</option>
                <option value="Research">Research / Fellowships</option>
              </select>
            </div>

            {/* Country Filter */}
            <div>
              <label className="font-bold text-gray-600 block mb-1">Country</label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-black cursor-pointer"
              >
                {availableCountries.map(c => (
                  <option key={c} value={c}>{c === 'All' ? 'All Countries' : c}</option>
                ))}
              </select>
            </div>

            {/* Funding Filter */}
            <div>
              <label className="font-bold text-gray-600 block mb-1">Funding Coverage</label>
              <select
                value={selectedFunding}
                onChange={(e) => setSelectedFunding(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-black cursor-pointer"
              >
                <option value="All">All Funding Types</option>
                <option value="Full">Full Funding</option>
                <option value="Partial">Partial Funding</option>
                <option value="Tuition Waiver">Tuition Fee Waiver</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* 6. Results Summary */}
      <div className="flex items-center justify-between text-xs font-semibold text-gray-500 px-1">
        <span>
          {activeView === 'scholarships' 
            ? `Displaying ${filteredScholarships.length} verified scholarships`
            : `Displaying ${filteredExams.length} standardized examinations`
          }
        </span>
        {(searchQuery || selectedCategory !== 'All' || selectedContinent !== 'All') && (
          <button
            onClick={handleResetFilters}
            className="text-black hover:underline font-bold"
          >
            Clear active filters
          </button>
        )}
      </div>

      {/* 7. SCHOLARSHIP CARDS LIST (with distinct 'Exam Required' section) */}
      {activeView === 'scholarships' ? (
        filteredScholarships.length === 0 ? (
          <div className="p-16 text-center bg-white border border-gray-200 rounded-3xl space-y-4">
            <HelpCircle size={40} className="mx-auto text-gray-300" />
            <h3 className="text-lg font-bold text-black">No scholarships found matching this query or category</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Try searching for general keywords or choose another category from the list above.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-black text-white text-xs font-bold rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredScholarships.map((scholarship) => (
              <GlobalScholarshipCard
                key={scholarship.id}
                scholarship={scholarship}
                onSelect={(s) => setSelectedScholarship(s)}
                onSelectExam={(examName) => {
                  setSearchQuery(examName);
                  setActiveView('exams');
                }}
              />
            ))}
          </div>
        )
      ) : (
        /* Standardized Exam Directory View */
        <div className="space-y-6">
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs text-gray-600">
            <strong>Standardized Exam Directory:</strong> Browse exams linked to global scholarship programs. Qualifying in these exams satisfies the entrance or language prerequisites for the corresponding scholarships.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExams.map((exam) => {
              const connectedCount = exam.connectedScholarshipIds.length;
              return (
                <ExamCard
                  key={exam.id}
                  exam={exam}
                  connectedScholarshipsCount={connectedCount}
                  onSelect={(e) => setSelectedExam(e)}
                  onViewConnectedScholarships={(e) => {
                    setSearchQuery(e.abbreviation || e.examName);
                    setActiveView('scholarships');
                  }}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* 8. Modals */}
      {selectedScholarship && (
        <GlobalScholarshipDetailModal
          scholarship={selectedScholarship}
          onClose={() => setSelectedScholarship(null)}
          onSelectExam={(examName) => {
            setSelectedScholarship(null);
            setSearchQuery(examName);
            setActiveView('exams');
          }}
        />
      )}

      {selectedExam && (
        <ExamDetailModal
          exam={selectedExam}
          connectedScholarships={GLOBAL_SCHOLARSHIPS_DATA.filter(s => selectedExam.connectedScholarshipIds.includes(s.id))}
          onClose={() => setSelectedExam(null)}
          onSelectScholarship={(sch) => {
            setSelectedExam(null);
            setSelectedScholarship(sch);
          }}
        />
      )}
    </div>
  );
};
