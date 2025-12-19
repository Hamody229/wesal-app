type Props = {
  message: string;
  show: boolean;
  type?: "success" | "danger" | "warning";
  onClose: () => void;
};

export default function Toast({ message, show, type = "warning", onClose }: Props) {
  if (!show) return null;

  const bgColor = type === "danger" ? "bg-danger" : 
                  type === "success" ? "bg-success" : 
                  "bg-warning";

  return (
    <div
      className="position-fixed bottom-0 end-0 p-3"
      style={{ zIndex: 1055 }}
    >
      <div className={`toast show align-items-center text-white ${bgColor} border-0`} role="alert">
        <div className="d-flex">
          <div className="toast-body">
            {message}
          </div>
          <button 
            type="button" 
            className="btn-close btn-close-white me-2 m-auto" 
            onClick={onClose}
          ></button>
        </div>
      </div>
    </div>
  );
}