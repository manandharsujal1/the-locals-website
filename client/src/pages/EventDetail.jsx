import {
  Link,
  useParams
} from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock,
  MapPin,
  Sparkles
} from "lucide-react";

import {
  fallbackEvents
} from "../data/events";


export default function EventDetail() {

  const { id } = useParams();

  const event =
    fallbackEvents.find(
      (item) =>
        item.id === id
    );


  if (!event) {

    return (
      <main className="event-not-found">

        <span>
          EVENT NOT FOUND
        </span>

        <h1>
          This event doesn't
          exist.
        </h1>

        <Link
          to="/events"
          className="btn primary"
        >
          <ArrowLeft size={17} />
          Back to events
        </Link>

      </main>
    );
  }


  return (
    <main className="event-detail-page">

      {/* HERO */}

      <section className="event-detail-hero">

        <img
          src={event.image}
          alt={event.title}
        />

        <div className="event-detail-overlay" />


        <Link
          to="/events"
          className="event-back"
        >
          <ArrowLeft size={16} />
          All events
        </Link>


        <div className="event-detail-hero-content">

          <span className="event-detail-category">
            {event.category}
          </span>

          <h1>
            {event.title}
          </h1>

          <p>
            {event.shortDescription}
          </p>

        </div>

      </section>


      {/* INFORMATION */}

      <section className="event-detail-info">

        <div className="event-info-item">

          <CalendarDays />

          <div>
            <span>Date</span>
            <strong>
              {event.date}
            </strong>
          </div>

        </div>


        <div className="event-info-item">

          <Clock />

          <div>
            <span>Time</span>
            <strong>
              {event.time}
            </strong>
          </div>

        </div>


        <div className="event-info-item">

          <MapPin />

          <div>
            <span>Location</span>
            <strong>
              {event.location}
            </strong>
          </div>

        </div>

      </section>


      {/* STORY */}

      <section className="event-story">

        <div className="event-story-heading">

          <span>
            ABOUT THE EVENT
          </span>

          <h2>
            Culture isn't
            watched.
            <em> It's lived.</em>
          </h2>

        </div>


        <div className="event-story-copy">

          <p>
            {event.description}
          </p>

        </div>

      </section>


      {/* HIGHLIGHTS */}

      {event.highlights?.length > 0 && (

        <section className="event-highlights">

          <div className="event-highlights-heading">

            <Sparkles size={20} />

            <div>
              <span>
                EXPERIENCE
              </span>

              <h2>
                Event highlights
              </h2>
            </div>

          </div>


          <div className="event-highlights-grid">

            {event.highlights.map(
              (highlight, index) => (

                <div
                  key={highlight}
                  className="event-highlight"
                >

                  <span>
                    {String(
                      index + 1
                    ).padStart(
                      2,
                      "0"
                    )}
                  </span>

                  <strong>
                    {highlight}
                  </strong>

                </div>

              )
            )}

          </div>

        </section>

      )}


      {/* CTA */}

      <section className="event-join-cta">

        <div>

          <span>
            BE PART OF IT
          </span>

          <h2>
            Don't just watch
            the culture.
            <em> Join it.</em>
          </h2>

        </div>


        <Link
          to="/join"
          className="btn light"
        >
          Join The Locals
          <ArrowRight size={18} />
        </Link>

      </section>

    </main>
  );
}