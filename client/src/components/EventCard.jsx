import { Link } from "react-router-dom";

import {
  ArrowUpRight,
  CalendarDays,
  MapPin
} from "lucide-react";

export default function EventCard({
  event,
  index = 0
}) {
  return (
    <article className="event-card">

      <Link
        to={`/events/${event.id}`}
        className="event-card-image"
      >

        {event.image && (
          <img
            src={event.image}
            alt={event.title}
          />
        )}

        <div className="event-card-overlay" />

        <span className="event-card-number">
          {String(index + 1).padStart(2, "0")}
        </span>

        <span className="event-card-status">
          {event.status || "Event"}
        </span>

      </Link>

      <div className="event-card-content">

        <span className="event-card-category">
          {event.category}
        </span>

        <h2>
          <Link to={`/events/${event.id}`}>
            {event.title}
          </Link>
        </h2>

        <div className="event-card-meta">

          <span>
            <CalendarDays size={14} />
            {event.date}
          </span>

          <span>
            <MapPin size={14} />
            {event.location}
          </span>

        </div>

        <p>
          {event.shortDescription ||
            event.description}
        </p>

        <Link
          to={`/events/${event.id}`}
          className="event-card-link"
        >
          Explore event
          <ArrowUpRight size={16} />
        </Link>

      </div>

    </article>
  );
}