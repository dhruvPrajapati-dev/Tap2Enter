function StatCard({ icon, title, number, text, color }) {
  return (
    <div className="stat-card">

      <div className={`stat-icon ${color}`}>
        {icon}
      </div>

      <div>
        <h3>{title}</h3>
        <strong>{number}</strong>
        <p>{text}</p>
      </div>

    </div>
  );
}

export default StatCard;