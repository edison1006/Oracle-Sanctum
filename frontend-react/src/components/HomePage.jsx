import { useRef, useState } from 'react';
import { translations } from '../utils/translations';
import AlmanacWidget from './AlmanacWidget';
import HomeCarousel from './HomeCarousel';

function HomePage({ onNavigate, language }) {
  const t = translations[language] || translations.en;
  const gridRef = useRef(null);
  const [selectedZodiacId, setSelectedZodiacId] = useState('pisces');

  const zodiacSigns = t.todayHoroscope?.zodiacSigns ?? [];
  const signDates = t.todayHoroscope?.signDates ?? {};
  const currentSign = zodiacSigns.find((s) => s.id === selectedZodiacId) || zodiacSigns[0];
  const tabs = t.todayHoroscope?.tabs ?? { today: '今日', tomorrow: '明日', week: '本周', month: '本月', year: '今年', love: '爱情' };
  const summary = t.todayHoroscope?.sampleSummary ?? t.todayHoroscope?.luckReviewSample ?? '';

  const features = [
    { id: 'bazi', title: t.bazi.title, description: t.bazi.description, icon: '☯️' },
    { id: 'zodiac', title: t.zodiac.title, description: t.zodiac.description, icon: '♈' },
    { id: 'tarot', title: t.tarot.title, description: t.tarot.description, icon: '🃏' },
    { id: 'nametest', title: t.nameTest.title, description: t.nameTest.description, icon: '✍️' },
    { id: 'palmface', title: t.palmFace.title, description: t.palmFace.description, icon: '✋' },
    { id: 'daily', title: t.dailyFortune.title, description: t.dailyFortune.description, icon: '📅' },
  ];

  const freeGamesTitle = t.freeGames?.sectionTitle ?? 'Free Test Mini-Games';
  const freeGamesCards = [
    { id: 'futurepartner', title: t.futurePartner?.title, description: t.futurePartner?.description, icon: '💕' },
    { id: 'pastlife', title: t.pastLife?.title, description: t.pastLife?.description, icon: '🕰️' },
    { id: 'personality', title: t.personality?.title, description: t.personality?.description, icon: '📊' },
    { id: 'luckynumber', title: t.luckyNumber?.title, description: t.luckyNumber?.description, icon: '🍀' },
    { id: 'wealthindex', title: t.wealthIndex?.title, description: t.wealthIndex?.description, icon: '💰' },
    { id: 'babynaming', title: t.babyNaming?.title, description: t.babyNaming?.description, icon: '✍️' },
  ];

  return (
    <main className="main">
      <div className="home-top-grid">
        <div className="almanac-widget-wrap almanac-widget-wrap--with-checkin home-top-grid__left">
          <AlmanacWidget language={language} />
          <div className="almanac-widget-checkin">
            <span className="almanac-widget-checkin-icon" aria-hidden="true">✨</span>
            <span className="almanac-widget-checkin-title">{t.checkIn?.title}</span>
            <span className="almanac-widget-checkin-desc">{t.checkIn?.description}</span>
            <button type="button" className="almanac-widget-checkin-btn" onClick={() => onNavigate('checkin')}>
              {t.checkInPage?.checkInButton ?? t.checkIn?.title}
            </button>
          </div>
        </div>
        <div className="home-top-grid__carousel">
          <HomeCarousel language={language} onNavigate={onNavigate} />
        </div>
        <article className="feature-block feature-block--horoscope home-top-grid__left" aria-label={t.todayHoroscope?.title}>
          <div className="horoscope-card">
            <div className="horoscope-card__top">
              <nav className="horoscope-card__tabs" aria-label={t.todayHoroscope?.title}>
                <button type="button" className="horoscope-card__tab is-active">{tabs.today}</button>
                <button type="button" className="horoscope-card__tab">{tabs.tomorrow}</button>
                <button type="button" className="horoscope-card__tab">{tabs.week}</button>
                <button type="button" className="horoscope-card__tab">{tabs.month}</button>
                <button type="button" className="horoscope-card__tab">{tabs.year}</button>
                <button type="button" className="horoscope-card__tab">{tabs.love}</button>
              </nav>
              <span className="horoscope-card__pill">{currentSign?.name}</span>
            </div>
            <div className="horoscope-card__main">
              <div className="horoscope-card__left">
                <div className="horoscope-card__avatar" aria-hidden="true">
                  <span className="horoscope-card__avatar-symbol">{currentSign?.symbol}</span>
                </div>
                <p className="horoscope-card__sign-dates">{currentSign?.name} {signDates[selectedZodiacId] ?? ''}</p>
              </div>
              <div className="horoscope-card__content">
                <div className="horoscope-card__ratings">
                  <span>{t.todayHoroscope?.overallLuck}: ⭐⭐⭐⭐⭐</span>
                  <span>{t.todayHoroscope?.loveLuck}: ⭐⭐⭐⭐☆</span>
                  <span>{t.todayHoroscope?.careerLuck}: ⭐⭐⭐⭐☆</span>
                </div>
                <div className="horoscope-card__indices">
                  <span>{t.todayHoroscope?.wealthLuck}: ⭐⭐⭐⭐☆</span>
                  <span>{t.todayHoroscope?.healthIndex}: 69%</span>
                  <span>{t.todayHoroscope?.negotiationIndex}: 72%</span>
                </div>
                <p className="horoscope-card__summary">
                  {summary}
                  <button type="button" className="horoscope-card__more" onClick={() => onNavigate('zodiac')}>
                    {t.todayHoroscope?.moreDetails}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </article>
        <div className="home-feature-blocks-right home-top-grid__right">
          <article className="feature-block feature-block--rect">
            <div className="feature-block-head">
              <h3 className="feature-block-title">{t.deityConsultation?.title}</h3>
              <button type="button" className="feature-block-link" onClick={() => onNavigate('checkin')}>
                {t.deityConsultation?.linkTo} →
              </button>
            </div>
            <div className="feature-block-body feature-block--deity">
              {[
                { key: 'caishen', name: t.deityConsultation?.caishen, icon: '💰' },
                { key: 'yuelao', name: t.deityConsultation?.yuelao, icon: '💕' },
                { key: 'wenchang', name: t.deityConsultation?.wenchang, icon: '📜' },
                { key: 'guanyu', name: t.deityConsultation?.guanyu, icon: '⚔️' },
              ].map((d) => (
                <div key={d.key} className="deity-item">
                  <span className="deity-icon" aria-hidden="true">{d.icon}</span>
                  <span className="deity-offerings">— {t.deityConsultation?.offerings}</span>
                  <button type="button" className="feature-block-btn" onClick={() => onNavigate('checkin')}>
                    {t.deityConsultation?.askBtn}{d.name}
                  </button>
                </div>
              ))}
            </div>
          </article>
          <article className="feature-block feature-block--rect">
            <div className="feature-block-head">
              <h3 className="feature-block-title">{t.prayerLamps?.title}</h3>
              <button type="button" className="feature-block-link" onClick={() => onNavigate('daily')}>
                {t.prayerLamps?.linkTo} →
              </button>
            </div>
            <div className="feature-block-body feature-block--lamps">
              {[
                { key: 'peace', name: t.prayerLamps?.peaceLamp, icon: '🪔' },
                { key: 'fate', name: t.prayerLamps?.fateLamp, icon: '🪷' },
                { key: 'taisui', name: t.prayerLamps?.taisuiLamp, icon: '🔴' },
                { key: 'light', name: t.prayerLamps?.lightLamp, icon: '✨' },
              ].map((l) => (
                <div key={l.key} className="lamp-item">
                  <span className="lamp-icon" aria-hidden="true">{l.icon}</span>
                  <span className="lamp-name">{l.name}</span>
                  <span className="lamp-offerings">— {t.prayerLamps?.offerings}</span>
                  <button type="button" className="feature-block-btn" onClick={() => onNavigate('daily')}>
                    {t.prayerLamps?.lightBtn}
                  </button>
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
      <section className="cards-section" id="fortune-grid" ref={gridRef}>
        <div className="cards-grid">
          {features.map((feature) => (
            <button
              type="button"
              key={feature.id}
              className="feature-card"
              onClick={() => onNavigate(feature.id)}
            >
              <div className="card-figure">
                <span className="card-icon" aria-hidden="true">{feature.icon}</span>
              </div>
              <div className="card-body">
                <h3 className="card-title">{feature.title}</h3>
                <p className="card-description">{feature.description}</p>
                <span className="card-cta"><span className="card-cta-inner"><span className="card-cta-text">{t.cardExplore}</span><span className="card-arrow" aria-hidden="true">→</span></span></span>
              </div>
            </button>
          ))}
        </div>
      </section>
      <section className="cards-section cards-section--games" id="free-games">
        <h2 className="cards-section-title">{freeGamesTitle}</h2>
        <div className="cards-grid cards-grid--games">
          {freeGamesCards.map((card) => (
            <button
              type="button"
              key={card.id}
              className="feature-card"
              onClick={() => onNavigate(card.id)}
            >
              <div className="card-figure">
                <span className="card-icon" aria-hidden="true">{card.icon}</span>
              </div>
              <div className="card-body">
                <h3 className="card-title">{card.title}</h3>
                <p className="card-description">{card.description}</p>
                <span className="card-cta"><span className="card-cta-inner"><span className="card-cta-text">{t.cardExplore}</span><span className="card-arrow" aria-hidden="true">→</span></span></span>
              </div>
            </button>
          ))}
        </div>
      </section>
      <section className="cards-section cards-section--knowledge" id="knowledge-base">
        <div className="knowledge-cards-row">
          <button
            type="button"
            className="feature-card feature-card--knowledge"
            onClick={() => onNavigate('knowledge')}
          >
            <div className="card-figure">
              <span className="card-icon" aria-hidden="true">📚</span>
            </div>
            <div className="card-body">
              <h3 className="card-title">{t.knowledgeBase?.title}</h3>
              <p className="card-description">{t.knowledgeBase?.description}</p>
              <span className="card-cta"><span className="card-cta-inner"><span className="card-cta-text">{t.cardExplore}</span><span className="card-arrow" aria-hidden="true">→</span></span></span>
            </div>
          </button>
          <button
            type="button"
            className="feature-card feature-card--knowledge"
            onClick={() => onNavigate('knowledge')}
          >
            <div className="card-figure">
              <span className="card-icon" aria-hidden="true">📄</span>
            </div>
            <div className="card-body">
              <h3 className="card-title">{t.knowledgeArticles?.title}</h3>
              <p className="card-description">{t.knowledgeArticles?.description}</p>
              <span className="card-cta"><span className="card-cta-inner"><span className="card-cta-text">{t.cardExplore}</span><span className="card-arrow" aria-hidden="true">→</span></span></span>
            </div>
          </button>
        </div>
      </section>
      <section className="home-dashboard" aria-label={t.dashboard?.fortuneIndexTitle}>
        <div className="dashboard-card dashboard-card--index">
          <h3 className="dashboard-card-title">{t.dashboard?.fortuneIndexTitle}</h3>
          <div className="fortune-index-chart">
            {['love', 'career', 'wealth', 'health', 'overall'].map((key, i) => {
              const values = [78, 85, 72, 90, 82];
              const pct = values[i] ?? 80;
              return (
                <div key={key} className="fortune-index-row">
                  <span className="fortune-index-label">{t.dashboard?.indexLabels?.[key] ?? key}</span>
                  <div className="fortune-index-bar-wrap">
                    <div className="fortune-index-bar" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="fortune-index-value">{pct}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="dashboard-card dashboard-card--trending">
          <h3 className="dashboard-card-title">{t.dashboard?.trendingTitle}</h3>
          <ul className="trending-list">
            {(t.dashboard?.trendingItems ?? []).map((item, i) => (
              <li key={i}>
                <button type="button" className="trending-item" onClick={() => onNavigate('knowledge')}>
                  <span className="trending-item-title">{item.title}</span>
                  <span className="trending-item-heat">{item.heat}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
