import {useState, useEffect} from "react";
import './App.css';

function App() {
  const [apps, setApps] = useState([]);
  const [formData, setFormData] = useState({ nom: '', email: '', role: 'dev', motivation: '', portfolio: '', cv: '' });
  const [status, setStatus] = useState({ msg: '', type: ''});

  const fetchApps = async () => {
    try {
      const res = await fetch('http://localhost:5000/applications');
      const data = await res.join();
      setApps(data);
    } catch (err) { console.error("Erreur serveur", err); }
  };

  useEffect(() => { fetchApps(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setStatus({ msg: 'Candidature envoyée avec succès !', type: 'success' });
        setFormData({ nom: '', email: '', role: 'dev', motivation: '', portfolio: '', cv: '' });
        fetchApps();
      } else {
        setStatus({ msg: 'Veuillez remplir tous les champs.', type: 'error' })
      }
    } catch (err) { setStatus({ msg: 'Le serveur est déconnecté.', type: 'error' }); }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Vaybe - Recrutement</h1>
        <p>Gérez vos candidatures en toute simplicité</p>
      </header>

      <section className="card-section">
        <h2>Postuler maintenant</h2>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="input-group">
            <input placeholder="Nom complet" value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} required />
            <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
          </div>

          <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
            <option value="dev">Développeur Fullstack</option>
            <option value="designer">UI/UX Designer</option>
          </select>

          <textarea placeholder="Motivation (50 caractères min.)" value={formData.motivation} onChange={e => setFormData({...formData, motivation: e.target.value})} required />

          <input placeholder="Lien Portfolio / Github" value={formData.portfolio} onChange={e => setFormData({...formData, portfolio: e.target.value})} />

          <button type="submit" className="btn-submit">Soumettre mon dossier</button>

        </form>

        {status.msg && <p className="status-msg" style={{ color: status.type === 'success' ? '#2ecc71' : '#e74c3c' }}>{status.msg}</p>}

      </section>

      <section>
        <h2 style={{marginBottom: '20px'}}>Candidatures reçues ({apps.length})</h2>

        <div className="application-grid">
          {apps.map(a => (
            <div key={a.id} className={`app-card ${a.role}`}>
              <div className="card-header">
                <span className="score-badge">Score: {a.score}/3</span>
                <small>{a.role.toUpperCase()}</small>
              </div>

              <h3>{a.nom}</h3>
              <p style={{fontSize: '14px', color: '#666'}}>{a.email}</p>
              <p style={{fontSize: '13px', borderTop: '1px solid #eee', paddingTop: '10px', marginTop: '10px'}}>
                {a.motivation.length > 80 ? a.motivation.substring(0, 80) + '...' : a.motivation}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

export default App;