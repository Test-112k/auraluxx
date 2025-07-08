import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { auth } from '@/contexts/AuthContext';
import { useAuth } from '@/contexts/AuthContext';

const LoginPage = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/');
    } catch (error: any) {
      setError(error.message || `${isSignUp ? 'Sign up' : 'Login'} failed`);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setConfirmPassword('');
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="login-container">
      <div className="login-background"></div>
      
      <button 
        onClick={goBack}
        className="back-button"
        aria-label="Go back"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
      
      <div className={`login-card ${isVisible ? 'slide-in' : ''}`}>
        <div className="login-header">
          <h1 className="login-title">{isSignUp ? 'Create Account' : 'Welcome Back'}</h1>
          <p className="login-subtitle">
            {isSignUp ? 'Sign up for a new account' : 'Sign in to your account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="neon-input"
              placeholder=" "
            />
            <label htmlFor="email" className="floating-label">Email Address</label>
          </div>

          <div className="input-group">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="neon-input"
              placeholder=" "
            />
            <label htmlFor="password" className="floating-label">Password</label>
          </div>

          {isSignUp && (
            <div className="input-group">
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="neon-input"
                placeholder=" "
              />
              <label htmlFor="confirmPassword" className="floating-label">Confirm Password</label>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            disabled={isLoading}
            className={`glow-button ${isLoading ? 'loading' : ''}`}
          >
            {isLoading ? (
              <span className="loading-spinner"></span>
            ) : (
              isSignUp ? 'Create Account' : 'Sign In'
            )}
          </button>
        </form>

        <div className="login-footer">
          <button 
            type="button"
            onClick={toggleMode}
            className="toggle-mode-button"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
          {!isSignUp && (
            <a href="#" className="forgot-link">Forgot your password?</a>
          )}
        </div>
      </div>

      <style>{`
        .login-container {
          min-height: 100vh;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          overflow: hidden;
          background: linear-gradient(135deg, #0c0c0c 0%, #1a0a2e 50%, #16213e 100%);
        }

        .login-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(circle at 20% 20%, rgba(120, 119, 198, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255, 115, 200, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 70%, rgba(0, 255, 180, 0.05) 0%, transparent 50%);
          filter: blur(60px);
        }

        .back-button {
          position: absolute;
          top: 20px;
          left: 20px;
          z-index: 20;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          padding: 12px;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .back-button:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }


        .login-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 40px;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          position: relative;
          z-index: 10;
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.6s ease;
        }

        .login-card.slide-in {
          opacity: 1;
          transform: translateY(0);
        }

        .login-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .login-title {
          font-size: 2.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 10px;
        }

        .login-subtitle {
          color: rgba(255, 255, 255, 0.7);
          font-size: 1rem;
          font-weight: 300;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }

        .input-group {
          position: relative;
        }

        .neon-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.03);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 16px 20px;
          font-size: 16px;
          color: white;
          outline: none;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .neon-input:focus {
          border-color: #667eea;
          box-shadow: 0 0 15px rgba(102, 126, 234, 0.3);
          background: rgba(255, 255, 255, 0.05);
        }

        .neon-input:focus + .floating-label,
        .neon-input:not(:placeholder-shown) + .floating-label {
          transform: translateY(-32px) scale(0.85);
          color: #667eea;
        }

        .floating-label {
          position: absolute;
          left: 20px;
          top: 50%;
          transform: translateY(-50%);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.6));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          pointer-events: none;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .glow-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 12px;
          padding: 16px 24px;
          font-size: 16px;
          font-weight: 600;
          color: white;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
          min-height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .glow-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
        }

        .glow-button:active {
          transform: translateY(0);
        }

        .glow-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .error-message {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 8px;
          padding: 12px 16px;
          color: #fca5a5;
          font-size: 14px;
          text-align: center;
          backdrop-filter: blur(10px);
        }

        .login-footer {
          text-align: center;
          margin-top: 30px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .toggle-mode-button {
          background: none;
          border: none;
          color: #667eea;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 8px;
          border-radius: 6px;
        }

        .toggle-mode-button:hover {
          background: rgba(102, 126, 234, 0.1);
          transform: translateY(-1px);
        }

        .forgot-link {
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .forgot-link:hover {
          color: #667eea;
        }


        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Mobile Responsive */
        @media (max-width: 480px) {
          .login-container {
            padding: 15px;
          }

          .login-card {
            padding: 30px 25px;
            border-radius: 16px;
          }

          .back-button {
            top: 15px;
            left: 15px;
            padding: 10px;
          }

          .login-title {
            font-size: 2rem;
          }

          .neon-input {
            padding: 14px 16px;
            font-size: 16px; /* Prevent zoom on iOS */
          }

          .floating-label {
            left: 16px;
          }

          .glow-button {
            padding: 14px 20px;
            min-height: 52px;
          }
        }

        @media (max-width: 360px) {
          .login-card {
            padding: 25px 20px;
          }

          .login-title {
            font-size: 1.8rem;
          }

          .back-button {
            padding: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;