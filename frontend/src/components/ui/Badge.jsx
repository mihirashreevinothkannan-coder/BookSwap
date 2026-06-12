// Status badge. Maps a status string to the matching colour class.
// Known: AVAILABLE, REQUESTED, BORROWED, PENDING, ACCEPTED, REJECTED.
export default function Badge({ status, children }) {
  const key = String(status || "").toLowerCase();
  const known = [
    "available",
    "requested",
    "borrowed",
    "pending",
    "accepted",
    "rejected",
  ].includes(key);

  return (
    <span className={`badge ${known ? `badge-${key}` : "badge-neutral"}`}>
      {children || status}
    </span>
  );
}
