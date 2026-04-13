import { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiSearch, HiArrowRight, HiStar, HiShieldCheck, HiLocationMarker, HiCheckCircle } from 'react-icons/hi';
import { FaGraduationCap, FaChalkboardTeacher, FaUserGraduate, FaRupeeSign } from 'react-icons/fa';
import TutorCard from '../components/TutorCard';
import { tutors, testimonials, subscriptionPlans, stats } from '../data/mockData';
import './Landing.css';

// ─── Animated Counter ──────────────────────
const AnimatedCounter = ({ value, label }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      className="stat-card glass-card"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, type: 'spring' }}
    >
      <span className="stat-card__value text-gradient">{value}</span>
      <span className="stat-card__label">{label}</span>
    </motion.div>
  );
};

// ─── Floating Particle ──────────────────────
const FloatingParticle = ({ size, top, left, delay, duration, color }) => (
  <motion.div
    className="hero__particle"
    style={{
      width: size,
      height: size,
      top,
      left,
      background: color || 'rgba(249, 115, 22, 0.3)',
      borderRadius: '50%',
      filter: `blur(${size > 10 ? 8 : 4}px)`
    }}
    animate={{
      y: [0, -30, 0],
      x: [0, 15, 0],
      opacity: [0.3, 0.8, 0.3],
    }}
    transition={{
      duration: duration || 5,
      delay: delay || 0,
      repeat: Infinity,
      ease: 'easeInOut'
    }}
  />
);

const Landing = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } }
  };

  const sectionRef = useRef(null);
  const isSectionInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const howItWorks = [
    { icon: <HiSearch size={28} />, title: "Search", desc: "Find verified tutors by subject, price, specialization & location" },
    { icon: <FaUserGraduate size={28} />, title: "Compare", desc: "View profiles, qualifications, ratings & transparent pricing" },
    { icon: <FaChalkboardTeacher size={28} />, title: "Book", desc: "Book trial sessions or monthly packages at the best rates" },
    { icon: <HiStar size={28} />, title: "Learn & Rate", desc: "Attend sessions, track progress & rate your experience" },
  ];

  return (
    <div className="landing">
      {/* ═══════════ HERO ═══════════ */}
      <section className="hero" ref={heroRef}>
        <div className="hero__bg">
          <div className="hero__gradient-orb hero__gradient-orb--1" />
          <div className="hero__gradient-orb hero__gradient-orb--2" />
          <div className="hero__gradient-orb hero__gradient-orb--3" />
          <div className="hero__grid-pattern" />
          <FloatingParticle size={20} top="15%" left="10%" delay={0} duration={6} />
          <FloatingParticle size={14} top="25%" left="80%" delay={1} duration={5} color="rgba(99,102,241,0.3)" />
          <FloatingParticle size={18} top="60%" left="20%" delay={2} duration={7} />
          <FloatingParticle size={12} top="70%" left="75%" delay={0.5} duration={4} color="rgba(99,102,241,0.3)" />
          <FloatingParticle size={16} top="40%" left="90%" delay={1.5} duration={6} />
          <FloatingParticle size={10} top="80%" left="50%" delay={3} duration={5} color="rgba(245,158,11,0.3)" />
        </div>

        <motion.div className="container hero__content" style={{ y: heroY, opacity: heroOpacity }}>
          <motion.div
            className="hero__badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <span className="hero__badge-dot" />
            India's #1 Tuition Marketplace
          </motion.div>

          <motion.h1
            className="hero__title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            Find the <span className="text-gradient">Perfect Tutor</span>
            <br />
            Near You
          </motion.h1>

          <motion.p
            className="hero__subtitle"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Connect with 2,500+ verified tutors for IIT JEE, NEET, AIMS & all subjects.
            <br />
            Transparent pricing. Genuine reviews. Tutors in your locality.
          </motion.p>

          <motion.div
            className="hero__search"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <div className="hero__search-inner">
              <HiSearch className="hero__search-icon" size={22} />
              <input
                type="text"
                className="hero__search-input"
                placeholder="Search by subject, tutor name, or specialization..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <motion.button
                className="btn btn-primary"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <HiSearch size={18} />
                Search
              </motion.button>
            </div>
            <div className="hero__search-tags">
              <span className="hero__search-label">Popular:</span>
              {['IIT JEE', 'NEET', 'Mathematics', 'Physics', 'Chemistry'].map((tag) => (
                <motion.button
                  key={tag}
                  className="hero__search-tag"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {tag}
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="hero__stats"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {stats.map((stat) => (
              <motion.div key={stat.label} className="hero__stat" variants={fadeUp}>
                <span className="hero__stat-value">{stat.value}</span>
                <span className="hero__stat-label">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <div className="hero__scroll-indicator">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="hero__scroll-mouse">
              <div className="hero__scroll-dot" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section className="section how-it-works" id="how-it-works" ref={sectionRef}>
        <div className="container">
          <motion.div
            className="section__header"
            initial={{ opacity: 0, y: 30 }}
            animate={isSectionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="section__badge badge badge-primary">Simple Process</span>
            <h2 className="section__title">
              How <span className="text-gradient">TutionPao</span> Works
            </h2>
            <p className="section__subtitle">
              Get started in 4 easy steps — from search to learning
            </p>
          </motion.div>

          <div className="how-it-works__grid">
            {howItWorks.map((step, i) => (
              <motion.div
                key={i}
                className="how-it-works__card glass-card"
                initial={{ opacity: 0, y: 40 }}
                animate={isSectionInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <div className="how-it-works__step-number">{String(i + 1).padStart(2, '0')}</div>
                <div className="how-it-works__icon">{step.icon}</div>
                <h3 className="how-it-works__title">{step.title}</h3>
                <p className="how-it-works__desc">{step.desc}</p>
                {i < howItWorks.length - 1 && (
                  <HiArrowRight className="how-it-works__arrow" size={20} />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURED TUTORS ═══════════ */}
      <section className="section featured-tutors">
        <div className="container">
          <motion.div
            className="section__header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="section__badge badge badge-accent">Top Rated</span>
            <h2 className="section__title">
              Featured <span className="text-gradient-accent">Tutors</span>
            </h2>
            <p className="section__subtitle">
              Hand-picked, verified tutors with proven track records
            </p>
          </motion.div>

          <div className="featured-tutors__grid">
            {tutors.slice(0, 6).map((tutor, i) => (
              <TutorCard key={tutor.id} tutor={tutor} index={i} />
            ))}
          </div>

          <motion.div
            className="featured-tutors__cta"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link to="/find-tutors" className="btn btn-secondary btn-lg">
              View All Tutors <HiArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ WHY CHOOSE US ═══════════ */}
      <section className="section why-choose">
        <div className="container">
          <motion.div
            className="section__header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="section__badge badge badge-success">Why Us</span>
            <h2 className="section__title">
              Why Students & Parents <span className="text-gradient">Trust Us</span>
            </h2>
          </motion.div>

          <div className="why-choose__grid">
            {[
              { icon: <HiShieldCheck size={32} />, title: "Aadhar Verified", desc: "Every tutor goes through mandatory Aadhar verification for safety" },
              { icon: <FaRupeeSign size={28} />, title: "Transparent Pricing", desc: "See exact pricing per hour and monthly — no hidden charges" },
              { icon: <HiLocationMarker size={32} />, title: "Location Based", desc: "Find tutors within walking distance of your home" },
              { icon: <HiStar size={32} />, title: "Genuine Reviews", desc: "Real ratings from students who've actually taken sessions" },
              { icon: <FaGraduationCap size={28} />, title: "IIT/NEET/AIMS Experts", desc: "Specialized coaches from IITs, AIIMS & top universities" },
              { icon: <HiCheckCircle size={32} />, title: "Free Trial Sessions", desc: "Book a trial session before committing to a long-term plan" },
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="why-choose__card glass-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
              >
                <div className="why-choose__icon">{feature.icon}</div>
                <h3 className="why-choose__title">{feature.title}</h3>
                <p className="why-choose__desc">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ PRICING PLANS ═══════════ */}
      <section className="section pricing" id="pricing">
        <div className="container">
          <motion.div
            className="section__header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section__badge badge badge-primary">For Teachers</span>
            <h2 className="section__title">
              Subscription <span className="text-gradient">Plans</span>
            </h2>
            <p className="section__subtitle">
              Choose the plan that fits your teaching goals
            </p>
          </motion.div>

          <div className="pricing__grid">
            {subscriptionPlans.map((plan, i) => (
              <motion.div
                key={plan.id}
                className={`pricing__card glass-card ${plan.popular ? 'pricing__card--popular' : ''}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                {plan.popular && (
                  <div className="pricing__popular-badge">Most Popular</div>
                )}
                <div className="pricing__card-header">
                  <h3 className="pricing__plan-name">{plan.name}</h3>
                  <p className="pricing__plan-desc">{plan.description}</p>
                  <div className="pricing__price">
                    <span className="pricing__currency">₹</span>
                    <span className="pricing__amount">{plan.price}</span>
                    <span className="pricing__period">/{plan.period}</span>
                  </div>
                </div>
                <ul className="pricing__features">
                  {plan.features.map((feat, j) => (
                    <li key={j} className={`pricing__feature ${feat.included ? '' : 'pricing__feature--disabled'}`}>
                      <HiCheckCircle size={16} />
                      {feat.text}
                    </li>
                  ))}
                </ul>
                <motion.button
                  className={`btn ${plan.popular ? 'btn-primary' : 'btn-secondary'} btn-lg`}
                  style={{ width: '100%' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get Started
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ TESTIMONIALS ═══════════ */}
      <section className="section testimonials">
        <div className="container">
          <motion.div
            className="section__header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section__badge badge badge-accent">Reviews</span>
            <h2 className="section__title">
              What Our <span className="text-gradient-accent">Users Say</span>
            </h2>
          </motion.div>

          <div className="testimonials__grid">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.id}
                className="testimonial-card glass-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
              >
                <div className="testimonial-card__stars">
                  {[...Array(t.rating)].map((_, j) => (
                    <HiStar key={j} className="testimonial-card__star" />
                  ))}
                </div>
                <p className="testimonial-card__text">"{t.text}"</p>
                <div className="testimonial-card__author">
                  <div className="testimonial-card__avatar">{t.initials}</div>
                  <div>
                    <div className="testimonial-card__name">{t.name}</div>
                    <div className="testimonial-card__role">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA SECTION ═══════════ */}
      <section className="section cta-section">
        <div className="container">
          <motion.div
            className="cta-card"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="cta-card__glow" />
            <motion.h2
              className="cta-card__title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Ready to Start Your <span className="text-gradient">Learning Journey?</span>
            </motion.h2>
            <motion.p
              className="cta-card__text"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              Join 10,000+ students already learning with the best tutors
            </motion.p>
            <motion.div
              className="cta-card__actions"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <Link to="/find-tutors" className="btn btn-primary btn-lg">
                Find a Tutor <HiArrowRight />
              </Link>
              <Link to="/become-tutor" className="btn btn-secondary btn-lg">
                Become a Tutor
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ STATS BAR ═══════════ */}
      <section className="section stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat) => (
              <AnimatedCounter key={stat.label} {...stat} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
