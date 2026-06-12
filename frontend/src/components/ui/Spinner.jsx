// Full-area loading spinner.
export default function Spinner({ full }) {
  return (
    <div className={full ? "center-screen" : "row"} style={{ justifyContent: "center", padding: "32px" }}>
      <div className="spinner" />
    </div>
  );
}
