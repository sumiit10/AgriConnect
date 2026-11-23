import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import EquipmentCard from '../components/EquipmentCard.jsx';
import Loader from '../components/Loader.jsx';
import Notice from '../components/Notice.jsx';
import { api } from '../services/api.js';

export default function MyEquipment() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const location = useLocation();

  const loadItems = useCallback(async () => {
    setLoading(true); setMessage('');
    try {
      const result = await api('/api/equipment/mine');
      setItems(result.equipment || []);
    } catch (error) { setMessage(error.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadItems(); }, [loadItems]);

  async function deleteItem(item) {
    if (!window.confirm(`Delete “${item.name}”?`)) return;
    try {
      const result = await api(`/api/equipment/${encodeURIComponent(item.id)}`, { method: 'DELETE' });
      setItems(current => current.filter(entry => entry.id !== item.id));
      setMessage(result.message);
    } catch (error) { setMessage(error.message); }
  }

  return <section className="container page-section">
    <div className="page-heading-row"><div><span className="eyebrow">Owner workspace</span><h1>My equipment</h1><p>Manage the agricultural equipment you have listed.</p></div><Link className="button button-primary" to="/owner/equipment/new">＋ Add equipment</Link></div>
    {location.state?.notice && <Notice type="success">{location.state.notice}</Notice>}
    {message && <Notice type="info">{message}</Notice>}
    {loading ? <Loader text="Loading your listings..." /> : items.length ? <div className="equipment-grid">{items.map(item => <EquipmentCard key={item.id} item={item} management onDelete={deleteItem} />)}</div> : <div className="empty-panel"><span>🚜</span><h3>No listings yet</h3><p>Add your first piece of equipment to make it discoverable to other farmers.</p><Link className="button button-primary" to="/owner/equipment/new">Add equipment</Link></div>}
  </section>;
}
