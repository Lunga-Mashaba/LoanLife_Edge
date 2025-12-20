import StatusBadge from './StatusBadge.jsx';

export default function Layout({ children }) {
  return (
    <div className="app">
      <aside className="sidebar">
        <h3>LoanLife Edge</h3>
        <nav>
          <a href="/">Portfolio</a>
          <a href="/settings">Settings</a>
        </nav>
      </aside>
      <header className="topbar">
        <StatusBadge />
      </header>
      <main className="content">{children}</main>
    </div>
  );
}
