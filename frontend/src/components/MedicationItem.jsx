import React from "react";

function MedicationItem({ med, onMarkTaken, onUpload }) {
  const today = new Date().toISOString().split("T")[0];
  const takenToday = med.taken_dates?.includes(today);

  const handleUpload = async (e) => {
    e.preventDefault();
    const file = e.target.proof.files[0];

    if (!file) {
      alert("❌ Please select a file to upload");
      return;
    }

    try {
      await onUpload(med.id, file);
      alert("✅ Proof uploaded successfully!");
      window.location.reload(); // reload to reflect uploaded image (optional)
    } catch (err) {
      console.error("Upload error:", err);
      alert("❌ Upload failed. Please check the console.");
    }
  };

  return (
    <li style={styles.item}>
      <div>
        <strong>{med.name}</strong> - {med.dosage} - {med.frequency}
      </div>

      <div style={styles.status}>
        Taken today: {takenToday ? "✅" : "❌"}
      </div>

      {!takenToday && (
        <button style={styles.markBtn} onClick={() => onMarkTaken(med.id)}>
          Mark as Taken
        </button>
      )}

      <form onSubmit={handleUpload} style={styles.form}>
        <input type="file" name="proof" accept="image/*" required style={styles.fileInput} />
        <button type="submit" style={styles.uploadBtn}>Upload Proof</button>
      </form>

      {med.proof && (
        <div>
          <p style={{ margin: "10px 0 5px" }}>Uploaded proof:</p>
          <img
            src={`http://localhost:5000/uploads/${med.proof}`}
            alt="Proof"
            style={styles.preview}
          />
        </div>
      )}
    </li>
  );
}

const styles = {
  item: {
    backgroundColor: "#f1f8ff",
    padding: "15px",
    marginBottom: "15px",
    borderRadius: "10px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
    listStyle: "none",
    fontFamily: "'Poppins', sans-serif",
  },
  status: {
    marginTop: "8px",
    fontSize: "0.95rem",
    color: "#333",
  },
  markBtn: {
    marginTop: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  form: {
    marginTop: "10px",
  },
  fileInput: {
    display: "block",
    marginBottom: "6px",
  },
  uploadBtn: {
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  preview: {
    marginTop: "10px",
    width: "120px",
    height: "auto",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
};

export default MedicationItem;
