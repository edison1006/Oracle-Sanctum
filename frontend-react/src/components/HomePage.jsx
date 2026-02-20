import { translations } from '../utils/translations';

function HomePage({ onNavigate, language }) {
  const t = translations[language] || translations.zh;
  
  const features = [
    {
      id: "zodiac",
      title: t.zodiac.title,
      description: t.zodiac.description,
      icon: "♈",
    },
    {
      id: "tarot",
      title: t.tarot.title,
      description: t.tarot.description,
      icon: "🃏",
    },
    {
      id: "bazi",
      title: t.bazi.title,
      description: t.bazi.description,
      icon: "☯️",
    },
    {
      id: "palmface",
      title: t.palmFace.title,
      description: t.palmFace.description,
      icon: "✋",
    },
    {
      id: "numerology",
      title: t.numerology.title,
      description: t.numerology.description,
      icon: "🔢",
    },
  ];

  return (
    <main className="main">
      <div className="hero-card">
        <h1>{t.heroTitle}</h1>
        <p>{t.heroSubtitle}</p>
      </div>
      <div className="cards-grid">
        {features.map((feature) => (
          <button
            type="button"
            key={feature.id}
            className="feature-card"
            onClick={() => onNavigate(feature.id)}
          >
            <span className="card-icon" aria-hidden="true">{feature.icon}</span>
            <span className="card-title">{feature.title}</span>
            <span className="card-description">{feature.description}</span>
          </button>
        ))}
      </div>
    </main>
  );
}

export default HomePage;

