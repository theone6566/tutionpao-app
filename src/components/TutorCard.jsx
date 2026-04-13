import { motion } from 'framer-motion';
import { HiStar, HiLocationMarker, HiShieldCheck, HiBadgeCheck } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import './TutorCard.css';

const TutorCard = ({ tutor, index = 0 }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const planColors = {
    premium: { bg: 'rgba(249,115,22,0.15)', color: 'var(--primary-400)', border: 'rgba(249,115,22,0.3)' },
    professional: { bg: 'rgba(99,102,241,0.15)', color: 'var(--accent-400)', border: 'rgba(99,102,241,0.3)' },
    basic: { bg: 'rgba(100,116,139,0.15)', color: 'var(--neutral-400)', border: 'rgba(100,116,139,0.3)' }
  };

  const plan = planColors[tutor.subscription?.plan] || planColors.basic;

  return (
    <motion.div
      className="tutor-card glass-card"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
    >
      <div className="tutor-card__header">
        <div className="tutor-card__avatar-wrap">
          <div className="tutor-card__avatar">
            {tutor.initials}
          </div>
          <div className={`tutor-card__status ${tutor.isOnline ? 'tutor-card__status--online' : ''}`} />
        </div>
        <div className="tutor-card__info">
          <div className="tutor-card__name-row">
            <h3 className="tutor-card__name">{tutor.name}</h3>
            {tutor.isVerified && (
              <HiShieldCheck className="tutor-card__verified" size={18} />
            )}
          </div>
          <div className="tutor-card__meta">
            <span className="tutor-card__rating">
              <HiStar className="tutor-card__star" />
              {tutor.rating} <span className="tutor-card__reviews">({tutor.totalReviews})</span>
            </span>
            <span className="tutor-card__divider">•</span>
            <span>{tutor.experience} yrs exp</span>
          </div>
          <div className="tutor-card__location">
            <HiLocationMarker size={14} />
            {tutor.area}, {tutor.city}
          </div>
        </div>
      </div>

      <div className="tutor-card__subjects">
        {tutor.subjects.map((sub) => (
          <span key={sub} className="badge badge-primary">{sub}</span>
        ))}
        {tutor.specialization.map((spec) => (
          <span key={spec} className="badge badge-accent">{spec}</span>
        ))}
      </div>

      <div className="tutor-card__qualification">
        <span className="tutor-card__qual-label">📎</span>
        <span>{tutor.qualifications[0]?.degree} in {tutor.qualifications[0]?.subject}</span>
        <span className="tutor-card__qual-uni">— {tutor.qualifications[0]?.university}</span>
      </div>

      <div className="tutor-card__pricing">
        <div className="tutor-card__price-item">
          <span className="tutor-card__price-label">From</span>
          <span className="tutor-card__price-value">
            ₹{Math.min(...(tutor.pricing?.bySubject?.map(p => p.pricePerHour) || [0]))}<span className="tutor-card__price-unit">/hr</span>
          </span>
        </div>
        <div className="tutor-card__price-item">
          <span className="tutor-card__price-label">Monthly</span>
          <span className="tutor-card__price-value">
            ₹{Math.min(...(tutor.pricing?.bySubject?.map(p => p.pricePerMonth) || [0]))}<span className="tutor-card__price-unit">/mo</span>
          </span>
        </div>
        {tutor.subscription?.plan && (
          <span
            className="tutor-card__plan-badge"
            style={{ background: plan.bg, color: plan.color, borderColor: plan.border }}
          >
            <HiBadgeCheck size={13} />
            {tutor.subscription.plan}
          </span>
        )}
      </div>

      <div className="tutor-card__actions">
        <Link to={`/tutor/${tutor.id}`} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
          View Profile
        </Link>
        <motion.button
          className="btn btn-primary btn-sm"
          style={{ flex: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Book Now
        </motion.button>
      </div>
    </motion.div>
  );
};

export default TutorCard;
