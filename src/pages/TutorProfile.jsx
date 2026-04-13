import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiStar, HiShieldCheck, HiLocationMarker, HiClock, HiAcademicCap, HiCalendar, HiChat, HiCheckCircle } from 'react-icons/hi';
import { FaGraduationCap, FaRupeeSign } from 'react-icons/fa';
import { tutors } from '../data/mockData';
import './TutorProfile.css';

const TutorProfile = () => {
  const { id } = useParams();
  const tutor = tutors.find(t => t.id === Number(id)) || tutors[0];

  const fadeUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="tutor-profile-page">
      {/* ─── Profile Header ─── */}
      <section className="tp-header">
        <div className="tp-header__bg">
          <div className="tp-header__orb tp-header__orb--1" />
          <div className="tp-header__orb tp-header__orb--2" />
        </div>
        <div className="container tp-header__content">
          <motion.div
            className="tp-header__left"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="tp-header__avatar-wrap">
              <div className="tp-header__avatar">{tutor.initials}</div>
              <div className={`tp-header__online ${tutor.isOnline ? 'tp-header__online--active' : ''}`}>
                {tutor.isOnline ? 'Online' : 'Offline'}
              </div>
            </div>

            <div className="tp-header__info">
              <div className="tp-header__name-row">
                <h1 className="tp-header__name">{tutor.name}</h1>
                {tutor.isVerified && (
                  <span className="badge badge-success"><HiShieldCheck /> Verified</span>
                )}
              </div>

              <div className="tp-header__meta">
                <span><HiStar className="tp-header__star" /> {tutor.rating} ({tutor.totalReviews} reviews)</span>
                <span><HiClock /> {tutor.experience} years experience</span>
                <span><HiLocationMarker /> {tutor.area}, {tutor.city}</span>
              </div>

              <p className="tp-header__bio">{tutor.bio}</p>

              <div className="tp-header__tags">
                {tutor.subjects.map(s => (
                  <span key={s} className="badge badge-primary">{s}</span>
                ))}
                {tutor.specialization.map(s => (
                  <span key={s} className="badge badge-accent">{s}</span>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="tp-header__right"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="tp-booking-card glass-card">
              <h3 className="tp-booking-card__title">Book a Session</h3>
              <div className="tp-booking-card__price-main">
                <span className="tp-booking-card__from">Starting from</span>
                <div className="tp-booking-card__amount">
                  <span className="tp-booking-card__currency">₹</span>
                  {Math.min(...(tutor.pricing?.bySubject?.map(p => p.pricePerHour) || [0]))}
                  <span className="tp-booking-card__unit">/hr</span>
                </div>
              </div>
              <motion.button
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <HiCalendar /> Book Session
              </motion.button>
              <motion.button
                className="btn btn-secondary"
                style={{ width: '100%' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <HiChat /> Send Message
              </motion.button>
              <p className="tp-booking-card__note">Free trial session available</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Content ─── */}
      <div className="container tp-content">
        <div className="tp-content__grid">
          {/* ─── Left Column ─── */}
          <div className="tp-content__main">
            {/* Qualifications */}
            <motion.section className="tp-section glass-card" {...fadeUp}>
              <h2 className="tp-section__title"><FaGraduationCap /> Qualifications</h2>
              <div className="tp-qualifications">
                {tutor.qualifications.map((q, i) => (
                  <div key={i} className="tp-qualification-item">
                    <div className="tp-qualification-item__icon">🎓</div>
                    <div>
                      <strong>{q.degree} in {q.subject}</strong>
                      <span className="tp-qualification-item__uni">{q.university}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Pricing Table */}
            <motion.section className="tp-section glass-card" {...fadeUp}>
              <h2 className="tp-section__title"><FaRupeeSign /> Pricing</h2>
              <div className="tp-pricing-table">
                <div className="tp-pricing-table__header">
                  <span>Subject/Package</span>
                  <span>Per Hour</span>
                  <span>Per Month</span>
                </div>
                {tutor.pricing?.bySubject?.map((p, i) => (
                  <div key={i} className="tp-pricing-table__row">
                    <span className="tp-pricing-table__subject">{p.subject}</span>
                    <span className="tp-pricing-table__price">₹{p.pricePerHour}</span>
                    <span className="tp-pricing-table__price">₹{p.pricePerMonth}</span>
                  </div>
                ))}
                {tutor.pricing?.iitCoaching && (
                  <div className="tp-pricing-table__row tp-pricing-table__row--special">
                    <span className="tp-pricing-table__subject">
                      🎯 IIT JEE Coaching
                      {tutor.pricing.iitCoaching.discount > 0 && (
                        <span className="tp-pricing-table__discount">-{tutor.pricing.iitCoaching.discount}%</span>
                      )}
                    </span>
                    <span className="tp-pricing-table__price">₹{tutor.pricing.iitCoaching.pricePerHour}</span>
                    <span className="tp-pricing-table__price">₹{tutor.pricing.iitCoaching.pricePerMonth}</span>
                  </div>
                )}
                {tutor.pricing?.aimsCoaching && (
                  <div className="tp-pricing-table__row tp-pricing-table__row--special">
                    <span className="tp-pricing-table__subject">
                      🎯 AIMS Coaching
                      {tutor.pricing.aimsCoaching.discount > 0 && (
                        <span className="tp-pricing-table__discount">-{tutor.pricing.aimsCoaching.discount}%</span>
                      )}
                    </span>
                    <span className="tp-pricing-table__price">₹{tutor.pricing.aimsCoaching.pricePerHour}</span>
                    <span className="tp-pricing-table__price">₹{tutor.pricing.aimsCoaching.pricePerMonth}</span>
                  </div>
                )}
              </div>
            </motion.section>

            {/* Reviews */}
            <motion.section className="tp-section glass-card" {...fadeUp}>
              <h2 className="tp-section__title"><HiStar /> Reviews</h2>
              <div className="tp-reviews">
                {[
                  { name: "Arjun S.", rating: 5, text: "Excellent teacher! Very patient and explains concepts clearly. Improved my marks significantly.", date: "2 weeks ago" },
                  { name: "Priya M.", rating: 5, text: "Best tutor I've ever had. Methods are unique and effective for competitive exams.", date: "1 month ago" },
                  { name: "Rohit K.", rating: 4, text: "Great at problem solving. Helped me crack my doubts in Physics. Highly recommended.", date: "2 months ago" },
                ].map((review, i) => (
                  <div key={i} className="tp-review-item">
                    <div className="tp-review-item__header">
                      <div className="tp-review-item__avatar">{review.name.charAt(0)}</div>
                      <div>
                        <div className="tp-review-item__name">{review.name}</div>
                        <div className="tp-review-item__date">{review.date}</div>
                      </div>
                      <div className="tp-review-item__stars">
                        {[...Array(review.rating)].map((_, j) => (
                          <HiStar key={j} />
                        ))}
                      </div>
                    </div>
                    <p className="tp-review-item__text">{review.text}</p>
                  </div>
                ))}
              </div>
            </motion.section>
          </div>

          {/* ─── Right Sidebar ─── */}
          <div className="tp-content__sidebar">
            {/* Availability */}
            <motion.div className="tp-sidebar-card glass-card" {...fadeUp}>
              <h3 className="tp-sidebar-card__title"><HiCalendar /> Availability</h3>
              <div className="tp-availability">
                {days.map(day => (
                  <div key={day} className="tp-availability__row">
                    <span className="tp-availability__day">{day.slice(0, 3)}</span>
                    <span className="tp-availability__time">
                      {day === 'Sunday' ? (
                        <span className="tp-availability__off">Off</span>
                      ) : '09:00 AM — 09:00 PM'}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div className="tp-sidebar-card glass-card" {...fadeUp}>
              <h3 className="tp-sidebar-card__title"><HiAcademicCap /> Quick Stats</h3>
              <div className="tp-quick-stats">
                <div className="tp-quick-stat">
                  <span className="tp-quick-stat__value">{tutor.experience}+</span>
                  <span className="tp-quick-stat__label">Years Exp</span>
                </div>
                <div className="tp-quick-stat">
                  <span className="tp-quick-stat__value">{tutor.totalReviews}</span>
                  <span className="tp-quick-stat__label">Reviews</span>
                </div>
                <div className="tp-quick-stat">
                  <span className="tp-quick-stat__value">{tutor.rating}</span>
                  <span className="tp-quick-stat__label">Rating</span>
                </div>
                <div className="tp-quick-stat">
                  <span className="tp-quick-stat__value">{tutor.subjects.length}</span>
                  <span className="tp-quick-stat__label">Subjects</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorProfile;
