import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
  const { initiatePayment, user } = useAppContext();
  const navigate = useNavigate();

  const handlePlanSelection = (plan) => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role === 'student') {
      alert("Students don't need a subscription! You can search for free.");
      return;
    }
    initiatePayment(plan.price, plan.name);
  };

  return (
    <div className="pricing-page">
      <section className="pricing-hero">
        <div className="pricing-hero__bg">
          <div className="pricing-hero__orb pricing-hero__orb--1" />
          <div className="pricing-hero__orb pricing-hero__orb--2" />
        </div>
        <div className="container pricing-hero__content">
          <motion.span className="badge badge-primary" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            Transparent Pricing
          </motion.span>
          <motion.h1 className="pricing-hero__title" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            Simple, <span className="text-gradient">Affordable</span> Plans
          </motion.h1>
          <motion.p className="pricing-hero__subtitle" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            For teachers — choose a plan that matches your goals. Students search for free!
          </motion.p>
        </div>
      </section>

      <section className="section pricing-plans">
        <div className="container">
          <div className="pricing-plans__grid">
            {subscriptionPlans.map((plan, i) => (
              <motion.div
                key={plan.id}
                className={`pricing-plan-card glass-card ${plan.popular ? 'pricing-plan-card--popular' : ''}`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                {plan.popular && <div className="pricing-plan-card__badge">Most Popular</div>}
                <div className="pricing-plan-card__header">
                  <h3>{plan.name}</h3>
                  <p>{plan.description}</p>
                  <div className="pricing-plan-card__price">
                    <span className="pricing-plan-card__currency">₹</span>
                    <span className="pricing-plan-card__amount">{plan.price}</span>
                    <span className="pricing-plan-card__period">/{plan.period}</span>
                  </div>
                </div>
                <ul className="pricing-plan-card__features">
                  {plan.features.map((f, j) => (
                    <li key={j} className={f.included ? '' : 'disabled'}>
                      <HiCheckCircle size={16} /> {f.text}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => handlePlanSelection(plan)} 
                  className={`btn ${plan.popular ? 'btn-primary' : 'btn-secondary'} btn-lg cursor-pointer`} 
                  style={{ width: '100%' }}
                >
                  {user?.isSubscribed ? 'Change Plan' : 'Get Started'} <HiArrowRight />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section pricing-faq">
        <div className="container">
          <motion.div className="section__header" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="section__title">Frequently Asked <span className="text-gradient">Questions</span></h2>
          </motion.div>
          <div className="pricing-faq__grid">
            {[
              { q: "Is it free for students?", a: "Yes! Students can search, view profiles, and contact tutors completely free of charge." },
              { q: "Can I change my plan later?", a: "Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately." },
              { q: "What payment methods are accepted?", a: "We accept UPI, debit/credit cards, net banking, and popular wallets via Razorpay." },
              { q: "Is there a free trial?", a: "New teachers get a 7-day free trial of the Professional plan to explore all features." },
              { q: "What commission does TutionPao charge?", a: "We charge a small 10% platform fee on session bookings. Subscription revenue is 100% used for platform growth." },
              { q: "Can I cancel anytime?", a: "Yes, you can cancel your subscription at any time. No lock-in contracts or hidden fees." },
            ].map((faq, i) => (
              <motion.div key={i} className="pricing-faq__item glass-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <h4>{faq.q}</h4>
                <p>{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
