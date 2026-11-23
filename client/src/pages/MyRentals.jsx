import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader.jsx';
import Notice from '../components/Notice.jsx';
import { api, formatMoney } from '../services/api.js';

function RequestCard({ request, mode, onUpdate }) {
  const terminal = ['Rejected', 'Cancelled'].includes(request.status);
  return <article className="request-card">
    <div className="request-card-head"><span className={`pill ${request.status === 'Accepted' ? 'pill-green' : terminal ? 'pill-muted' : 'pill-amber'}`}>{request.status}</span><span className="muted small">{request.id.slice(0, 18)}</span></div>
    <h3>{request.equipmentName}</h3>
    <p className="muted small">{mode === 'sent' ? `Owner: ${request.ownerName}` : `Requested by: ${request.renterName}`}</p>
    <div className="request-meta"><span>📅 {request.startDate} – {request.endDate}</span><span>{request.numberOfDays} day(s)</span><strong>{formatMoney(request.totalAmount)}</strong></div>
    {request.status === 'Pending' && <div className="card-actions">
      {mode === 'received' ? <><button className="button button-primary button-small" onClick={() => onUpdate(request.id, 'Accepted')}>Accept</button><button className="button button-danger button-small" onClick={() => onUpdate(request.id, 'Rejected')}>Reject</button></> : <button className="button button-outline button-small" onClick={() => onUpdate(request.id, 'Cancelled')}>Cancel request</button>}
    </div>}
  </article>;
}

export default function MyRentals() {
  const [data, setData] = useState({ sent: [], received: [] });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [tab, setTab] = useState('sent');

  const load = useCallback(async () => {
    setLoading(true); setMessage('');
    try { setData(await api('/api/rentals/mine')); }
    catch (error) { setMessage(error.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function updateStatus(id, status) {
    try {
      const result = await api(`/api/rentals/${encodeURIComponent(id)}/status`, {
        method: 'PATCH', body: JSON.stringify({ status })
      });
      setMessage(result.message);
      await load();
    } catch (error) { setMessage(error.message); }
  }

  const current = data[tab] || [];
  return <section className="container page-section">
    <div className="page-heading-row"><div><span className="eyebrow">Rental activity</span><h1>My rentals & requests</h1><p>Track requests you have sent and requests received for your equipment.</p></div><Link className="button button-primary" to="/equipment">Find equipment</Link></div>
    <div className="tabs"><button className={tab === 'sent' ? 'tab active' : 'tab'} onClick={() => setTab('sent')}>Requests I sent <span>{data.sent.length}</span></button><button className={tab === 'received' ? 'tab active' : 'tab'} onClick={() => setTab('received')}>Requests received <span>{data.received.length}</span></button></div>
    {message && <Notice type="info">{message}</Notice>}
    {loading ? <Loader text="Loading rental requests..." /> : current.length ? <div className="request-grid">{current.slice().reverse().map(request => <RequestCard key={request.id} request={request} mode={tab} onUpdate={updateStatus} />)}</div> : <div className="empty-panel"><span>📋</span><h3>{tab === 'sent' ? 'No requests sent yet' : 'No requests received'}</h3><p>{tab === 'sent' ? 'Explore equipment and send a rental request when you find what you need.' : 'When another farmer requests your equipment, it will appear here.'}</p>{tab === 'sent' && <Link className="button button-primary" to="/equipment">Browse equipment</Link>}</div>}
  </section>;
}
