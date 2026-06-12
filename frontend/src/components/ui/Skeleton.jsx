// Shimmering placeholder. Use while data loads.
// <Skeleton h={20} w="60%" />  or  <BookCardSkeleton />
export default function Skeleton({ w = "100%", h = 16, r = 8, style = {} }) {
  return (
    <div
      className="skeleton"
      style={{ width: w, height: h, borderRadius: r, ...style }}
    />
  );
}

// A card-shaped skeleton matching the BookCard layout.
export function BookCardSkeleton() {
  return (
    <div className="card stack">
      <Skeleton h={22} w="70%" />
      <Skeleton h={14} w="45%" />
      <div className="row wrap" style={{ marginTop: 8 }}>
        <Skeleton h={24} w={70} r={999} />
        <Skeleton h={24} w={60} r={999} />
      </div>
      <Skeleton h={40} w="100%" r={14} style={{ marginTop: 12 }} />
    </div>
  );
}
