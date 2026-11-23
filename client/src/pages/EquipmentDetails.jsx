import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import FormField from '../components/FormField.jsx';
import Loader from '../components/Loader.jsx';
import Notice from '../components/Notice.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api, formatMoney, todayLocal } from '../services/api.js';
import { validateRental } from '../utils/validation.js';

export default function EquipmentDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const today = todayLocal();

  useEffect(() => {
    let active = true;
    api(`/api/equipment/${encodeURIComponent(id)}`)
      .then(result => { if (active) setItem(result.equipment); })
      .catch(err => { if (active) setMessage(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  const days = useMemo(() => {
    if (!startDate || !endDate || endDate < startDate) return 0;
    return Math.round((Date.parse(`${endDate}T00:00:00Z`) - Date.parse(`${startDate}T00:00:00Z`)) / 86400000) + 1;
  }, [startDate, endDate]);
  const total = days * Number(item?.price || 0);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage(''); setSuccess(false);
    const validationErrors = validateRental({ startDate, endDate, today });
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;
    if (!item) return setMessage('Equipment could not be loaded.');
    if (!user) return setMessage('Please log in before sending a rental request.');
    setSubmitting(true);
    try {
      const result = await api('/api/rentals', {
        method: 'POST', body: JSON.stringify({ equipmentId: item.id, startDate, endDate })
      });
      setMessage(result.message); setSuccess(true); setStartDate(''); setEndDate(''); setErrors({});
    } catch (err) {
      setMessage(err.message); setErrors(err.fields || {});
    } finally { setSubmitting(false); }
  }

  if (loading) return <div className="container page-section"><Loader text="Loading equipment details..." /></div>;
  if (!item) return <div className="container page-section"><Notice type="error">{message || 'Equipment not found.'}</Notice><Link className="text-link" to="/equipment">← Back to equipment</Link></div>;

  return <section className="container page-section">
    <Link className="back-link" to="/equipment">← Back to equipment</Link>
    <div className="detail-layout">
      <div className="detail-main"><div className="detail-illustration">{item.imageUrl ? <img className="detail-photo" src={item.imageUrl} alt={item.name} /> : <span>{item.icon || '🚜'}</span>}<span className={`pill ${item.available === false ? 'pill-muted' : 'pill-green'}`}>{item.available === false ? 'Unavailable' : 'Available'}</span></div>
        <div className="detail-content"><span className="eyebrow">{item.category}</span><h1>{item.name}</h1><p className="muted">⌖ {item.location} · Listed by {item.ownerName}</p><p className="detail-description">{item.description}</p>
          <div className="spec-grid"><div><small>Brand / Power</small><strong>{item.brand || 'Not specified'}</strong></div><div><small>Condition</small><strong>{item.condition}</strong></div><div><small>Fuel / Type</small><strong>{item.fuel || 'Not specified'}</strong></div><div><small>Daily rental</small><strong>{formatMoney(item.price)}</strong></div></div>
        </div>
      </div>
      <aside className="booking-card"><span className="eyebrow">Plan your rental</span><h2>{formatMoney(item.price)} <small>/ day</small></h2>
        {item.available === false ? <Notice type="error">This equipment is currently unavailable.</Notice> : <form onSubmit={handleSubmit} noValidate>
          <FormField label="Rental start date" name="startDate" type="date" min={today} value={startDate} onChange={e => { setStartDate(e.target.value); setErrors(current => ({ ...current, startDate: '' })); }} error={errors.startDate} />
          <FormField label="Rental end date" name="endDate" type="date" min={startDate || today} value={endDate} onChange={e => { setEndDate(e.target.value); setErrors(current => ({ ...current, endDate: '' })); }} error={errors.endDate} />
          <div className="total-box"><div><span>Duration</span><strong>{days} day{days === 1 ? '' : 's'}</strong></div><div><span>Estimated total</span><strong>{formatMoney(total)}</strong></div></div>
          <Notice type={success ? 'success' : 'error'}>{message}</Notice>
          {!user && <p className="small muted">You will need to <Link to="/login">log in</Link> to submit a request.</p>}
          <button className="button button-primary button-full" disabled={submitting || !user}>{submitting ? 'Sending request...' : 'Send rental request'}</button>
        </form>}
        <p className="small muted booking-note">The owner must accept your request before the rental is confirmed.</p>
      </aside>
    </div>
  </section>;
}
