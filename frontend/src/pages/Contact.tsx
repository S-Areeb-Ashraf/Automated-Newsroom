import { useState } from "react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Name, email and message are required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError(null);
    setSubmitted(true);
  };

  const reset = () => {
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    setSubmitted(false);
    setError(null);
  };

  return (
    <main className="page page--contact">
      <section className="page__hero">
        <div className="container">
          <span className="hero__eyebrow">Contact</span>
          <h1 className="page__title">Let's talk.</h1>
          <p className="page__lede">
            Questions, feedback, partnerships or bug reports — drop us a line and we'll
            get back to you within a couple of business days.
          </p>
        </div>
      </section>

      <section className="container page__section">
        <div className="contact-grid">
          <div className="contact-info">
            <h2>Reach the team</h2>
            <ul className="contact-info__list">
              <li>
                <span className="contact-info__icon" aria-hidden>📧</span>
                <div>
                  <strong>Email</strong>
                  <a href="mailto:syedareebashraf243@gmail.com">syedareebashraf243@gmail.com</a>
                </div>
              </li>
              <li>
                <span className="contact-info__icon" aria-hidden>💬</span>
                <div>
                  <strong>Telephone</strong>
                  <a href="tel:+923363251666">+92 (336) 325-1666</a>
                </div>
              </li>
              <li>
                <span className="contact-info__icon" aria-hidden>🌐</span>
                <div>
                  <strong>Website</strong>
                  <a href="https://areebashraf-portfolio.netlify.app/" rel="noreferrer" target="_blank">
                    areebashraf-portfolio.netlify.app
                  </a>
                </div>
              </li>
              <li>
                <span className="contact-info__icon" aria-hidden>📍</span>
                <div>
                  <strong>Address</strong>
                  {/* <span>Remote-first · Worldwide</span> */}
                  <span>NewYork, USA</span>
                </div>
              </li>
            </ul>
          </div>

          <form className="contact-form card" onSubmit={submit}>
            {submitted ? (
              <div className="contact-success">
                <span className="contact-success__icon" aria-hidden>✅</span>
                <h3>Message sent</h3>
                <p>Thanks {name.split(" ")[0] || "friend"} — we'll be in touch shortly.</p>
                <button type="button" className="btn" onClick={reset}>
                  Send another
                </button>
              </div>
            ) : (
              <>
                <div className="form-row">
                  <label>
                    <span>Name</span>
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ada Lovelace" />
                  </label>
                  <label>
                    <span>Email</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                    />
                  </label>
                </div>
                <label>
                  <span>Subject</span>
                  <input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="What's this about?"
                  />
                </label>
                <label>
                  <span>Message</span>
                  <textarea
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what's on your mind…"
                  />
                </label>
                {error && <p className="alert alert--error">⚠️ {error}</p>}
                <button type="submit" className="btn btn--primary btn--full">
                  Send message
                </button>
              </>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}
