export default function EmployeeCard({ employee }) {
  return (
    <div className="card">
      <h3>{employee.name}</h3>
      <p>{employee.position}</p>

      <span className="badge active">Active</span>
      <span className="badge notin">Not In</span>
      <span className="badge leave">On Leave</span>
    </div>
  );
}