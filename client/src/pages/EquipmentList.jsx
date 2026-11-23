import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import EquipmentCard from '../components/EquipmentCard.jsx';
import Loader from '../components/Loader.jsx';
import Notice from '../components/Notice.jsx';
import { api } from '../services/api.js';

export default function EquipmentList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [sort, setSort] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      setError('');
      const params = new URLSearchParams({ search: search.trim(), category, location: location.trim(), sort });
      try {
        const result = await api(`/api/equipment?${params.toString()}`);
        setItems((result.equipment || []).filter(item => item.available !== false));
        setSearchParams(Object.fromEntries(params.entries()), { replace: true });
      } catch (err) { setError(err.message); }
      finally { setLoading(false); }
    }, 250);
    return () => clearTimeout(timer);
  }, [search, category, location, sort, setSearchParams]);

  function resetFilters() {
    setSearch(''); setCategory(''); setLocation(''); setSort('');
  }

  return <section className="container page-section">
    <div className="page-heading-row"><div><span className="eyebrow">Discover machinery near you</span><h1>Available equipment</h1><p>Search equipment shared by fellow farmers.</p></div><Link to="/owner/equipment/new" className="button button-primary">＋ List equipment</Link></div>
    <div className="filter-panel">
      <div className="field search-field"><label htmlFor="equipment-search">Search equipment</label><input id="equipment-search" className="form-control" type="search" placeholder="Name, brand, owner or description..." value={search} onChange={e => setSearch(e.target.value)} /></div>
      <div className="field"><label htmlFor="equipment-category">Category</label><select id="equipment-category" className="form-control" value={category} onChange={e => setCategory(e.target.value)}><option value="">All categories</option>{['Tractor', 'Cultivator', 'Irrigation', 'Harvester', 'Sprayer', 'Other Tools'].map(x => <option key={x}>{x}</option>)}</select></div>
      <div className="field"><label htmlFor="equipment-location">Location</label><input id="equipment-location" className="form-control" placeholder="e.g. Pune" value={location} onChange={e => setLocation(e.target.value)} /></div>
      <div className="field"><label htmlFor="equipment-sort">Sort by</label><select id="equipment-sort" className="form-control" value={sort} onChange={e => setSort(e.target.value)}><option value="">Recommended</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="name">Name: A to Z</option><option value="newest">Newest first</option></select></div>
      <button className="button button-outline reset-button" onClick={resetFilters}>Reset</button>
    </div>
    <div className="results-line"><span>{loading ? 'Searching...' : `${items.length} listing${items.length === 1 ? '' : 's'} found`}</span><span className="muted small">Results update as you change filters</span></div>
    {error && <Notice type="error">{error}</Notice>}
    {loading ? <Loader text="Finding equipment..." /> : items.length ? <div className="equipment-grid">{items.map(item => <EquipmentCard key={item.id} item={item} />)}</div> : <div className="empty-panel"><span>🔎</span><h3>No equipment found</h3><p>Try changing your search terms or clearing some filters.</p><button className="button button-outline" onClick={resetFilters}>Clear filters</button></div>}
  </section>;
}
