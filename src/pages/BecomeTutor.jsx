import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiArrowRight, HiCheckCircle, HiCurrencyRupee, HiUsers, HiGlobe, HiShieldCheck, HiChartBar } from 'react-icons/hi';
import { subscriptionPlans } from '../data/mockData';
import './BecomeTutor.css';

const BecomeTutor = () => {
  const benefits = [
    { icon: <HiUsers size={28} />, title: "Reach 10,000+ Students", desc: "Get discovered by students searching for tutors in your area and specialization." },
    { icon: <HiCurrencyRupee size={28} />, title: "Set Your Own Prices", desc: "Full control over your hourly and monthly rates for each subject you teach." },
    { icon: <HiGlobe size={28} />, title: "Online & Offline", desc: "Teach from home via video calls or in-person at the student's location." },
    { icon: <HiShieldCheck size={28} />, title: "Verified Profile", desc: "Aadhar verification builds trust and helps you stand out from competition." },
    { icon: <HiChartBar size={28} />, title: "Analytics Dashboard", desc: "Track your profile views, bookings, earnings, and student satisfaction scores." },
    { icon: <HiCheckCircle size={28} />, title: "Flexible Schedule", desc: "Set your availability and accept bookings that fit your schedule." },
  ];

  const steps = [
    { num: "01", title: "Create Your Profile", desc: "Add your qualifications, experience, subjects, and set your pricing." },
    { num: "02", title: "Get Verified", desc: "Complete Aadhar verification to earn a trusted badge on your profile." },
    { num: "03", title: "Choose a Plan", desc: "Pick a subscription plan that matches your teaching goals." },
    { num: "04", title: "Start Teaching", desc: "Accept student requests, conduct sessions, and grow your reputation." },
  ];

  return (
    <div className="become-tutor-page">
      <section className="bt-hero">
        <div className="bt-hero__bg">
          <div className="bt-hero__orb bt-hero__orb--1" />
          <div className="bt-hero__orb bt-hero__orb--2" />
        </div>
        <div className="container bt-hero__content">
          <motion.span className="badge badge-primary" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            For Educators
          </motion.span>
          <motion.h1 className="bt-hero__title" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
            Share Your Knowledge,<br /><span className="text-gradient">Grow Your Income</span>
          </motion.h1>
          <motion.p className="bt-hero__subtitle" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            Join 2,500+ verified tutors on India's fastest-growing tuition marketplace. Set your own prices, teach on your schedule.
          </motion.p>
          <motion.div className="bt-hero__actions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <Link to="/auth?mode=register" className="btn btn-primary btn-lg">Start Teaching Today <HiArrowRight /></Link>
            <a href="#plans" className="btn btn-secondary btn-lg">View Plans</a>
          </motion.div>
        </div>
      </section>

      <section className="section bt-benefits">
        <div className="container">
          <motion.div className="section__header" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="section__badge badge badge-accent">Benefits</span>
            <h2 className="section__title">Why Teach on <span className="text-gradient">TutionPao?</span></h2>
          </motion.div>
          <div className="bt-benefits__grid">
            {benefits.map((b, i) => (
              <motion.div key={i} className="bt-benefit-card glass-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -5 }}>
                <div className="bt-benefit-card__icon">{b.icon}</div>
                <h3>{b.title}</h3>
                <p>{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bt-steps">
        <div className="container">
          <motion.div className="section__header" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="section__badge badge badge-primary">Getting Started</span>
            <h2 className="section__title">How to <span className="text-gradient">Get Started</span></h2>
          </motion.div>
          <div className="bt-steps__grid">
            {steps.map((s, i) => (
              <motion.div key={i} className="bt-step-card glass-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                <span className="bt-step-card__num text-gradient">{s.num}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bt-plans" id="plans">
        <div className="container">
          <motion.div className="section__header" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="section__badge badge badge-primary">Plans</span>
            <h2 className="section__title">Choose Your <span className="text-gradient">Plan</span></h2>
          </motion.div>
          <div className="bt-plans__grid">
            {subscriptionPlans.map((plan, i) => (
              <motion.div key={plan.id} className={`bt-plan-card glass-card ${plan.popular ? 'bt-plan-card--popular' : ''}`} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} whileHover={{ y: -8 }}>
                {plan.popular && <div className="bt-plan-card__badge">Most Popular</div>}
                <h3 className="bt-plan-card__name">{plan.name}</h3>
                <p className="bt-plan-card__desc">{plan.description}</p>
                <div className="bt-plan-card__price">
                  <span className="bt-plan-card__currency">₹</span>
                  <span className="bt-plan-card__amount">{plan.price}</span>
                  <span className="bt-plan-card__period">/{plan.period}</span>
                </div>
                <ul className="bt-plan-card__features">
                  {plan.features.map((f, j) => (
                    <li key={j} className={f.included ? '' : 'disabled'}>
                      <HiCheckCircle size={16} /> {f.text}
                    </li>
                  ))}
                </ul>
                <Link to="/auth?mode=register" className={`btn ${plan.popular ? 'btn-primary' : 'btn-secondary'} btn-lg`} style={{ width: '100%' }}>
                  Get Started
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bt-cta">
        <div className="container">
          <motion.div className="bt-cta__card" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <h2>Ready to Start <span className="text-gradient">Teaching?</span></h2>
            <p>Join thousands of tutors already earning on TutionPao</p>
            <Link to="/auth?mode=register" className="btn btn-primary btn-lg">Create Free Account <HiArrowRight /></Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default BecomeTutor;
