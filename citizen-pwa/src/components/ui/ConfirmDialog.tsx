interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  destructive,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-app animate-in slide-in-from-bottom rounded-t-2xl bg-surface p-6 safe-bottom">
        <h3 className="font-heading text-lg font-bold">{title}</h3>
        <p className="mt-2 text-sm text-white/60">{message}</p>
        <div className="mt-6 flex flex-col gap-2">
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-xl py-3.5 text-sm font-semibold ${
              destructive
                ? "bg-primary text-white"
                : "bg-white text-dark"
            }`}
          >
            {confirmLabel}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl py-3.5 text-sm font-semibold text-white/60"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
