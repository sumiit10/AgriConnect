import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import FormField from '../components/FormField.jsx';
import Notice from '../components/Notice.jsx';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [values, setValues] = useState({ name: user?.name || '', phone: user?.phone || '', location: user?.location || '' });
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  function change(event) {
    const { name, value } = event.target;
    setValues(current => ({ ...current, [name]: value }));
    setErrors(current => ({ ...current, [name]: '' }));
  }

  async function submit(event) {
    event.preventDefault(); setMessage(''); setSuccess(false); setSaving(true);
    try {
      await updateProfile(values); setSuccess(true); setMessage('Your profile has been updated.');
    } catch (error) { setErrors(error.fields || {}); setMessage(error.message); }
    finally { setSaving(false); }
  }

  return <section className="container page-section narrow-page">
    <div className="page-heading"><span className="eyebrow">Account settings</span><h1>My profile</h1><p>Manage the contact details shown to the AgriConnect platform.</p></div>
    <div className="surface-card form-card-wide">
      <Notice type={success ? 'success' : 'error'}>{message}</Notice>
      <div className="profile-summary"><strong>{user?.name}</strong><span className="muted">{user?.email}</span><span className="pill pill-green">{user?.role === 'owner' ? 'Equipment owner' : 'Farmer / renter'}</span></div>
      <form onSubmit={submit} noValidate>
        <FormField label="Full name" name="name" value={values.name} onChange={change} error={errors.name} />
        <FormField label="Mobile number" name="phone" value={values.phone} onChange={change} error={errors.phone} />
        <FormField label="Location" name="location" value={values.location} onChange={change} error={errors.location} />
        <button className="button button-primary" disabled={saving}>{saving ? 'Saving...' : 'Save profile'}</button>
      </form>
    </div>
  </section>;
}
