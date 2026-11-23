import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormField from '../components/FormField.jsx';
import Notice from '../components/Notice.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { validateRegistration } from '../utils/validation.js';

const initialValues = { name: '', email: '', phone: '', location: '', role: '', password: '', confirmPassword: '', terms: false };

export default function Register() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setValues(current => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
    setErrors(current => ({ ...current, [name]: '' }));
    setMessage('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validateRegistration(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) {
      setMessage('Please correct the highlighted fields.');
      return;
    }
    setSubmitting(true);
    try {
      const { terms, ...payload } = values;
      await register(payload);
      navigate('/login', { state: { notice: 'Registration successful. Please log in.' } });
    } catch (error) {
      setErrors(current => ({ ...current, ...(error.fields || {}) }));
      setMessage(error.message);
    } finally { setSubmitting(false); }
  }

  const passwordLength = values.password.length;
  const strength = passwordLength === 0 ? '' : passwordLength < 8 ? 'Weak' : passwordLength < 12 ? 'Fair' : 'Good';

  return <section className="auth-page container"><div className="auth-aside"><span className="auth-icon">🌱</span><span className="eyebrow light-eyebrow">Grow together</span><h1>Join the farmer community.</h1><p>Create an account as an equipment owner or as a farmer looking to rent.</p><div className="aside-points"><span>✓ Find equipment nearby</span><span>✓ Share machinery you own</span><span>✓ Manage rental requests</span></div></div>
    <div className="auth-card"><div className="form-heading"><span className="eyebrow">Create your account</span><h2>Welcome to AgriConnect</h2><p>Enter your details to get started.</p></div>
      <Notice type="error">{message}</Notice>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <FormField label="Full name" name="name" value={values.name} onChange={handleChange} error={errors.name} placeholder="e.g. Rahul Patil" autoComplete="name" />
          <FormField label="Email address" name="email" type="email" value={values.email} onChange={handleChange} error={errors.email} placeholder="you@example.com" autoComplete="email" />
          <FormField label="Mobile number" name="phone" type="tel" inputMode="numeric" maxLength={10} value={values.phone} onChange={handleChange} error={errors.phone} placeholder="10-digit mobile number" />
          <FormField label="Location" name="location" value={values.location} onChange={handleChange} error={errors.location} placeholder="e.g. Pune" />
          <FormField label="Account type" name="role" as="select" value={values.role} onChange={handleChange} error={errors.role}>
            <option value="">Choose account type</option><option value="owner">Equipment owner</option><option value="renter">Farmer / renter</option>
          </FormField>
          <div className="field"><label htmlFor="password">Password</label><div className="password-wrap"><input className={`form-control ${errors.password ? 'is-invalid' : ''}`} id="password" name="password" type={showPassword ? 'text' : 'password'} value={values.password} onChange={handleChange} autoComplete="new-password" placeholder="At least 8 characters" /><button type="button" className="password-toggle" onClick={() => setShowPassword(v => !v)}>{showPassword ? 'Hide' : 'Show'}</button></div>{errors.password && <small className="field-error">{errors.password}</small>}{strength && <small className={`field-hint strength-${strength.toLowerCase()}`}>Password length: {strength}</small>}</div>
          <FormField label="Confirm password" name="confirmPassword" type={showPassword ? 'text' : 'password'} value={values.confirmPassword} onChange={handleChange} error={errors.confirmPassword} placeholder="Enter password again" autoComplete="new-password" />
        </div>
        <label className="check-row"><input type="checkbox" name="terms" checked={values.terms} onChange={handleChange} /><span>I confirm that the details entered are correct.</span></label>
        {errors.terms && <small className="field-error terms-error">{errors.terms}</small>}
        <button className="button button-primary button-full" type="submit" disabled={submitting}>{submitting ? 'Creating account...' : 'Create account'}</button>
      </form>
      <p className="auth-switch">Already have an account? <Link to="/login">Log in</Link></p>
    </div>
  </section>;
}
