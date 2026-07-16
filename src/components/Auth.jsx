import { useState } from 'react';
import { auth } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification
} from 'firebase/auth';
import { FaUserCircle, FaEnvelope, FaLock } from 'react-icons/fa';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        await updateProfile(user, {
          displayName: name,
          photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
        });
        
        await sendEmailVerification(user);
        setMessage('Account created! Please check your email for a verification link.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email to reset password');
      return;
    }
    try {
      const actionCodeSettings = {
        url: window.location.origin + '/reset-password',
        handleCodeInApp: true
      };
      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      setMessage('Password reset email sent! Check your inbox.');
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] w-full">
      <div className="glass-card animate-slide-in w-full max-w-md">
        <h2 className="text-center mb-6">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        
        {error && <div className="text-center mb-4" style={{ color: 'var(--danger-color)', fontSize: '0.9rem' }}>{error}</div>}
        {message && <div className="text-center mb-4" style={{ color: 'var(--success-color)', fontSize: '0.9rem' }}>{message}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <div>
              <label className="text-secondary" style={{ display: 'block', marginBottom: '4px' }}>Name</label>
              <div className="relative flex items-center">
                <FaUserCircle className="absolute left-3 text-secondary" />
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{ paddingLeft: '32px' }}
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-secondary" style={{ display: 'block', marginBottom: '4px' }}>Email</label>
            <div className="relative flex items-center">
              <FaEnvelope className="absolute left-3 text-secondary" />
              <input 
                type="email" 
                placeholder="you@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ paddingLeft: '32px' }}
              />
            </div>
          </div>

          <div>
            <label className="text-secondary" style={{ display: 'block', marginBottom: '4px' }}>Password</label>
            <div className="relative flex items-center">
              <FaLock className="absolute left-3 text-secondary" />
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingLeft: '32px' }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary mt-4" 
            disabled={loading}
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div className="mt-6 text-center text-secondary" style={{ fontSize: '0.9rem' }}>
          {isLogin ? (
            <>
              <p>
                Don't have an account?{' '}
                <button 
                  onClick={() => setIsLogin(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', padding: 0 }}
                >
                  Sign Up
                </button>
              </p>
              <p className="mt-2">
                <button 
                  onClick={handleForgotPassword}
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                >
                  Forgot Password?
                </button>
              </p>
            </>
          ) : (
            <p>
              Already have an account?{' '}
              <button 
                onClick={() => setIsLogin(true)}
                style={{ background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', padding: 0 }}
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
