import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { confirmPasswordReset } from 'firebase/auth';
import { FaLock } from 'react-icons/fa';

export default function ResetPassword({ onBackToLogin }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [oobCode, setOobCode] = useState(null);

  useEffect(() => {
    // Extract the action code from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('oobCode');
    if (code) {
      setOobCode(code);
    } else {
      setError('Invalid or missing password reset code.');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!oobCode) {
      setError('Invalid password reset link.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password should be at least 6 characters.');
      return;
    }

    setError('');
    setMessage('');
    setLoading(true);

    try {
      await confirmPasswordReset(auth, oobCode, password);
      setMessage('Your password has been successfully reset.');
      // Remove query parameters to clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] w-full">
      <div className="glass-card animate-slide-in w-full max-w-md">
        <h2 className="text-center mb-6">Reset Password</h2>
        
        {error && <div className="text-center mb-4" style={{ color: 'var(--danger-color)', fontSize: '0.9rem' }}>{error}</div>}
        {message && <div className="text-center mb-4" style={{ color: 'var(--success-color)', fontSize: '0.9rem' }}>{message}</div>}

        {!message ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-secondary" style={{ display: 'block', marginBottom: '4px' }}>New Password</label>
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

            <div>
              <label className="text-secondary" style={{ display: 'block', marginBottom: '4px' }}>Confirm Password</label>
              <div className="relative flex items-center">
                <FaLock className="absolute left-3 text-secondary" />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={{ paddingLeft: '32px' }}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-primary mt-4" 
              disabled={loading || !oobCode}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        ) : null}

        <div className="mt-6 text-center text-secondary" style={{ fontSize: '0.9rem' }}>
          <button 
            onClick={onBackToLogin}
            style={{ background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', padding: 0 }}
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
