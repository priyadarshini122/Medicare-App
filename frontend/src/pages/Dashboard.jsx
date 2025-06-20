import "../assets/Dashboard.css";
import { useState, useEffect } from "react";
import { addMedication, getMedications, markAsTaken, uploadProof } from "../services/api";
import MedicationItem from "../components/MedicationItem";

function Dashboard({ user }) {
    const [medications, setMedications] = useState([]);
    const [form, setForm] = useState({ name: "", dosage: "", frequency: "" });

    useEffect(() => {
        fetchMeds();
    }, []);

    const fetchMeds = async () => {
        const res = await getMedications(user.id);
        setMedications(res.data);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        await addMedication({ ...form, user_id: user.id });
        setForm({ name: "", dosage: "", frequency: "" });
        fetchMeds();
    };

    return (
        <div className="dashboard-container">
            <h2>Welcome, {user.name}</h2>

            <form onSubmit={handleAdd}>
                <input name="name" placeholder="Medication Name" value={form.name} onChange={handleChange} required />
                <input name="dosage" placeholder="Dosage (e.g., 500mg)" value={form.dosage} onChange={handleChange} required />
                <input name="frequency" placeholder="Frequency (e.g., twice a day)" value={form.frequency} onChange={handleChange} required />
                <button type="submit">Add Medication</button>
            </form>

            <ul className="medication-list">
                {medications.map((med) => (
                    <MedicationItem key={med.id} med={med} onMarkTaken={markAsTaken} onUpload={uploadProof} />
                ))}
            </ul>
        </div>
    );
}

export default Dashboard;
