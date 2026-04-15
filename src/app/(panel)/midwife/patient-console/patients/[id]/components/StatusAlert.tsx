type StatusAlertProps = {
  type: "error" | "success";
  message: string;
};

export default function StatusAlert({ type, message }: StatusAlertProps) {
  if (!message) return null;

  const styles =
    type === "error"
      ? "border-red-500/20 bg-red-500/10 text-red-200"
      : "border-emerald-500/20 bg-emerald-500/10 text-emerald-200";

  return <div className={`rounded-xl border px-4 py-3 text-sm ${styles}`}>{message}</div>;
}