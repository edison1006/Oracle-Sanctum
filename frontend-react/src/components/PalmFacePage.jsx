import { useState } from 'react';
import { translations } from '../utils/translations';
import { API_BASE } from '../utils/constants';

function PalmFacePage({ onBack, language }) {
  const t = translations[language] || translations.en;

  const [faceFile, setFaceFile] = useState(null);
  const [facePreview, setFacePreview] = useState(null);
  const [faceLoading, setFaceLoading] = useState(false);
  const [faceResult, setFaceResult] = useState(null);
  const [faceError, setFaceError] = useState(null);

  const [palmFile, setPalmFile] = useState(null);
  const [palmPreview, setPalmPreview] = useState(null);
  const [palmLoading, setPalmLoading] = useState(false);
  const [palmResult, setPalmResult] = useState(null);
  const [palmError, setPalmError] = useState(null);

  const acceptImages = 'image/jpeg,image/png,image/webp,image/gif';

  const handleFaceChange = (e) => {
    const file = e.target.files?.[0];
    setFaceFile(file || null);
    setFaceResult(null);
    setFaceError(null);
    if (facePreview) URL.revokeObjectURL(facePreview);
    setFacePreview(file ? URL.createObjectURL(file) : null);
  };

  const handlePalmChange = (e) => {
    const file = e.target.files?.[0];
    setPalmFile(file || null);
    setPalmResult(null);
    setPalmError(null);
    if (palmPreview) URL.revokeObjectURL(palmPreview);
    setPalmPreview(file ? URL.createObjectURL(file) : null);
  };

  const uploadOcr = async (endpoint, file) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || res.statusText);
    }
    return res.json();
  };

  const handleFaceSubmit = async (e) => {
    e.preventDefault();
    if (!faceFile) {
      setFaceError(t.palmFacePage.noFile);
      return;
    }
    setFaceError(null);
    setFaceLoading(true);
    try {
      const data = await uploadOcr('/ocr/face', faceFile);
      setFaceResult(data);
    } catch (err) {
      setFaceResult(null);
      setFaceError(`${t.palmFacePage.errorUpload}: ${err.message}`);
    } finally {
      setFaceLoading(false);
    }
  };

  const handlePalmSubmit = async (e) => {
    e.preventDefault();
    if (!palmFile) {
      setPalmError(t.palmFacePage.noFile);
      return;
    }
    setPalmError(null);
    setPalmLoading(true);
    try {
      const data = await uploadOcr('/ocr/palm', palmFile);
      setPalmResult(data);
    } catch (err) {
      setPalmResult(null);
      setPalmError(`${t.palmFacePage.errorUpload}: ${err.message}`);
    } finally {
      setPalmLoading(false);
    }
  };

  return (
    <main className="main">
      <button type="button" className="btn back-button" onClick={onBack}>
        ← {t.backToHome}
      </button>
      <div className="page-section">
        <h2>{t.palmFacePage.title}</h2>
        <p>{t.palmFacePage.description}</p>

        <div className="palm-face-grid">
          <section className="palm-face-card">
            <h3>{t.palmFacePage.uploadFace}</h3>
            <form onSubmit={handleFaceSubmit}>
              <div className="form-group">
                <label htmlFor="face-input">{t.palmFacePage.selectImage}</label>
                <input
                  id="face-input"
                  type="file"
                  accept={acceptImages}
                  onChange={handleFaceChange}
                  className="form-group-file"
                />
              </div>
              {facePreview && (
                <div className="upload-preview">
                  <img src={facePreview} alt="Face preview" />
                </div>
              )}
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!faceFile || faceLoading}
              >
                {faceLoading ? t.palmFacePage.analyzing : t.palmFacePage.uploadFace}
              </button>
            </form>
            {faceError && <p className="upload-error" role="alert">{faceError}</p>}
            {faceResult && (
              <div className="result-box">
                <strong>{t.palmFacePage.resultLabel}</strong>
                {faceResult.summary && <p>{faceResult.summary}</p>}
                {faceResult.raw_text && (
                  <pre className="result-pre">{faceResult.raw_text}</pre>
                )}
              </div>
            )}
          </section>

          <section className="palm-face-card">
            <h3>{t.palmFacePage.uploadPalm}</h3>
            <form onSubmit={handlePalmSubmit}>
              <div className="form-group">
                <label htmlFor="palm-input">{t.palmFacePage.selectImage}</label>
                <input
                  id="palm-input"
                  type="file"
                  accept={acceptImages}
                  onChange={handlePalmChange}
                  className="form-group-file"
                />
              </div>
              {palmPreview && (
                <div className="upload-preview">
                  <img src={palmPreview} alt="Palm preview" />
                </div>
              )}
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!palmFile || palmLoading}
              >
                {palmLoading ? t.palmFacePage.analyzing : t.palmFacePage.uploadPalm}
              </button>
            </form>
            {palmError && <p className="upload-error" role="alert">{palmError}</p>}
            {palmResult && (
              <div className="result-box">
                <strong>{t.palmFacePage.resultLabel}</strong>
                {palmResult.summary && <p>{palmResult.summary}</p>}
                {palmResult.raw_text && (
                  <pre className="result-pre">{palmResult.raw_text}</pre>
                )}
              </div>
            )}
          </section>
        </div>

        {!faceResult && !palmResult && !faceError && !palmError && (
          <p className="result-placeholder">{t.palmFacePage.resultPlaceholder}</p>
        )}
      </div>
    </main>
  );
}

export default PalmFacePage;
