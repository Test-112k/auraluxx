import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, Auth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const firebaseConfig = {
  apiKey: "AIzaSyAXAljTKnDI7MfiuV7oCQx7UZ86GxeQAyc",
  authDomain: "auraluxx-3d5c7.firebaseapp.com",
  projectId: "auraluxx-3d5c7",
  storageBucket: "auraluxx-3d5c7.firebasestorage.app",
  messagingSenderId: "753111617143",
  appId: "1:753111617143:web:4c7c750c4821ea68c04072",
  measurementId: "G-751HDJH783"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error: any) {
      setError(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background"></div>
      <div className="login-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>
      
      <div className={`login-card ${isVisible ? 'slide-in' : ''}`}>
        <div className="login-header">
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
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

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            disabled={isLoading}
            className={`glow-button ${isLoading ? 'loading' : ''}`}
          >
            {isLoading ? (
              <span className="loading-spinner"></span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="login-footer">
          <a href="#" className="forgot-link">Forgot your password?</a>
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
            radial-gradient(circle at 20% 20%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255, 115, 200, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 40% 70%, rgba(0, 255, 180, 0.1) 0%, transparent 50%);
          filter: blur(100px);
          animation: backgroundShift 20s ease-in-out infinite;
        }

        .login-orbs {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(2px);
          animation: float 6s ease-in-out infinite;
        }

        .orb-1 {
          width: 200px;
          height: 200px;
          background: linear-gradient(45deg, #ff6b9d, #c44569);
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }

        .orb-2 {
          width: 150px;
          height: 150px;
          background: linear-gradient(45deg, #4ecdc4, #44a08d);
          top: 60%;
          right: 10%;
          animation-delay: 2s;
        }

        .orb-3 {
          width: 100px;
          height: 100px;
          background: linear-gradient(45deg, #667eea, #764ba2);
          bottom: 20%;
          left: 60%;
          animation-delay: 4s;
        }

        .login-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 40px;
          width: 100%;
          max-width: 420px;
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          position: relative;
          z-index: 10;
          opacity: 0;
          transform: translateY(50px);
          transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
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
          animation: titleGlow 3s ease-in-out infinite alternate;
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
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          backdrop-filter: blur(10px);
        }

        .neon-input:focus {
          border-color: #667eea;
          box-shadow: 
            0 0 20px rgba(102, 126, 234, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
        }

        .neon-input:focus + .floating-label,
        .neon-input:not(:placeholder-shown) + .floating-label {
          transform: translateY(-32px) scale(0.85);
          color: #667eea;
          text-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
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
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
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
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          box-shadow: 
            0 4px 15px rgba(102, 126, 234, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          min-height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .glow-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 
            0 8px 25px rgba(102, 126, 234, 0.6),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
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
        }

        .forgot-link {
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .forgot-link:hover {
          color: #667eea;
          text-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
        }

        @keyframes backgroundShift {
          0%, 100% { transform: translateX(0) translateY(0) rotate(0deg); }
          25% { transform: translateX(-10px) translateY(-10px) rotate(1deg); }
          50% { transform: translateX(10px) translateY(10px) rotate(-1deg); }
          75% { transform: translateX(-5px) translateY(5px) rotate(0.5deg); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(120deg); }
          66% { transform: translateY(10px) rotate(240deg); }
        }

        @keyframes titleGlow {
          0% { text-shadow: 0 0 20px rgba(102, 126, 234, 0.5); }
          100% { text-shadow: 0 0 30px rgba(102, 126, 234, 0.8), 0 0 40px rgba(118, 75, 162, 0.6); }
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

          .orb-1 { width: 120px; height: 120px; }
          .orb-2 { width: 100px; height: 100px; }
          .orb-3 { width: 80px; height: 80px; }
        }

        @media (max-width: 360px) {
          .login-card {
            padding: 25px 20px;
          }

          .login-title {
            font-size: 1.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;