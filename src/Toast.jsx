export default function Toast({ type, label, hideToast }) {
  const outline_class = type === "error" ? "error" : "success";

  return (
    <div className={`toast ${outline_class}`}>
      <div className="content">
        {label}
        {/* close button to close validation message */}
        <button onClick={() => hideToast()}>X</button> 
      </div>
    </div>
  );
}
