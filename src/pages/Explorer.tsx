import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, Filter, SlidersHorizontal, ArrowUpDown, 
  RotateCcw, Sparkles, Building2, Globe, Landmark, Award, BookOpen
} from 'lucide-react';
import { useSynora } from '../context/SynoraContext';
import { Scholarship, ScholarshipCategory } from '../types/scholarship';
import { ScholarshipCard } from '../components/ScholarshipCard';
import { ScholarshipDetailModal } from '../components/ScholarshipDetailModal';

export const Explorer: React.FC = () => {
  const { scholarships } = useSynora();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'deadline' | 'marks' | 'amount'>('deadline');
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);

  // Sync with URL params
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
    const q = searchParams.get('search');
    if (q) setSearchQuery(q);
  }, [searchParams]);

  // Unique list of states
  const availableStates = useMemo(() => {
    const states = new Set<string>();
    scholarships.forEach(s => {
      if (s.state && s.state !== 'All India') states.add(s.state);
    });
    return ['All', 'All India', ...Array.from(states)];
  }, [scholarships]);

  // Filtering & Sorting
  const filteredScholarships = useMemo(() => {
    return scholarships.filter(s => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = s.name.toLowerCase().includes(q);
        const matchesProvider = s.provider.toLowerCase().includes(q);
        const matchesDesc = s.description.toLowerCase().includes(q);
        const matchesCountry = s.country.toLowerCase().includes(q);
        if (!matchesName && !matchesProvider && !matchesDesc && !matchesCountry) return false;
      }

      // Category
      if (selectedCategory !== 'All' && s.category !== selectedCategory) {
        return false;
      }

      // Level
      if (selectedLevel !== 'All' && !s.educationLevels.includes(selectedLevel)) {
        return false;
      }

      // State
      if (selectedState !== 'All') {
        if (selectedState === 'All India' && s.state !== 'All India') return false;
        if (selectedState !== 'All India' && s.state !== selectedState) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'deadline') {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      if (sortBy === 'marks') {
        return (a.minimumMarks || 0) - (b.minimumMarks || 0);
      }
      if (sortBy === 'amount') {
        return (b.amountPerYear || 0) - (a.amountPerYear || 0);
      }
      return 0;
    });
  }, [scholarships, searchQuery, selectedCategory, selectedLevel, selectedState, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedLevel('All');
    setSelectedState('All');
    setSortBy('deadline');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header with separation callout */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Global Repository</span>
            <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded font-bold uppercase">All Schemes</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight">
            Scholarship Explorer
          </h1>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl">
            Browse the comprehensive registry of verified central, state, private, and international scholarships. 
            Want to see only those you qualify for? Try{' '}
            <Link to="/find-for-me" className="text-black font-semibold underline underline-offset-4 hover:text-gray-700">
              Find For Me
            </Link>.
          </p>
        </div>

        <Link
          to="/find-for-me"
          className="px-4 py-2.5 bg-black hover:bg-gray-800 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm shrink-0 transition-transform active:scale-95"
        >
          <Sparkles size={14} className="text-emerald-400" />
          <span>Filter by My Eligibility</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm space-y-4">
        {/* Search input and Sort */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by scholarship name, provider, course, or keyword..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-gray-700">
              <ArrowUpDown size={14} className="text-gray-400" />
              <span className="font-medium text-gray-500">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-bold text-black focus:outline-none cursor-pointer"
              >
                <option value="deadline">Closing Date (Soonest)</option>
                <option value="marks">Minimum Marks</option>
                <option value="amount">Highest Grant</option>
              </select>
            </div>

            <button
              onClick={handleResetFilters}
              className="p-2.5 hover:bg-gray-100 rounded-2xl border border-gray-200 text-gray-500 hover:text-black transition-colors"
              title="Reset all filters"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1">
          {['All', 'CENTRAL', 'STATE', 'PRIVATE', 'INTERNATIONAL'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat === 'All' ? 'All Categories' : cat}
            </button>
          ))}
        </div>

        {/* Level and State Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-gray-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-500 w-24">Education:</span>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-black"
            >
              <option value="All">All Education Levels</option>
              <option value="Class 10">Class 10</option>
              <option value="Class 12">Class 12</option>
              <option value="Undergraduate">Undergraduate Degree</option>
              <option value="Postgraduate">Postgraduate Degree</option>
              <option value="PhD">PhD / Doctoral</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-500 w-24">Region/State:</span>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-black"
            >
              {availableStates.map(st => (
                <option key={st} value={st}>{st === 'All' ? 'All Jurisdictions' : st}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
        <span>Showing {filteredScholarships.length} of {scholarships.length} verified schemes</span>
        {searchQuery && <span>Search: "{searchQuery}"</span>}
      </div>

      {/* Scholarships Grid */}
      {filteredScholarships.length === 0 ? (
        <div className="p-16 text-center bg-white border border-gray-200 rounded-3xl space-y-4">
          <BookOpen size={36} className="mx-auto text-gray-300" />
          <h3 className="text-lg font-bold text-black">No scholarships match the selected filters</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Try adjusting your search criteria or resetting filters to see all available national and international schemes.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-black text-white text-xs font-bold rounded-xl hover:bg-gray-800 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScholarships.map((scholarship) => (
            <ScholarshipCard
              key={scholarship.id}
              scholarship={scholarship}
              onSelect={(s) => setSelectedScholarship(s)}
            />
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedScholarship && (
        <ScholarshipDetailModal
          scholarship={selectedScholarship}
          onClose={() => setSelectedScholarship(null)}
        />
      )}
    </div>
  );
};
