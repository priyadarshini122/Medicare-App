import { useState } from "react";
import { getMedications } from "../services/api";

function CaretakerDashboard({ user }) {
  const [patientId, setPatientId] = useState("");
  const [medications, setMedications] = useState([]);
  const [error, setError] = useState("");

  const fetchMeds = async () => {
    if (!patientId) return;
    try {
      const res = await getMedications(patientId);
      if (res.data.length === 0) {
        setError("No medications found");
        setMedications([]);
      } else {
        setError("");
        setMedications(res.data);
      }
    } catch {
      setError("Patient not found");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div>
      <h2>Welcome, {user.name} (Caretaker)</h2>
      <input placeholder="Patient ID" value={patientId} onChange={(e) => setPatientId(e.target.value)} />
      <button onClick={fetchMeds}>View Medications</button>
      {error && <p>{error}</p>}
      <ul>
        {medications.map(med => (
          <li key={med.id}>
            {med.name} - {med.dosage} - {med.frequency} | Taken Today: {med.taken_dates?.includes(today) ? "✅" : "❌"}
            {med.proof && <img src={`http://localhost:5000/uploads/${med.proof}`} alt="proof" width="100" />}
          </li>
        ))}
      </ul>
    </div>
  );
}
export default CaretakerDashboard;
