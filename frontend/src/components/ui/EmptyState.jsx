// Friendly empty state with an icon, message and optional action button.
export default function EmptyState({ icon, title, message, action }) {
  return (
    <div className="empty-state">
      {icon && <div className="empty-icon">{icon}</div>}
      <h3 style={{ margin: 0 }}>{title}</h3>
      {message && <p style={{ maxWidth: 420 }}>{message}</p>}
      {action}
    </div>
  );
}
