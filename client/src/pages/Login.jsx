import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import FormField from '../components/FormField.jsx';
import Notice from '../components/Notice.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { validateLogin } from '../utils/validation.js';

export default function Login() {
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function handleChange(event) {
    const { name, value } = event.target;
    setValues(current => ({ ...current, [name]: value }));
    setErrors(current => ({ ...current, [name]: '' }));
    setMessage('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validateLogin(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) {
      setMessage('Please correct the highlighted fields.');
      return;
    }
    setSubmitting(true);
    try {
      const user = await login(values);
      navigate(user.role === 'owner' ? '/owner/equipment' : '/equipment', { replace: true });
    } catch (error) {
      setErrors(error.fields || {});
      setMessage(error.message);
    } finally { setSubmitting(false); }
  }

  return <section className="auth-page auth-page-login container"><div className="auth-aside"><span className="auth-icon">🌾</span><span className="eyebrow light-eyebrow">Welcome back</span><h1>Good to see you again.</h1><p>Log in to manage your equipment, discover listings and keep track of rental requests.</p></div>
    <div className="auth-card"><div className="form-heading"><span className="eyebrow">Your AgriConnect account</span><h2>Log in</h2><p>Use the email and password you registered with.</p></div>
      {location.state?.notice && <Notice type="success">{location.state.notice}</Notice>}
      <Notice type="error">{message}</Notice>
      <form onSubmit={handleSubmit} noValidate>
        <FormField label="Email address" name="email" type="email" value={values.email} onChange={handleChange} error={errors.email} placeholder="you@example.com" autoComplete="email" />
        <div className="field"><label htmlFor="password">Password</label><div className="password-wrap"><input className={`form-control ${errors.password ? 'is-invalid' : ''}`} id="password" name="password" type={showPassword ? 'text' : 'password'} value={values.password} onChange={handleChange} autoComplete="current-password" placeholder="Your password" /><button type="button" className="password-toggle" onClick={() => setShowPassword(v => !v)}>{showPassword ? 'Hide' : 'Show'}</button></div>{errors.password && <small className="field-error">{errors.password}</small>}</div>
        <button className="button button-primary button-full" type="submit" disabled={submitting}>{submitting ? 'Logging in...' : 'Log in'}</button>
      </form>
      <p className="auth-switch">New to AgriConnect? <Link to="/register">Create an account</Link></p>
    </div>
  </section>;
}
