import React from 'react';
import { Calendar, Users } from 'lucide-react';

const EventCard = ({ event, isAttendee, onRegister }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="event-card">
      <div className="event-image">
        <img src={event.image || 'default-event-image.jpg'} alt={event.name} />
      </div>
      <div className="event-content">
        <h3>{event.name}</h3>
        <div className="event-details">
          <div className="event-info">
            <Calendar size={16} />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="event-info">
            <Users size={16} />
            <span>{event.registeredUsers} registered</span>
          </div>
        </div>
        {isAttendee && (
          <button 
            className="register-btn"
            onClick={() => onRegister(event.id)}
          >
            Register Now
          </button>
        )}
      </div>
    </div>
  );
};

export default EventCard;
