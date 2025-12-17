type Props = {
  message: string;
  show: boolean;
};

export default function Toast({ message, show }: Props) {
  if (!show) return null;

  return (
    <div
      className="position-fixed bottom-0 end-0 p-3"
      style={{ zIndex: 1055 }}
    >
      <div className="toast show align-items-center text-bg-warning border-0">
        <div className="d-flex">
          <div className="toast-body">
            {message}
          </div>
        </div>
      </div>
    </div>
  );
}
