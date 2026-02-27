/**
 * Tarot card with 3D flip: back (mystery) → front (card name).
 * Used on Tarot page for one-card draw.
 */
function TarotCardFlip({ card, isFlipped, isRevealing }) {
  return (
    <div className="tarot-card-wrap">
      <div
        className={`tarot-card-inner ${isFlipped ? "is-flipped" : ""} ${isRevealing ? "is-revealing" : ""}`}
        aria-hidden={!card}
      >
        <div className="tarot-card-face tarot-card-back">
          <div className="tarot-card-back-pattern" aria-hidden="true" />
          <span className="tarot-card-back-label">Oracle Sanctum</span>
        </div>
        <div className="tarot-card-face tarot-card-front">
          <span className="tarot-card-name">{card?.name ?? "—"}</span>
        </div>
      </div>
    </div>
  );
}

export default TarotCardFlip;
