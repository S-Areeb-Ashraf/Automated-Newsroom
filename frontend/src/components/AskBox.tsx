import { useState } from "react";
import { api } from "../api";
import type { AskResponse } from "../types";

export default function AskBox() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AskResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await api.ask(query.trim());
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch answer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="ask">
      <form className="ask__form" onSubmit={submit}>
        <input
          type="search"
          placeholder='Ask the newsroom: e.g. "Latest AI news this week"'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="ask__input"
        />
        <button type="submit" className="btn btn--primary" disabled={loading || !query.trim()}>
          {loading ? "Thinking…" : "Ask"}
        </button>
      </form>

      {error && <p className="ask__error">⚠️ {error}</p>}

      {result && (
        <div className="ask__result">
          <h3 className="ask__heading">Answer</h3>
          <p className="ask__answer">{result.answer}</p>
          {result.sources.length > 0 && (
            <>
              <h4 className="ask__heading ask__heading--small">Sources</h4>
              <ul className="ask__sources">
                {result.sources.map((s, i) => (
                  <li key={`${s.url}-${i}`} className="ask__source">
                    {s.image_url && (
                      <img src={s.image_url} alt="" className="ask__source-img" loading="lazy" />
                    )}
                    <div>
                      <a href={s.url} target="_blank" rel="noreferrer">
                        {s.title || s.url}
                      </a>
                      {s.source && <span className="ask__source-name"> · {s.source}</span>}
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </section>
  );
}
