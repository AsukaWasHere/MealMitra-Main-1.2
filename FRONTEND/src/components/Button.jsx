export default function Button({ children, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition ${className}`}
    >
      {children}
    </button>
  );
}
