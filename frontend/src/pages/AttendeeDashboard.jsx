import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

const AttendeeDashboard = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Tech Innovation Hackathon 2025",
      organizer: "TechCorp Inc.",
      image:
        "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400",
      registrations: 156,
      type: "Hackathon",
    },
    {
      id: 2,
      title: "Data Science Challenge",
      organizer: "DataMinds Organization",
      image:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400",
      registrations: 89,
      type: "Competition",
    },
    {
      id: 3,
      title: "AI Research Scholarship",
      organizer: "AI Foundation",
      image:
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=400",
      registrations: 234,
      type: "Scholarship",
    },
    {
      id: 4,
      title: "Web Development Bootcamp",
      organizer: "CodeMasters Academy",
      image:
        "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=400",
      registrations: 167,
      type: "Training",
    },
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    // fetchEvents(); // disabled for demo
  }, []);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:5000/api/events", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setEvents(data.events);
      } else {
        console.error("Failed to fetch events");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleRegister = async (eventId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/events/${eventId}/register`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        fetchEvents();
      } else {
        const data = await response.json();
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Error registering for event:", error);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        {/* Hero Section */}
        <section className="hero-section">
          <h1 className="hero-title">Unlock Your Career</h1>
          <p className="hero-description">
            Explore opportunities from across the globe to grow, showcase
            skills, gain CV points & get hired by your dream company.
          </p>
        </section>

        {/* Main Categories Grid */}
        <div className="categories-grid">
          <div className="category-card">
            <div className="category-header">
              <div className="category-info">
                <h3>Hackathons</h3>
                <p>Join coding challenges</p>
              </div>
              <span className="category-icon">🖥️</span>
            </div>
            <button className="explore-button">Explore →</button>
          </div>

          <div className="category-card">
            <div className="category-header">
              <div className="category-info">
                <h3>Coding Contests</h3>
                <p>Battle for excellence</p>
              </div>
              <span className="category-icon">🏆</span>
            </div>
            <button className="explore-button">Explore →</button>
          </div>

          <div className="category-card">
            <div className="category-header">
              <div className="category-info">
                <h3>Quizes</h3>
                <p>Find opportunities</p>
              </div>
              <span className="category-icon">🎓</span>
            </div>
            <button className="explore-button">Explore →</button>
          </div>
          <div className="category-card">
            <div className="category-header">
              <div className="category-info">
                <h3>College Events</h3>
                <p>Explore campus activities</p>
              </div>
              <span className="category-icon">🏫</span>
            </div>
            <button className="explore-button">Explore →</button>
          </div>
        </div>

        {/* Competitions Section */}
        <section className="competitions-section">
          <div className="section-header">
            <h2 className="section-title">Competitions</h2>
            <button className="explore-button">View all →</button>
          </div>

          <div className="events-grid">
            {events.map((event) => (
              <div key={event.id} className="event-card">
                <div className="event-image">
                  <img
                    src={event.image || "https://via.placeholder.com/400x225"}
                    alt={event.title}
                  />
                </div>
                <div className="event-details">
                  <div className="event-tags">
                    <span className="tag tag-online">Online</span>
                    <span className="tag tag-free">Free</span>
                  </div>
                  <h3 className="event-title">{event.title}</h3>
                  <p className="event-organizer">{event.organizer}</p>
                  <div className="event-meta">
                    <div className="meta-info">
                      <div className="meta-item">
                        <span>👥</span>
                        <span>{event.registrations || 0} Applied</span>
                      </div>
                      <div className="meta-item meta-days">
                        <span className="clock-icon">⏰</span>
                        <span>7 days left</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Arrow Button (new) */}
                <button className="arrow-button">↗</button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AttendeeDashboard;
