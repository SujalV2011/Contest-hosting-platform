import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Ticket,
  Bell,
  MessageCircle,
  Calendar,
  Users,
  BarChart3,
} from "lucide-react"; // ✅ Import icons for features
import "../styles/OrganizerDashboard.css";

const OrganizerDashboard = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  // ✅ Features section data (same as HomePage)
  const features = [
    {
      icon: <Ticket size={32} />,
      title: "Digital Ticketing",
      description:
        "Streamline entry with secure, contactless digital tickets and effortless guest management.",
    },
    {
      icon: <Bell size={32} />,
      title: "Real-time Notifications",
      description:
        "Keep attendees informed with instant updates for schedule changes, updates, and reminders.",
    },
    {
      icon: <MessageCircle size={32} />,
      title: "AI Chatbot Support",
      description:
        "Provide instant assistance and answers to common questions with our intelligent AI chatbot.",
    },
    {
      icon: <Calendar size={32} />,
      title: "Calendar Reminders",
      description:
        "Effortless integration with calendars for automated reminders and schedule management.",
    },
    {
      icon: <Users size={32} />,
      title: "Attendee Engagement",
      description:
        "Foster community with interactive polls, live Q&A, and social networking features.",
    },
    {
      icon: <BarChart3 size={32} />,
      title: "Analytics & Insights",
      description:
        "Gain valuable data on event performance, attendance patterns, and engagement metrics.",
    },
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/events/organizer",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

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

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        {/* Hero Section */}
        <section className="hero-section">
          <h1 className="hero-title">Manage Your Events</h1>
          <p className="hero-description">
            Create, track and manage all your events in one place.
          </p>
        </section>

        {/* Categories Grid (for organizer actions) */}
        <div className="categories-grid">
          <div className="category-card">
            <div className="category-header">
              <div className="category-info">
                <h3>Create Event</h3>
                <p>Host a new competition</p>
              </div>
              <span className="category-icon">➕</span>
            </div>
            <button
              className="explore-button"
              onClick={() => navigate("/organize-event")}
            >
              Start →
            </button>
          </div>

          <div className="category-card">
            <div className="category-header">
              <div className="category-info">
                <h3>Track Registrations</h3>
                <p>Monitor participant growth</p>
              </div>
              <span className="category-icon">📊</span>
            </div>
            <button className="explore-button">Explore →</button>
          </div>

          <div className="category-card">
            <div className="category-header">
              <div className="category-info">
                <h3>Manage Submissions</h3>
                <p>Review participant work</p>
              </div>
              <span className="category-icon">📂</span>
            </div>
            <button className="explore-button">Explore →</button>
          </div>

          <div className="category-card">
            <div className="category-header">
              <div className="category-info">
                <h3>Analytics</h3>
                <p>Measure event success</p>
              </div>
              <span className="category-icon">📈</span>
            </div>
            <button className="explore-button">Explore →</button>
          </div>
        </div>

        {/* Organizer’s Events Section */}
        <section className="competitions-section">
          <div className="section-header">
            <h2 className="section-title">Your Events</h2>
            <button className="explore-button">View all →</button>
          </div>

          <div className="events-grid">
            {events.length === 0 ? (
              <p className="no-events-text">No events created yet.</p>
            ) : (
              events.map((event) => (
                <div key={event._id} className="event-card">
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
                          <span>
                            {event.registrations?.length || 0} Registrations
                          </span>
                        </div>
                        <div className="meta-item meta-days">
                          <span className="clock-icon">⏰</span>
                          <span>7 days left</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Arrow Button */}
                  <button className="arrow-button">↗</button>
                </div>
              ))
            )}
          </div>
        </section>

        {/* ✅ Features Section (reused from HomePage) */}
        <section className="features-section">
          <div className="features-container">
            <div className="section-header">
              <h2 className="section-title">Empower Your Events with EventSphere</h2>
            </div>
            <div className="features-grid">
              {features.map((feature, index) => (
                <div key={index} className="feature-card">
                  <div className="feature-icon">{feature.icon}</div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
