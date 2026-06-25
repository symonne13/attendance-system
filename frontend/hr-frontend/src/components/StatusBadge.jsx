export default function StatusBadge({ status }) {
  let color = "active";

  if (status === "not in") color = "notin";
  if (status === "on leave") color = "leave";

  return <span className={`badge ${color}`}>{status}</span>;
}