import { useState, useCallback } from 'react';
import { translations } from '../utils/translations';
import { TAROT_DECK } from '../utils/constants';
import { sample } from '../utils/helpers';
import { API_BASE } from '../utils/constants';
import TarotCardFlip from './TarotCardFlip';

function TarotPage({ onBack, language }) {
  const t = translations[language] || translations.zh;
  const [card, setCard] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [interpretation, setInterpretation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState('');

  const draw = useCallback(async () => {
    const drawn = sample(TAROT_DECK);
    setCard(drawn);
    setInterpretation(null);
    setIsFlipped(false);
    setIsRevealing(true);
    // Flip after a short delay
    setTimeout(() => {
      setIsFlipped(true);
      setIsRevealing(false);
    }, 600);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/tarot/interpret`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          card_name: drawn.name,
          question: question.trim() || null,
          language: language === 'zh' ? 'zh' : language === 'mi' ? 'mi' : 'en',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setInterpretation(data);
      }
    } catch (_) {
      setInterpretation({
        judgment: drawn.message,
        advice: '',
        lucky_color: '',
        keywords: [],
      });
    } finally {
      setLoading(false);
    }
  }, [question, language]);

  return (
    <main className="main tarot-page sanctum-dark">
      <button type="button" className="btn back-button" onClick={onBack}>
        ← {t.backToHome}
      </button>
      <div className="page-section tarot-page-section">
        <h2 className="tarot-page-title">{t.tarotPage.title}</h2>
        <p className="tarot-page-desc">{t.tarotPage.description}</p>

        <div className="tarot-question-wrap">
          <input
            type="text"
            className="tarot-question-input"
            placeholder={t.tarotPage.questionPlaceholder}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            aria-label={t.tarotPage.questionPlaceholder}
          />
        </div>

        <div className="tarot-draw-area">
          <TarotCardFlip card={card} isFlipped={isFlipped} isRevealing={isRevealing} />
          {!card ? (
            <button type="button" className="btn btn-primary tarot-draw-btn" onClick={draw}>
              {t.tarotPage.drawButton}
            </button>
          ) : (
            <>
              {loading && (
                <p className="tarot-interpreting" role="status" aria-live="polite">
                  {t.tarotPage.interpreting}
                </p>
              )}
              {interpretation && !loading && (
                <div className="tarot-result">
                  <div className="tarot-result-card tarot-result-judgment">
                    <span className="tarot-result-label">{t.tarotPage.judgmentLabel}</span>
                    <p className="tarot-result-text">{interpretation.judgment}</p>
                  </div>
                  <div className="tarot-result-card tarot-result-advice">
                    <span className="tarot-result-label">{t.tarotPage.adviceLabel}</span>
                    <p className="tarot-result-text">{interpretation.advice}</p>
                  </div>
                  <div className="tarot-result-meta">
                    <span className="tarot-lucky-color">
                      <span className="tarot-result-label">{t.tarotPage.luckyColorLabel}</span>
                      <span className="tarot-lucky-color-value">{interpretation.lucky_color}</span>
                    </span>
                    {interpretation.keywords?.length > 0 && (
                      <span className="tarot-keywords">
                        <span className="tarot-result-label">{t.tarotPage.keywordsLabel}</span>
                        <span className="tarot-keywords-list">
                          {interpretation.keywords.join(' · ')}
                        </span>
                      </span>
                    )}
                  </div>
                  <button type="button" className="btn btn-secondary tarot-draw-again" onClick={draw}>
                    {t.tarotPage.drawAgain}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <p className="tarot-disclaimer" role="note">
          {t.tarotPage.disclaimer}
        </p>
      </div>
    </main>
  );
}

export default TarotPage;
