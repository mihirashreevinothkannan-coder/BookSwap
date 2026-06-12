import { useState } from "react";
import { FiBell, FiCheckCircle, FiInfo, FiTrash2, FiCheck } from "react-icons/fi";

import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import FadeIn from "../components/ui/FadeIn";

import { useAuth } from "../context/AuthContext";
import { getNotifications, markAllRead, clearNotifications } from "../lib/localStore";

// =========================================================================
//  Notifications — activity feed (stored client-side per user)
// =========================================================================
const icons = {
  success: <FiCheckCircle style={{ color: "var(--green)" }} />,
  info: <FiInfo style={{ color: "var(--cyan)" }} />,
};

function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function Notifications() {
  const { userId } = useAuth();
  const [items, setItems] = useState(() => getNotifications(userId));

  const handleMarkAll = () => { markAllRead(userId); setItems(getNotifications(userId)); };
  const handleClear = () => { clearNotifications(userId); setItems([]); };

  return (
    <FadeIn>
      <div className="page-header row-between wrap">
        <div>
          <h1 style={{ marginBottom: 8 }}>Notifications</h1>
          <p style={{ margin: 0 }}>Recent activity on your account.</p>
        </div>
        {items.length > 0 && (
          <div className="row">
            <Button variant="outline" size="sm" onClick={handleMarkAll}><FiCheck /> Mark all read</Button>
            <Button variant="ghost" size="sm" onClick={handleClear}><FiTrash2 /> Clear</Button>
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={<FiBell />}
          title="You're all caught up"
          message="Notifications about your swaps and requests will show up here."
        />
      ) : (
        <div className="stack">
          {items.map((n) => (
            <Card
              key={n.id}
              className="row"
              style={{ gap: 14, borderColor: n.read ? "var(--border)" : "rgba(34,211,238,0.35)" }}
            >
              <div style={{ fontSize: "1.3rem" }}>{icons[n.type] || icons.info}</div>
              <div style={{ flex: 1 }}>
                <div className="row-between">
                  <strong style={{ color: "#fff" }}>{n.title}</strong>
                  <span className="text-muted" style={{ fontSize: "0.78rem" }}>{timeAgo(n.createdAt)}</span>
                </div>
                <p style={{ margin: "4px 0 0", fontSize: "0.9rem" }}>{n.body}</p>
              </div>
              {!n.read && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--cyan)" }} />}
            </Card>
          ))}
        </div>
      )}
    </FadeIn>
  );
}
