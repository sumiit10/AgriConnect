export default function Loader({ text = 'Loading...' }) {
  return <div className="loader-wrap"><span className="spinner" aria-hidden="true" />{text}</div>;
}
