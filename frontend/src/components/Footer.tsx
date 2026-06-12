import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner container">
        <div className="footer__col footer__col--brand">
          <div className="footer__brand">
            <span aria-hidden>𝔽</span>
            <strong>Faxum Press</strong>
          </div>
          <p className="footer__about">
            An AI-powered, self-updating newsroom. Trending topics, smart summaries,
            and contextual Q&amp;A across global news sources — refreshed every 30 minutes.
          </p>
        </div>

        <div className="footer__col">
          <h4 className="footer__heading">Product</h4>
          <ul>
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li>
              <a href="http://localhost:8000/docs" target="_blank" rel="noreferrer">
                API Reference
              </a>
            </li>
          </ul>
        </div>

        <div className="footer__col">
          <h4 className="footer__heading">Stack</h4>
          <ul>
            <li>FastAPI · httpx</li>
            <li>LangChain · RAG</li>
            <li>HuggingFace · ChromaDB</li>
            <li>React · Vite · TypeScript</li>
          </ul>
        </div>

        <div className="footer__col">
          <h4 className="footer__heading">Stay in touch</h4>
          <ul>
            <li><a href="mailto:syedareebashraf243@gmail.com">syedareebashraf243@gmail.com</a></li>
            <li><a href="https://areebashraf-portfolio.netlify.app/" rel="noreferrer">PortFolio</a></li>
            <li><a href="https://github.com/S-Areeb-Ashraf" rel="noreferrer">GitHub</a></li>
            <li><a href="https://www.linkedin.com/in/syed-areebashraf" rel="noreferrer">LinkedIn</a></li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom container">
        <span>© {new Date().getFullYear()} Faxum Press — Educational project.</span>
        <span>Built with FastAPI · LangChain · RAG · React</span>
      </div>
    </footer>
  );
}
