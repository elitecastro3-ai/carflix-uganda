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
  console.log("USER:",user) 
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

        {/* CAR LIST */}
        <div
          style={{
            background: COLORS.card,
            borderRadius: 14,
            padding: 16,
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map((car) => (
              <div
                key={car.id}
                style={{
                  background: "#fff",
                  borderRadius: 14,
                  padding: 12,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
                }}
              >
                {/* TOP */}
                <div style={{ display: "flex", gap: 10 }}>
                  {car.images && car.images[0] ? (
                    <img
                      src={car.images[0]}
                      alt=""
                      style={{
                        width: 70,
                        height: 60,
                        borderRadius: 8,
                        objectFit: "cover"
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 70,
                        height: 60,
                        background: "#EEE",
                        borderRadius: 8,
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

                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 700 }}>
                      {car.carName}
                    </p>
                    <p style={{ margin: "4px 0", color: COLORS.sub }}>
                      {getUsername(car.ownerId)}
                    </p>
                    <p style={{ margin: 0, fontWeight: 600 }}>
                      UGX {car.price}
                    </p>
                  </div>
                </div>

                {/* STATUS */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 10
                  }}
                >
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

                  <span style={{ fontSize: 12, color: COLORS.sub }}>
                    {contacts[car.id] || 0} inquiries
                  </span>
                </div>

                {/* ACTIONS */}
                <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
                  <button
                    onClick={() => updateStatus(car.id, "approved")}
                    style={{
                      flex: 1,
                      background: "#2E7D32",
                      color: "#fff",
                      border: "none",
                      borderRadius: 10,
                      padding: "8px",
                      cursor: "pointer",
                      fontWeight: 600
                    }}
                  >
                    ✔ Approve
                  </button>

                  <button
                    onClick={() => updateStatus(car.id, "rejected")}
                    style={{
                      flex: 1,
                      background: "#C62828",
                      color: "#fff",
                      border: "none",
                      borderRadius: 10,
                      padding: "8px",
                      cursor: "pointer",
                      fontWeight: 600
                    }}
                  >
                    ✖ Reject
                  </button>
                </div>

                <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                  <button
                    onClick={() => toggleFeature(car.id)}
                    style={{
                      flex: 1,
                      background: car.featured ? "#F9A825" : "#FFB300",
                      color: "#fff",
                      border: "none",
                      borderRadius: 10,
                      padding: "8px",
                      cursor: "pointer",
                      fontWeight: 700
                    }}
                  >
                    {car.featured ? "⭐ Featured" : "☆ Feature"}
                  </button>

                  <button
                    onClick={() => deleteCar(car.id)}
                    style={{
                      flex: 1,
                      background: "#B71C1C",
                      color: "#fff",
                      border: "none",
                      borderRadius: 10,
                      padding: "8px",
                      cursor: "pointer",
                      fontWeight: 600
                    }}
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
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
          <h3 style={{ marginBottom: 10 }}>
            Top Performing Cars
          </h3>
          {topCars.map((car) => (
            <p key={car.id}>
              {car.carName} — {contacts[car.id] || 0} inquiries
            </p>
          ))}
        </div>

      </div>
    </div>
  );
}