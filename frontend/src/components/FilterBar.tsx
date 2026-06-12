import { useState } from "react";
import type { FilterPayload } from "../types";

interface Props {
  categories: string[];
  countries: string[];
  onApply: (payload: FilterPayload) => void;
  onReset: () => void;
  busy?: boolean;
}

export default function FilterBar({ categories, countries, onApply, onReset, busy }: Props) {
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [keyword, setKeyword] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const apply = (e: React.FormEvent) => {
    e.preventDefault();
    onApply({
      category: category || undefined,
      country: country || undefined,
      keyword: keyword.trim() || undefined,
      date_from: dateFrom || undefined,
      date_to: dateTo || undefined,
    });
  };

  const reset = () => {
    setCategory("");
    setCountry("");
    setKeyword("");
    setDateFrom("");
    setDateTo("");
    onReset();
  };

  return (
    <form className="filter-bar" onSubmit={apply}>
      <input
        type="search"
        placeholder="Keyword (e.g. AI, election)"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="filter-bar__input filter-bar__input--keyword"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="filter-bar__input"
      >
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <select
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        className="filter-bar__input"
      >
        <option value="">All countries</option>
        {countries.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <input
        type="date"
        value={dateFrom}
        onChange={(e) => setDateFrom(e.target.value)}
        className="filter-bar__input"
        aria-label="From date"
      />
      <input
        type="date"
        value={dateTo}
        onChange={(e) => setDateTo(e.target.value)}
        className="filter-bar__input"
        aria-label="To date"
      />
      <div className="filter-bar__actions">
        <button type="submit" className="btn btn--primary" disabled={busy}>
          {busy ? "Filtering…" : "Apply"}
        </button>
        <button type="button" className="btn" onClick={reset} disabled={busy}>
          Reset
        </button>
      </div>
    </form>
  );
}
