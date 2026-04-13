import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiSearch, HiAdjustments, HiX, HiLocationMarker } from 'react-icons/hi';
import TutorCard from '../components/TutorCard';
import { tutors, subjects, specializations } from '../data/mockData';
import './FindTutors.css';

const FindTutors = () => {
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedSpec, setSelectedSpec] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('rating');

  const filteredTutors = useMemo(() => {
    let result = [...tutors];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.subjects.some(s => s.toLowerCase().includes(q)) ||
        t.specialization.some(s => s.toLowerCase().includes(q)) ||
        t.city.toLowerCase().includes(q) ||
        t.area.toLowerCase().includes(q)
      );
    }

    if (selectedSubject !== 'All') {
      result = result.filter(t => t.subjects.includes(selectedSubject));
    }

    if (selectedSpec !== 'All') {
      result = result.filter(t => t.specialization.includes(selectedSpec));
    }

    result = result.filter(t => {
      const minPrice = Math.min(...(t.pricing?.bySubject?.map(p => p.pricePerHour) || [0]));
      return minPrice >= priceRange[0] && minPrice <= priceRange[1];
    });

    if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);
    if (sortBy === 'price-low') result.sort((a, b) => {
      const aMin = Math.min(...(a.pricing?.bySubject?.map(p => p.pricePerHour) || [0]));
      const bMin = Math.min(...(b.pricing?.bySubject?.map(p => p.pricePerHour) || [0]));
      return aMin - bMin;
    });
    if (sortBy === 'experience') result.sort((a, b) => b.experience - a.experience);

    return result;
  }, [search, selectedSubject, selectedSpec, priceRange, sortBy]);

  const clearFilters = () => {
    setSearch('');
    setSelectedSubject('All');
    setSelectedSpec('All');
    setPriceRange([0, 1000]);
    setSortBy('rating');
  };

  const hasFilters = search || selectedSubject !== 'All' || selectedSpec !== 'All';

  return (
    <div className="find-tutors-page">
      <motion.div
        className="find-tutors-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container">
          <motion.h1
            className="find-tutors-hero__title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Find Your <span className="text-gradient">Perfect Tutor</span>
          </motion.h1>
          <motion.p
            className="find-tutors-hero__subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Browse verified tutors by subject, specialization & location
          </motion.p>

          <motion.div
            className="find-tutors-search"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="find-tutors-search__inner">
              <HiSearch size={20} className="find-tutors-search__icon" />
              <input
                type="text"
                className="find-tutors-search__input"
                placeholder="Search by name, subject, city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button className="find-tutors-search__clear" onClick={() => setSearch('')}>
                  <HiX size={16} />
                </button>
              )}
            </div>
            <button
              className={`btn btn-secondary btn-sm find-tutors-search__filter-btn ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <HiAdjustments size={18} />
              Filters
            </button>
          </motion.div>
        </div>
      </motion.div>

      <div className="container find-tutors-content">
        <AnimatePresence>
          {showFilters && (
            <motion.div
              className="find-tutors-filters glass-card"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="find-tutors-filters__section">
                <h4 className="find-tutors-filters__label">Subject</h4>
                <div className="find-tutors-filters__tags">
                  <button
                    className={`find-tutors-filters__tag ${selectedSubject === 'All' ? 'active' : ''}`}
                    onClick={() => setSelectedSubject('All')}
                  >All</button>
                  {subjects.map(sub => (
                    <button
                      key={sub}
                      className={`find-tutors-filters__tag ${selectedSubject === sub ? 'active' : ''}`}
                      onClick={() => setSelectedSubject(sub)}
                    >{sub}</button>
                  ))}
                </div>
              </div>

              <div className="find-tutors-filters__section">
                <h4 className="find-tutors-filters__label">Specialization</h4>
                <div className="find-tutors-filters__tags">
                  <button
                    className={`find-tutors-filters__tag ${selectedSpec === 'All' ? 'active' : ''}`}
                    onClick={() => setSelectedSpec('All')}
                  >All</button>
                  {specializations.map(spec => (
                    <button
                      key={spec}
                      className={`find-tutors-filters__tag spec ${selectedSpec === spec ? 'active' : ''}`}
                      onClick={() => setSelectedSpec(spec)}
                    >{spec}</button>
                  ))}
                </div>
              </div>

              <div className="find-tutors-filters__section">
                <h4 className="find-tutors-filters__label">Sort By</h4>
                <div className="find-tutors-filters__tags">
                  {[
                    { value: 'rating', label: 'Top Rated' },
                    { value: 'price-low', label: 'Price: Low to High' },
                    { value: 'experience', label: 'Experience' },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      className={`find-tutors-filters__tag ${sortBy === opt.value ? 'active' : ''}`}
                      onClick={() => setSortBy(opt.value)}
                    >{opt.label}</button>
                  ))}
                </div>
              </div>

              {hasFilters && (
                <button className="btn btn-sm btn-secondary" onClick={clearFilters}>
                  <HiX size={14} /> Clear All Filters
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="find-tutors-results-bar">
          <span className="find-tutors-results-count">
            {filteredTutors.length} tutor{filteredTutors.length !== 1 ? 's' : ''} found
          </span>
          {hasFilters && (
            <div className="find-tutors-active-filters">
              {selectedSubject !== 'All' && (
                <span className="badge badge-primary">
                  {selectedSubject}
                  <button onClick={() => setSelectedSubject('All')}><HiX size={12} /></button>
                </span>
              )}
              {selectedSpec !== 'All' && (
                <span className="badge badge-accent">
                  {selectedSpec}
                  <button onClick={() => setSelectedSpec('All')}><HiX size={12} /></button>
                </span>
              )}
            </div>
          )}
        </div>

        <div className="find-tutors-grid">
          <AnimatePresence mode="popLayout">
            {filteredTutors.map((tutor, i) => (
              <TutorCard key={tutor.id} tutor={tutor} index={i} />
            ))}
          </AnimatePresence>

          {filteredTutors.length === 0 && (
            <motion.div
              className="find-tutors-empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="find-tutors-empty__icon">🔍</div>
              <h3>No tutors found</h3>
              <p>Try adjusting your search or filters</p>
              <button className="btn btn-primary btn-sm" onClick={clearFilters}>
                Clear Filters
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindTutors;
