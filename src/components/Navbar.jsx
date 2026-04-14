import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX } from 'react-icons/hi';
import { useAppContext } from '../context/AppContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAppContext();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/find-tutors', label: 'Find Tutors' },
    { path: '/become-tutor', label: 'Become a Tutor' },
    { path: '/pricing', label: 'Pricing' },
  ];

  return (
    <motion.nav
      className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo">
          <motion.div
            className="navbar__logo-icon"
            whileHover={{ rotate: 10, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            📚
          </motion.div>
          <span className="navbar__logo-text">
            Tution<span className="text-gradient">Pao</span>
          </span>
        </Link>

        <div className="navbar__links">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`navbar__link ${location.pathname === link.path ? 'navbar__link--active' : ''}`}
            >
              {link.label}
              {location.pathname === link.path && (
                <motion.div
                  className="navbar__link-indicator"
                  layoutId="navIndicator"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>

        <div className="navbar__actions">
          {user ? (
            <>
              <Link to="/dashboard" className="btn btn-secondary btn-sm">Dashboard</Link>
              <button 
                onClick={handleLogout} 
                className="btn btn-primary btn-sm"
                style={{ padding: '0.5rem 1rem' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">Log In</Link>
              <Link to="/login" className="btn btn-primary btn-sm">Sign Up Free</Link>
            </>
          )}
        </div>

        <button
          className="navbar__mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="navbar__mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={link.path}
                  className={`navbar__mobile-link ${location.pathname === link.path ? 'navbar__mobile-link--active' : ''}`}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <div className="navbar__mobile-actions">
              {user ? (
                <>
                  <Link to="/dashboard" className="btn btn-secondary" style={{ width: '100%' }}>Dashboard</Link>
                  <button 
                    onClick={handleLogout} 
                    className="btn btn-primary" 
                    style={{ width: '100%' }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn btn-secondary" style={{ width: '100%' }}>Log In</Link>
                  <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>Sign Up Free</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
