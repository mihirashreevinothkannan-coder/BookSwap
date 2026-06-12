// Labelled text input. Pass `label`, plus any normal <input> props.
export default function Input({ label, id, icon, className = "", ...props }) {
  const inputId = id || props.name;
  return (
    <div className="field">
      {label && (
        <label className="label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <input id={inputId} className={`input ${className}`} {...props} />
    </div>
  );
}
