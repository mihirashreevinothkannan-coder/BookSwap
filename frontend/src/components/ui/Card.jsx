// Glassmorphism card. Set `hover` for the lift + glow interaction.
export default function Card({ children, hover, className = "", ...props }) {
  return (
    <div className={`card ${hover ? "card-hover" : ""} ${className}`} {...props}>
      {children}
    </div>
  );
}
