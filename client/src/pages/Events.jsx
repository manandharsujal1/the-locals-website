import {
  useEffect,
  useState
} from "react";

import {
  CalendarDays,
  ArrowDown
} from "lucide-react";

import EventCard from "../components/EventCard";

import {
  fallbackEvents
} from "../data/events";

const API =
  import.meta.env.VITE_API_URL ||
  "http://localhost:4000/api";

export default function Events() {

  const [events, setEvents] =
    useState(fallbackEvents);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const loadEvents = async () => {

      try {

        const response =
          await fetch(
            `${API}/events`
          );

        if (!response.ok) {
          throw new Error();
        }

        const data =
          await response.json();

        if (
          Array.isArray(data) &&
          data.length
        ) {

          /*
           * Merge API events with fallback
           * information such as images and
           * highlights.
           */

          const merged =
            data.map((event) => {

              const fallback =
                fallbackEvents.find(
                  (item) =>
                    item.id === event.id
                );

              return {
                ...fallback,
                ...event
              };
            });

          setEvents(merged);
        }

      } catch (error) {

        console.log(
          "Using fallback event data."
        );

      } finally {

        setLoading(false);

      }

    };

    loadEvents();

  }, []);


  return (
    <main className="events-page">

      {/* HERO */}

      <section className="events-hero">

        <div className="events-hero-pattern" />

        <div className="events-hero-content">

          <div className="events-eyebrow">

            <CalendarDays size={15} />

            <span>
              THE LOCALS · KATHMANDU
            </span>

          </div>

          <h1>
            Where culture
            becomes
            <em> experience.</em>
          </h1>

          <p>
            Festivals, performances,
            community programs and
            collaborations created to
            celebrate Kathmandu's living
            culture.
          </p>

        </div>


        <div className="events-hero-index">

          <span>
            EVENTS / 2083
          </span>

          <strong>
            {String(
              events.length
            ).padStart(2, "0")}
          </strong>

          <small>
            Experiences
          </small>

        </div>


        <a
          href="#events-list"
          className="events-scroll"
        >
          <span>
            Explore
          </span>

          <ArrowDown size={16} />
        </a>

      </section>


      {/* EVENTS */}

      <section
        className="events-showcase"
        id="events-list"
      >

        <div className="events-showcase-head">

          <div>

            <span className="section-kicker">
              Our Events
            </span>

            <h2>
              Culture is meant
              to be
              <em> lived.</em>
            </h2>

          </div>

          <p>
            From traditional performances
            to large-scale cultural
            celebrations, every experience
            is built around people,
            participation and belonging.
          </p>

        </div>


        {loading ? (

          <div className="events-loading">
            Loading events...
          </div>

        ) : (

          <div className="events-premium-grid">

            {events.map(
              (event, index) => (

                <EventCard
                  key={event.id}
                  event={event}
                  index={index}
                />

              )
            )}

          </div>

        )}

      </section>

    </main>
  );
}