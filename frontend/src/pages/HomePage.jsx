import React, { useState } from 'react';
import { 
  Ticket, Bell, MessageCircle, Calendar, 
  Users, BarChart3, ArrowRight, Mail 
} from 'lucide-react';
import dashboardImage from '../assets/image.png';
import '../styles/homepage.css';
import ParticlesBackground from '../components/ParticlesBackground'; // particles

const HomePage = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const features = [
    {
      icon: <Ticket size={32} />,
      title: 'Digital Ticketing',
      description: 'Streamline entry with secure, contactless digital tickets and effortless guest management.'
    },
    {
      icon: <Bell size={32} />,
      title: 'Real-time Notifications',
      description: 'Keep attendees informed with instant updates for schedule changes, updates, and reminders.'
    },
    {
      icon: <MessageCircle size={32} />,
      title: 'AI Chatbot Support',
      description: 'Provide instant assistance and answers to common questions with our intelligent AI chatbot.'
    },
    {
      icon: <Calendar size={32} />,
      title: 'Calendar Reminders',
      description: 'Effortless integration with calendars for automated reminders and schedule management.'
    },
    {
      icon: <Users size={32} />,
      title: 'Attendee Engagement',
      description: 'Foster community with interactive polls, live Q&A, and social networking features.'
    },
    {
      icon: <BarChart3 size={32} />,
      title: 'Analytics & Insights',
      description: 'Gain valuable data on event performance, attendance patterns, and engagement metrics.'
    }
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 2500);
  };

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <ParticlesBackground />
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Plan Smarter.<br />
                Manage Better.<br />
                Celebrate<br />
                Together.
              </h1>
              <p className="hero-description">
                EventSphere streamlines event planning with digital ticketing,
                real-time notifications, AI assistance, and seamless calendar
                integration for unforgettable experiences.
              </p>
              <div className="hero-actions">
                <button className="cta-primary">
                  Get Started
                  <ArrowRight size={20} />
                </button>
                <button className="cta-secondary">Learn More</button>
              </div>
            </div>
            <div className="hero-visual">
              <div className="dashboard-mockup">
                <img 
                  src={dashboardImage} 
                  alt="EventSphere Dashboard" 
                  className="dashboard-image"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
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

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="newsletter-container">
          <div className="newsletter-content">
            <h3 className="newsletter-title">EventSphere</h3>
            <p className="newsletter-subtitle">Subscribe to our newsletter</p>
            <form className="newsletter-form" onSubmit={handleSubscribe}>
              <div className="input-group">
                <Mail className="input-icon" size={20} />
                <input
                  type="email"
                  placeholder="Type your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="email-input"
                  required
                />
                <button type="submit" className="subscribe-btn">
                  Subscribe
                </button>
              </div>
              {subscribed && (
                <div className="subscribed-msg">Subscribed!</div>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
