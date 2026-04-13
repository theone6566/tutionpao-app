import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiMail, HiLockClosed, HiUser, HiPhone, HiEye, HiEyeOff } from 'react-icons/hi';
import { FaGoogle } from 'react-icons/fa';
import './Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState('student');
  const [showPassword, setShowPassword] = useState(false);

  const slideVariants = {
    enter: (direction) => ({ x: direction > 0 ? 100 : -100, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({ x: direction > 0 ? -100 : 100, opacity: 0 })
  };

  return (
    <div className="auth-page">
      <div className="auth-page__bg">
        <div className="auth-page__orb auth-page__orb--1" />
        <div className="auth-page__orb auth-page__orb--2" />
        <div className="auth-page__grid" />
      </div>

      <div className="auth-page__container">
        <motion.div
          className="auth-card glass-card"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="auth-card__header">
            <Link to="/" className="auth-card__logo">
              <span>📚</span>
              <span>Tution<span className="text-gradient">Pao</span></span>
            </Link>
            <h1 className="auth-card__title">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="auth-card__subtitle">
              {isLogin ? 'Sign in to continue your learning journey' : 'Join India\'s #1 tuition marketplace'}
            </p>
          </div>

          {!isLogin && (
            <motion.div
              className="auth-card__user-type"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <button
                className={`auth-card__type-btn ${userType === 'student' ? 'active' : ''}`}
                onClick={() => setUserType('student')}
              >
                <span className="auth-card__type-icon">🎓</span>
                <span>I'm a Student</span>
              </button>
              <button
                className={`auth-card__type-btn ${userType === 'teacher' ? 'active' : ''}`}
                onClick={() => setUserType('teacher')}
              >
                <span className="auth-card__type-icon">👨‍🏫</span>
                <span>I'm a Teacher</span>
              </button>
            </motion.div>
          )}

          <form className="auth-card__form" onSubmit={(e) => e.preventDefault()}>
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="name"
                  className="auth-card__field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="auth-card__input-wrap">
                    <HiUser className="auth-card__input-icon" />
                    <input type="text" className="input-field" placeholder="Full Name" id="auth-name" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="auth-card__field">
              <div className="auth-card__input-wrap">
                <HiMail className="auth-card__input-icon" />
                <input type="email" className="input-field" placeholder="Email Address" id="auth-email" />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="phone"
                  className="auth-card__field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="auth-card__input-wrap">
                    <HiPhone className="auth-card__input-icon" />
                    <input type="tel" className="input-field" placeholder="Phone Number" id="auth-phone" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="auth-card__field">
              <div className="auth-card__input-wrap">
                <HiLockClosed className="auth-card__input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field"
                  placeholder="Password"
                  id="auth-password"
                />
                <button
                  type="button"
                  className="auth-card__eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <HiEyeOff size={18} /> : <HiEye size={18} />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="auth-card__extras">
                <label className="auth-card__remember">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="auth-card__forgot">Forgot password?</a>
              </div>
            )}

            <motion.button
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </motion.button>

            <div className="auth-card__divider">
              <span>or continue with</span>
            </div>

            <motion.button
              className="btn btn-secondary"
              style={{ width: '100%' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
            >
              <FaGoogle /> Google
            </motion.button>
          </form>

          <div className="auth-card__footer">
            <span>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </span>
            <button
              className="auth-card__toggle-btn"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
