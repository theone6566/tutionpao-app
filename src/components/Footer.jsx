import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';
import { FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { label: 'Find Tutors', path: '/find-tutors' },
      { label: 'Become a Tutor', path: '/become-tutor' },
      { label: 'Pricing', path: '/pricing' },
      { label: 'How It Works', path: '/#how-it-works' },
    ],
    subjects: [
      { label: 'Mathematics', path: '/find-tutors?subject=Mathematics' },
      { label: 'Physics', path: '/find-tutors?subject=Physics' },
      { label: 'Chemistry', path: '/find-tutors?subject=Chemistry' },
      { label: 'Biology', path: '/find-tutors?subject=Biology' },
    ],
    coaching: [
      { label: 'IIT JEE', path: '/find-tutors?specialization=IIT JEE' },
      { label: 'NEET', path: '/find-tutors?specialization=NEET' },
      { label: 'AIMS', path: '/find-tutors?specialization=AIMS' },
      { label: 'Board Exam Prep', path: '/find-tutors?specialization=CBSE' },
    ],
    support: [
      { label: 'Help Center', path: '#' },
      { label: 'Privacy Policy', path: '#' },
      { label: 'Terms of Service', path: '#' },
      { label: 'Contact Us', path: '#' },
    ],
  };

  const socials = [
    { icon: <FaTwitter />, link: '#', label: 'Twitter' },
    { icon: <FaInstagram />, link: '#', label: 'Instagram' },
    { icon: <FaLinkedin />, link: '#', label: 'LinkedIn' },
    { icon: <FaYoutube />, link: '#', label: 'YouTube' },
  ];

  return (
    <footer className="footer">
      <div className="footer__glow" />
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <span className="footer__logo-icon">📚</span>
              <span className="footer__logo-text">
                Tution<span className="text-gradient">Pao</span>
              </span>
            </Link>
            <p className="footer__description">
              India's #1 tuition marketplace connecting students with verified tutors.
              Find the best IIT, NEET & AIMS coaching near you.
            </p>
            <div className="footer__contact-info">
              <div className="footer__contact-item">
                <HiMail size={16} />
                <span>support@tutionpao.com</span>
              </div>
              <div className="footer__contact-item">
                <HiPhone size={16} />
                <span>+91 98765 43210</span>
              </div>
              <div className="footer__contact-item">
                <HiLocationMarker size={16} />
                <span>Ghaziabad, UP, India</span>
              </div>
            </div>
            <div className="footer__socials">
              {socials.map((s, i) => (
                <motion.a
                  key={i}
                  href={s.link}
                  className="footer__social-link"
                  aria-label={s.label}
                  whileHover={{ scale: 1.15, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </div>

          <div className="footer__links-section">
            <h4 className="footer__links-title">Platform</h4>
            <ul className="footer__links-list">
              {footerLinks.platform.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="footer__link">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__links-section">
            <h4 className="footer__links-title">Subjects</h4>
            <ul className="footer__links-list">
              {footerLinks.subjects.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="footer__link">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__links-section">
            <h4 className="footer__links-title">Coaching</h4>
            <ul className="footer__links-list">
              {footerLinks.coaching.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="footer__link">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__links-section">
            <h4 className="footer__links-title">Support</h4>
            <ul className="footer__links-list">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="footer__link">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© {currentYear} TutionPao. All rights reserved. Made with ❤️ in India.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
