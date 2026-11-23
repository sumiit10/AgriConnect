import { Link } from 'react-router-dom';
import heroImage from '../images/image1.jpg';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const categories = [
  { icon: '🚜', name: 'Tractor' }, { icon: '🌱', name: 'Cultivator' },
  { icon: '💧', name: 'Irrigation' }, { icon: '🌾', name: 'Harvester' },
  { icon: '🧴', name: 'Sprayer' }, { icon: '🛠️', name: 'Other Tools' }
];

export default function Home() {
  const { language } = useLanguage();
  const { user } = useAuth();
  if (language === 'mr') return <MarathiHome user={user} />;
  return <>
    <section className="hero"><div className="container hero-grid">
      <div className="hero-copy"><span className="eyebrow light-eyebrow">A farmer-to-farmer platform</span>
        <h1>Good equipment.<br /><em>Better farming.</em></h1>
        <p>Find and rent agricultural equipment from farmers near you. Or list machinery you own and help another farmer get the job done.</p>
        <div className="hero-actions"><Link className="button button-white" to="/equipment">Find equipment <span>→</span></Link>{!user && <Link className="button button-hero-outline" to="/register">Join AgriConnect</Link>}</div>
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

    {!user && <section className="section container"><div className="cta-panel"><div><span className="eyebrow light-eyebrow">Be part of the community</span><h2>Have equipment to share?</h2><p>List your agricultural machinery and connect with farmers who need it.</p></div><Link className="button button-white" to="/register">Get started <span>→</span></Link></div></section>}
  </>;
}

function MarathiHome({ user }) {
  return <>
    <section className="hero"><div className="container hero-grid"><div className="hero-copy"><span className="eyebrow light-eyebrow">शेतकऱ्यांसाठी शेतकऱ्यांचे व्यासपीठ</span><h1>चांगली उपकरणे.<br /><em>उत्तम शेती.</em></h1><p>तुमच्या जवळील शेतकऱ्यांकडून कृषी उपकरणे शोधा आणि भाड्याने घ्या. किंवा तुमची यंत्रसामग्री सूचीबद्ध करून दुसऱ्या शेतकऱ्याला मदत करा.</p><div className="hero-actions"><Link className="button button-white" to="/equipment">उपकरणे शोधा <span>→</span></Link>{!user && <Link className="button button-hero-outline" to="/register">AgriConnect मध्ये सामील व्हा</Link>}</div><div className="hero-proof"><span>✓ वापरण्यास सोपे</span><span>✓ शेतकरी समुदाय</span><span>✓ लवचिक भाडे</span></div></div><div className="hero-visual"><img src={heroImage} alt="शेतात काम करणारा ट्रॅक्टर" className="hero-image" /><div className="hero-note"><span>🌾</span><div><strong>अधिक वाटा. अधिक वाढवा.</strong><small>यंत्रसामग्री सर्वांसाठी उपयुक्त बनवा.</small></div></div></div></div></section>
    <section className="section container"><div className="section-heading"><div><span className="eyebrow">मार्केटप्लेस एक्सप्लोर करा</span><h2>कामासाठी योग्य साधन शोधा</h2><p>सुरुवात करण्यासाठी उपकरणांच्या प्रकारानुसार पहा.</p></div><Link className="text-link" to="/equipment">सर्व उपकरणे पहा →</Link></div><div className="category-grid">{categories.map(item => <Link className="category-card" key={item.name} to={`/equipment?category=${encodeURIComponent(item.name)}`}><span>{item.icon}</span><strong>{item.name}</strong><small>यादी पहा →</small></Link>)}</div></section>
    <section className="section section-tint"><div className="container"><div className="section-heading centered"><div><span className="eyebrow">हे कसे कार्य करते</span><h2>चार सोप्या पायऱ्या</h2><p>यंत्रसामग्री शोधण्यापासून भाड्याची विनंती पाठवण्यापर्यंत.</p></div></div><div className="steps-grid">{[['०१','शोधा','नाव, प्रकार किंवा ठिकाणानुसार उपकरणे शोधा.'],['०२','तुलना करा','उपकरणांची माहिती, स्थिती आणि दर तपासा.'],['०३','विनंती करा','तारखा निवडून मालकाला विनंती पाठवा.'],['०४','जोडले जा','तुमची विनंती आणि मालकाचा प्रतिसाद पहा.']].map(([number,title,desc]) => <article className="step-card" key={number}><span className="step-number">{number}</span><h3>{title}</h3><p>{desc}</p></article>)}</div></div></section>
    {!user && <section className="section container"><div className="cta-panel"><div><span className="eyebrow light-eyebrow">समुदायाचा भाग बना</span><h2>तुमच्याकडे शेअर करण्यासाठी उपकरणे आहेत?</h2><p>तुमची कृषी यंत्रसामग्री सूचीबद्ध करा आणि गरजू शेतकऱ्यांशी जोडा.</p></div><Link className="button button-white" to="/register">सुरुवात करा <span>→</span></Link></div></section>}
  </>;
}
