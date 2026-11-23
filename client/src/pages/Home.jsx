import { Link } from 'react-router-dom';
import heroImage from '../images/image1.jpg';

const categories = [
  { icon: '🚜', name: 'Tractor' }, { icon: '🌱', name: 'Cultivator' },
  { icon: '💧', name: 'Irrigation' }, { icon: '🌾', name: 'Harvester' },
  { icon: '🧴', name: 'Sprayer' }, { icon: '🛠️', name: 'Other Tools' }
];

export default function Home() {
  return <>
    <section className="hero"><div className="container hero-grid">
      <div className="hero-copy"><span className="eyebrow light-eyebrow">A farmer-to-farmer platform</span>
        <h1>Good equipment.<br /><em>Better farming.</em></h1>
        <p>Find and rent agricultural equipment from farmers near you. Or list machinery you own and help another farmer get the job done.</p>
        <div className="hero-actions"><Link className="button button-white" to="/equipment">Find equipment <span>→</span></Link><Link className="button button-hero-outline" to="/register">Join AgriConnect</Link></div>
        <div className="hero-proof"><span>✓ Simple to use</span><span>✓ Farmer community</span><span>✓ Flexible rentals</span></div>
      </div>
      <div className="hero-visual">
  <img
    src={heroImage}
    alt="Agricultural tractor working in a farm"
    className="hero-image"
  />

  <div className="hero-note">
    <span>🌾</span>
    <div>
      <strong>Share more. Grow more.</strong>
      <small>Make machinery work for everyone.</small>
    </div>
  </div>
</div>
    </div></section>

    <section className="section container"><div className="section-heading"><div><span className="eyebrow">Explore the marketplace</span><h2>Find the right tool for the job</h2><p>Browse by equipment type to get started.</p></div><Link className="text-link" to="/equipment">View all equipment →</Link></div>
      <div className="category-grid">{categories.map(item => <Link className="category-card" key={item.name} to={`/equipment?category=${encodeURIComponent(item.name)}`}><span>{item.icon}</span><strong>{item.name}</strong><small>Explore listings ↗</small></Link>)}</div>
    </section>

    <section className="section section-tint"><div className="container"><div className="section-heading centered"><div><span className="eyebrow">How it works</span><h2>Four simple steps</h2><p>From finding machinery to sending a rental request.</p></div></div>
      <div className="steps-grid">{[
        ['01', 'Search', 'Find equipment by name, category or location.'],
        ['02', 'Compare', 'Review equipment details, condition and daily price.'],
        ['03', 'Request', 'Choose your dates and send a request to the owner.'],
        ['04', 'Connect', 'Track your request and wait for the owner response.']
      ].map(([number, title, desc]) => <article className="step-card" key={number}><span className="step-number">{number}</span><h3>{title}</h3><p>{desc}</p></article>)}</div>
    </div></section>

    <section className="section container"><div className="cta-panel"><div><span className="eyebrow light-eyebrow">Be part of the community</span><h2>Have equipment to share?</h2><p>List your agricultural machinery and connect with farmers who need it.</p></div><Link className="button button-white" to="/register">Get started <span>→</span></Link></div></section>
  </>;
}
