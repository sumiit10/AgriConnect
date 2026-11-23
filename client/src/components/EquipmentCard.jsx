import { Link } from 'react-router-dom';
import { formatMoney } from '../services/api.js';

export default function EquipmentCard({ item, management = false, onDelete }) {
  return (
    <article className="equipment-card">
      <div className="equipment-art">
        {item.imageUrl ? <img className="equipment-photo" src={item.imageUrl} alt={item.name} loading="lazy" /> : <span className="equipment-emoji" aria-hidden="true">{item.icon || '🚜'}</span>}
        <span className={`pill ${item.available === false ? 'pill-muted' : 'pill-green'}`}>
          {item.available === false ? 'Unavailable' : 'Available'}
        </span>
      </div>
      <div className="equipment-card-body">
        <div className="eyebrow">{item.category}</div>
        <h3>{item.name}</h3>
        <p className="muted small">⌖ {item.location} · Owner: {item.ownerName || 'AgriConnect farmer'}</p>
        <p className="card-description">{item.description}</p>
        <div className="card-bottom">
          <div><strong className="price">{formatMoney(item.price)}</strong><span className="muted small"> / day</span></div>
          <Link className="button button-primary button-small" to={`/equipment/${encodeURIComponent(item.id)}`}>View details</Link>
        </div>
        {management && <div className="card-actions">
          <Link className="button button-outline button-small" to={`/owner/equipment/${encodeURIComponent(item.id)}/edit`}>Edit</Link>
          <button className="button button-danger button-small" onClick={() => onDelete?.(item)}>Delete</button>
        </div>}
      </div>
    </article>
  );
}
