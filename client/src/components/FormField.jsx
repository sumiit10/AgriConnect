export default function FormField({ label, name, error, hint, as = 'input', children, ...props }) {
  const common = {
    id: name,
    name,
    'aria-invalid': Boolean(error),
    'aria-describedby': error ? `${name}-error` : hint ? `${name}-hint` : undefined,
    className: `form-control ${error ? 'is-invalid' : ''}`,
    ...props
  };
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      {as === 'select' ? <select {...common}>{children}</select> :
        as === 'textarea' ? <textarea {...common}>{children}</textarea> : <input {...common} />}
      {error && <small className="field-error" id={`${name}-error`}>{error}</small>}
      {!error && hint && <small className="field-hint" id={`${name}-hint`}>{hint}</small>}
    </div>
  );
}
