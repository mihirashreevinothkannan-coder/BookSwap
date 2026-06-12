import { FiGithub, FiTwitter, FiMail } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div style={{ maxWidth: 320 }}>
          <div className="brand" style={{ marginBottom: 10 }}>
            <span className="brand-mark">📚</span>
            Book<span className="text-gradient">Swap</span>
          </div>
          <p style={{ fontSize: "0.9rem" }}>
            Swap, lend and discover books with your community. Read more, spend less.
          </p>
        </div>

        <div className="row" style={{ gap: 14 }}>
          <a href="#" className="text-dim" aria-label="GitHub"><FiGithub size={20} /></a>
          <a href="#" className="text-dim" aria-label="Twitter"><FiTwitter size={20} /></a>
          <a href="#" className="text-dim" aria-label="Email"><FiMail size={20} /></a>
        </div>
      </div>
      <div className="container" style={{ paddingBottom: 24 }}>
        <p style={{ fontSize: "0.82rem", margin: 0, color: "var(--text-muted)" }}>
          © {new Date().getFullYear()} BookSwap. Built for readers.
        </p>
      </div>
    </footer>
  );
}
