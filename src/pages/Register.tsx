import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import toast from 'react-hot-toast';
import { UserPlus, Eye, EyeOff } from 'lucide-react';

export const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error: any) {
      console.error('Registration error:', error);
      let message = 'Failed to register';
      if (error.code === 'auth/email-already-in-use') message = 'Email is already in use';
      if (error.code === 'auth/weak-password') message = 'Password should be at least 6 characters';
      if (error.code === 'auth/network-request-failed') message = 'Network error. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-panel auth-box">
        <h2 style={{ textAlign: 'center', marginBottom: '24px' }} className="text-gradient">Create Account</h2>
        <form onSubmit={handleRegister}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <button 
                type="button" 
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }} disabled={loading}>
            {loading ? 'Creating account...' : <><UserPlus size={18}/> Register</>}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Login</Link>
        </p>
      </div>
    </div>
  );
};
