import React, { useState } from "react";

const COLORS = {
  primary: "#B71C1C",
  primaryDark: "#7F0000",
  bg: "#F5F5F5",
  card: "#FFFFFF",
  text: "#1A1A1A",
  sub: "#555",
  border: "#E0E0E0"
};

export default function AdminDashboard({ user, cars, deleteCar }) {
  const [search, setSearch] = useState("");
  const [contacts] = useState(
    JSON.parse(localStorage.getItem("contacts") || "{}")
  );

  if (!user || !user.isAdmin) {
    return (
      <h2 style={{ textAlign: "center", marginTop: 40 }}>
        Access Denied 🚫
      </h2>
    );
  }

  const users = JSON.parse(localStorage.getItem("cf_users") || "[]");

  const getUsername = (id) => {
    const u = users.find((x) => x.id === id);
    return u ? u.username : "Unknown";
  };

  const toggleFeature = (id) => {
    const updated = cars.map((c) =>
      c.id === id ? { ...c, featured: !c.featured } : c
    );
    localStorage.setItem("cf_cars", JSON.stringify(updated));
    window.location.reload();
  };

  const updateStatus = (id, status) => {
    const updated = cars.map((c) =>
      c.id === id ? { ...c, status } : c
    );
    localStorage.setItem("cf_cars", JSON.stringify(updated));
    window.location.reload();
  };

  const filtered = cars.filter(
    (c) =>
      c.carName.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase())
  );

  const totalInquiries = Object.values(contacts).reduce(
    (a, b) => a + b,
    0
  );

  const topCars = [...cars]
    .sort((a, b) => (contacts[b.id] || 0) - (contacts[a.id] || 0))
    .slice(0, 5);

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh" }}>
      
      {/* HEADER */}
      <div
        style={{
          background: "linear-gradient(135deg, #B71C1C, #7F0000)",
          color: "#fff",
          padding: 20,
          fontWeight: "bold",
          fontSize: 20
        }}
      >
        CAR-FLIX Admin Dashboard
      </div>

      <div style={{ padding: 20 }}>

        {/* STATS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2,1fr)",
            gap: 12,
            marginBottom: 20
          }}
        >
          {[
            { label: "Total Cars", value: cars.length },
            { label: "Total Users", value: users.length },
            { label: "Total Inquiries", value: totalInquiries },
            {
              label: "Featured Cars",
              value: cars.filter((c) => c.featured).length
            }
          ].map((item, i) => (
            <div
              key={i}
              style={{
                background: COLORS.card,
                borderRadius: 14,
                padding: 16,
                borderTop: `4px solid ${COLORS.primary}`,
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
              }}
            >
              <p style={{ color: COLORS.sub, margin: 0 }}>
                {item.label}
              </p>
              <h2 style={{ margin: "6px 0 0", color: COLORS.text }}>
                {item.value}
              </h2>
            </div>
          ))}
        </div>

        {/* SEARCH */}
        <input
          placeholder="Search cars or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 10,
            border: `1px solid ${COLORS.border}`,
            marginBottom: 20,
            outline: "none"
          }}
        />

        {/* TABLE */}
        <div
          style={{
            background: COLORS.card,
            borderRadius: 14,
            padding: 16,
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
          }}
        >
          <table style={{ width: "100%", borderSpacing: "0" }}>
            
            <thead>
              <tr style={{ textAlign: "left", color: "#444", fontWeight: "700" }}>
                <th style={{ padding: 10 }}>Car</th>
                <th style={{ padding: 10 }}>Owner</th>
                <th style={{ padding: 10 }}>Price</th>
                <th style={{ padding: 10 }}>Status</th>
                <th style={{ padding: 10 }}>Inquiries</th>
                <th style={{ padding: 10 }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((car) => (
                <tr
                  key={car.id}
                  style={{
                    background: "#fff",
                    borderBottom: "1px solid #EEE",
                    transition: "0.2s"
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#F9F9F9")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "#fff")
                  }
                >
                  
                  {/* 🔥 CAR WITH IMAGE */}
                  <td style={{ padding: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      
                      {car.images && car.images[0] ? (
                        <img
                          src={car.images[0]}
                          alt=""
                          style={{
                            width: 50,
                            height: 40,
                            objectFit: "cover",
                            borderRadius: 6,
                            border: car.featured
                              ? "2px solid gold"
                              : "1px solid #EEE",
                            transition: "0.2s"
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.transform = "scale(1.05)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.transform = "scale(1)")
                          }
                        />
                      ) : (
                        <div
                          style={{
                            width: 50,
                            height: 40,
                            background: "#EEE",
                            borderRadius: 6,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 10,
                            color: "#999"
                          }}
                        >
                          No Img
                        </div>
                      )}

                      <span style={{ color: COLORS.text, fontWeight: 600 }}>
                        {car.carName}
                      </span>

                    </div>
                  </td>

                  <td style={{ padding: 10, color: COLORS.text }}>
                    {getUsername(car.ownerId)}
                  </td>

                  <td style={{ padding: 10, color: COLORS.text }}>
                    {car.price}
                  </td>

                  {/* STATUS */}
                  <td style={{ padding: 10 }}>
                    <span
                      style={{
                        background:
                          car.status === "approved"
                            ? "#E8F5E9"
                            : car.status === "rejected"
                            ? "#FFEBEE"
                            : "#FFF8E1",
                        color:
                          car.status === "approved"
                            ? "#2E7D32"
                            : car.status === "rejected"
                            ? "#C62828"
                            : "#F9A825",
                        padding: "4px 10px",
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 700
                      }}
                    >
                      {car.status || "pending"}
                    </span>
                  </td>

                  <td style={{ padding: 10, color: COLORS.text }}>
                    {contacts[car.id] || 0}
                  </td>

                  {/* ACTIONS */}
                  <td style={{ padding: 10, display: "flex", gap: 6 }}>
                    
                    <button
                      onClick={() => updateStatus(car.id, "approved")}
                      style={{
                        background: "#E8F5E9",
                        border: "none",
                        borderRadius: 8,
                        padding: 6,
                        cursor: "pointer"
                      }}
                    >
                      ✔
                    </button>

                    <button
                      onClick={() => updateStatus(car.id, "rejected")}
                      style={{
                        background: "#FFEBEE",
                        border: "none",
                        borderRadius: 8,
                        padding: 6,
                        cursor: "pointer"
                      }}
                    >
                      ✖
                    </button>

                    <button
                      onClick={() => toggleFeature(car.id)}
                      style={{
                        background: car.featured
                          ? "#FFD54F"
                          : "#EEE",
                        border: "none",
                        borderRadius: 20,
                        padding: "6px 10px",
                        cursor: "pointer",
                        fontWeight: 700
                      }}
                    >
                      {car.featured ? "⭐" : "☆"}
                    </button>

                    <button
                      onClick={() => deleteCar(car.id)}
                      style={{
                        background: "#FFEBEE",
                        border: "none",
                        borderRadius: 8,
                        padding: 6,
                        cursor: "pointer"
                      }}
                    >
                      🗑
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {/* ANALYTICS */}
        <div
          style={{
            marginTop: 20,
            background: COLORS.card,
            borderRadius: 14,
            padding: 16,
            borderTop: `4px solid ${COLORS.primary}`,
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
          }}
        >
          <h3 style={{ marginBottom: 10, color: COLORS.text }}>
            Top Performing Cars
          </h3>
          {topCars.map((car) => (
            <p key={car.id} style={{ color: COLORS.sub }}>
              {car.carName} — {contacts[car.id] || 0} inquiries
            </p>
          ))}
        </div>

      </div>
    </div>
  );
}