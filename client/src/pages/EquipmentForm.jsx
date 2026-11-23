import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import FormField from '../components/FormField.jsx';
import Notice from '../components/Notice.jsx';
import Loader from '../components/Loader.jsx';
import { api } from '../services/api.js';
import { validateEquipment } from '../utils/validation.js';

const blank = { name: '', category: '', location: '', price: '', brand: '', condition: '', fuel: '', icon: '🚜', description: '', imageUrl: '', imagePublicId: '' };

export default function EquipmentForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const [values, setValues] = useState(blank);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(editing);
  const [submitting, setSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!editing) return;
    let active = true;
    api(`/api/equipment/${encodeURIComponent(id)}`)
      .then(({ equipment }) => {
        if (active) setValues({ ...blank, ...equipment, price: String(equipment.price) });
      })
      .catch(err => { if (active) setMessage(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [editing, id]);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues(current => ({ ...current, [name]: value, ...(name === 'imageUrl' ? { imagePublicId: '' } : {}) }));
    setErrors(current => ({ ...current, [name]: '' }));
  }

  async function handleImageUpload() {
    if (!selectedImage) { setMessage('Choose an image file first.'); return; }
    const formData = new FormData();
    formData.append('image', selectedImage);
    setUploading(true); setMessage('');
    try {
      const result = await api('/api/uploads/equipment-image', { method: 'POST', body: formData });
      setValues(current => ({ ...current, imageUrl: result.imageUrl, imagePublicId: result.imagePublicId }));
      setMessage('Image uploaded successfully.');
      setSelectedImage(null);
    } catch (error) { setMessage(error.message); }
    finally { setUploading(false); }
  }

  async function handleSubmit(event) {
    event.preventDefault(); setMessage('');
    const validationErrors = validateEquipment(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) {
      setMessage('Please correct the highlighted fields.'); return;
    }
    setSubmitting(true);
    try {
      const result = await api(editing ? `/api/equipment/${encodeURIComponent(id)}` : '/api/equipment', {
        method: editing ? 'PUT' : 'POST', body: JSON.stringify(values)
      });
      navigate('/owner/equipment', { state: { notice: result.message } });
    } catch (err) {
      setErrors(err.fields || {}); setMessage(err.message);
    } finally { setSubmitting(false); }
  }

  if (loading) return <div className="container page-section"><Loader text="Loading listing..." /></div>;
  return <section className="container page-section narrow-page">
    <Link className="back-link" to="/owner/equipment">← My equipment</Link>
    <div className="page-heading"><span className="eyebrow">Share your machinery</span><h1>{editing ? 'Edit equipment' : 'List your equipment'}</h1><p>Add clear and accurate details so other farmers can find your listing.</p></div>
    <div className="surface-card form-card-wide"><Notice type="error">{message}</Notice>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <FormField label="Equipment name *" name="name" value={values.name} onChange={handleChange} error={errors.name} placeholder="e.g. John Deere Tractor" />
          <FormField label="Category *" name="category" as="select" value={values.category} onChange={handleChange} error={errors.category}><option value="">Select category</option>{['Tractor', 'Cultivator', 'Irrigation', 'Harvester', 'Sprayer', 'Other Tools'].map(x => <option key={x}>{x}</option>)}</FormField>
          <FormField label="Location *" name="location" value={values.location} onChange={handleChange} error={errors.location} placeholder="e.g. Pune" />
          <FormField label="Rental price per day (₹) *" name="price" type="number" min="1" max="10000000" step="1" value={values.price} onChange={handleChange} error={errors.price} placeholder="e.g. 1500" />
          <FormField label="Brand / Power" name="brand" value={values.brand} onChange={handleChange} error={errors.brand} placeholder="e.g. John Deere, 55 HP" />
          <FormField label="Condition *" name="condition" as="select" value={values.condition} onChange={handleChange} error={errors.condition}><option value="">Select condition</option><option>Excellent</option><option>Good</option><option>Fair</option></FormField>
          <FormField label="Fuel / Type" name="fuel" value={values.fuel} onChange={handleChange} error={errors.fuel} placeholder="e.g. Diesel" />
          <FormField label="Equipment icon" name="icon" as="select" value={values.icon} onChange={handleChange}><option>🚜</option><option>🌱</option><option>💧</option><option>🌾</option><option>🧴</option><option>🛠️</option></FormField>
        </div>
        <FormField label="Description *" name="description" as="textarea" rows="5" maxLength="600" value={values.description} onChange={handleChange} error={errors.description} placeholder="Describe the equipment and suitable farming tasks." />
        <div className="image-upload-panel">
          <div><strong>Equipment photograph</strong><p className="muted small">Upload JPG, PNG or WebP (maximum 5 MB), or paste a public HTTPS image URL.</p></div>
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={event => setSelectedImage(event.target.files?.[0] || null)} />
          <button type="button" className="button button-outline button-small" onClick={handleImageUpload} disabled={!selectedImage || uploading}>{uploading ? 'Uploading...' : 'Upload to Cloudinary'}</button>
          <FormField label="Image URL" name="imageUrl" type="url" value={values.imageUrl} onChange={handleChange} error={errors.imageUrl} placeholder="https://..." />
          {values.imageUrl && <img className="form-image-preview" src={values.imageUrl} alt="Equipment preview" />}
        </div>
        <div className="form-bottom-row"><small className="muted">{values.description.length}/600 characters</small><button className="button button-primary" disabled={submitting}>{submitting ? 'Saving...' : editing ? 'Save changes' : 'Publish equipment'}</button></div>
      </form>
    </div>
  </section>;
}
