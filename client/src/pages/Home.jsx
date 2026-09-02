import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Users,
  Heart,
  CalendarDays,
  MapPin,
  Music2,
  HandHeart,
  Instagram
} from "lucide-react";

import EventCard from "../components/EventCard";
import { fallbackEvents } from "../data/fallback";


const galleryImages = [
  {
    id: 1,
    image: "/images/gallery/1.jpg",
    title: "Indra Jatra",
    category: "Culture"
  },
  {
    id: 2,
    image: "/images/gallery/2.jpg",
    title: "Dhime",
    category: "Rhythm"
  },
  {
    id: 3,
    image: "/images/gallery/3.jpg",
    title: "Our Community",
    category: "People"
  },
  {
    id: 4,
    image: "/images/gallery/4.jpg",
    title: "Basantapur",
    category: "Kathmandu"
  },
  {
    id: 5,
    image: "/images/gallery/5.jpg",
    title: "Behind The Scenes",
    category: "The Locals"
  },
  {
    id: 6,
    image: "/images/gallery/6.jpg",
    title: "Celebration",
    category: "Community"
  },
  {
    id: 7,
    image: "/images/gallery/7.jpg",
    title: "Tradition",
    category: "Heritage"
  },
  {
    id: 8,
    image: "/images/gallery/8.jpg",
    title: "Together",
    category: "The Locals"
  }
];


export default function Home() {

  const featuredEvents = fallbackEvents.slice(0, 3);

  return (
    <>

      {/* ======================================================
          HERO
      ====================================================== */}

      <section className="hero premium-hero">

        <div className="hero-pattern" />

        <div className="hero-copy">

          <div className="kicker">
            <Sparkles size={16} />
            Kathmandu, Nepal
          </div>

          <h1>
            Making Impact Where
            <em> It Matters.</em>
          </h1>

          <p>
            The Locals brings together culture, people and
            experiences through events that celebrate
            Kathmandu's traditions in a modern and meaningful way.
          </p>

          <div className="hero-actions">

            <Link
              to="/events"
              className="btn primary"
            >
              Explore our events
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/about"
              className="btn ghost"
            >
              Discover our story
            </Link>

          </div>


          <div className="hero-mini-info">

            <div>
              <MapPin size={16} />
              <span>Kathmandu Valley</span>
            </div>

            <div>
              <Music2 size={16} />
              <span>Culture-led experiences</span>
            </div>

            <div>
              <Users size={16} />
              <span>Built with community</span>
            </div>

          </div>

        </div>


        {/* HERO VISUAL */}

        <div className="hero-visual premium-hero-visual">

          <div className="hero-image-frame">

            <div className="hero-image-placeholder">

              <span>THE LOCALS</span>

              <strong>
                KATHMANDU
              </strong>

              <small>
                Culture. Community. Celebration.
              </small>

            </div>

            <div className="hero-image-label">

              <span>Culture</span>

              <strong>
                Community in motion
              </strong>

            </div>

          </div>


          <div className="floating-event-card">

            <span className="floating-label">
              Flagship Celebration
            </span>

            <strong>
              INDRA JATRA
            </strong>

            <div className="floating-year">
              2083
            </div>

            <p>
              Basantapur • Kathmandu
            </p>

          </div>


          <div className="floating-culture-card">

            <span>
              ROOTED IN
            </span>

            <strong>
              धिमे
            </strong>

            <small>
              Rhythm • Heritage • People
            </small>

          </div>

          <div className="mandala-ring" />

        </div>


        <div className="scroll-note">
          SCROLL TO DISCOVER ↓
        </div>

      </section>


      {/* ======================================================
          CULTURE MARQUEE
      ====================================================== */}

      <section className="culture-marquee">

        <div className="culture-marquee-track">

          <span>INDRA JATRA</span>
          <i>•</i>

          <span>DHIME</span>
          <i>•</i>

          <span>BASURI</span>
          <i>•</i>

          <span>COMMUNITY</span>
          <i>•</i>

          <span>HERITAGE</span>
          <i>•</i>

          <span>KATHMANDU</span>
          <i>•</i>

          <span>CELEBRATION</span>
          <i>•</i>

          <span>THE LOCALS</span>

        </div>

      </section>


      {/* ======================================================
          CURRENT HIGHLIGHT
      ====================================================== */}

      <section className="current-highlight">

        <div className="highlight-top">

          <span className="section-kicker">
            Happening Now
          </span>

          <span className="highlight-status">
            <i />
            Featured Event
          </span>

        </div>


        <div className="highlight-grid">

          <div className="highlight-visual">

            <img
              src="/images/indra-jatra-highlight.jpg"
              alt="Grand Indra Jatra 2083"
            />

            <div className="highlight-overlay" />

            <div className="highlight-visual-label">

              <span>
                The Locals Presents
              </span>

              <strong>
                2083
              </strong>

            </div>

          </div>


          <div className="highlight-content">

            <span className="highlight-small">
              Cultural Celebration · Kathmandu
            </span>

            <h2>
              Grand
              <br />
              <em>Indra Jatra</em>
            </h2>

            <p>
              A celebration of culture, rhythm and community
              bringing people together in the heart of Kathmandu.
            </p>


            <div className="highlight-details">

              <div>
                <span>EVENT</span>
                <strong>
                  Indra Jatra 2083
                </strong>
              </div>

              <div>
                <span>LOCATION</span>
                <strong>
                  Basantapur, Kathmandu
                </strong>
              </div>

              <div>
                <span>HOSTED BY</span>
                <strong>
                  The Locals
                </strong>
              </div>

            </div>


            <div className="highlight-actions">

              <Link
                to="/events"
                className="btn primary"
              >
                Explore Event
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/contact"
                className="highlight-secondary"
              >
                Get involved
                <ArrowRight size={16} />
              </Link>

            </div>

          </div>

        </div>

      </section>


      {/* ======================================================
          BRAND PILLARS
      ====================================================== */}

      <section className="stats premium-stats">

        <div>
          <span className="stats-number">
            01
          </span>

          <strong>
            Culture
          </strong>

          <span>
            Rooted in Kathmandu's heritage.
          </span>
        </div>


        <div>
          <span className="stats-number">
            02
          </span>

          <strong>
            Community
          </strong>

          <span>
            Powered by people who participate.
          </span>
        </div>


        <div>
          <span className="stats-number">
            03
          </span>

          <strong>
            Experiences
          </strong>

          <span>
            Created to be lived and remembered.
          </span>
        </div>


        <div>
          <span className="stats-number">
            04
          </span>

          <strong>
            Kathmandu
          </strong>

          <span>
            Our home, inspiration and stage.
          </span>
        </div>

      </section>


      {/* ======================================================
          FEATURED EVENTS
      ====================================================== */}

      <section className="section featured-events-section">

        <div className="section-head">

          <div>

            <span className="section-kicker">
              Featured experiences
            </span>

            <h2>
              Celebrations with
              <em> meaning.</em>
            </h2>

          </div>


          <div className="section-head-right">

            <p>
              Cultural events designed around participation,
              connection and shared experiences.
            </p>

            <Link
              to="/events"
              className="text-link"
            >
              View all events
              <ArrowRight size={16} />
            </Link>

          </div>

        </div>


        <div className="featured-events-layout">

          {featuredEvents[0] && (

            <div className="featured-event-main">

              <EventCard
                event={featuredEvents[0]}
                index={0}
              />

            </div>

          )}


          <div className="featured-event-side">

            {featuredEvents
              .slice(1)
              .map((event, index) => (

                <EventCard
                  key={event.id}
                  event={event}
                  index={index + 1}
                />

              ))}

          </div>

        </div>

      </section>


      {/* ======================================================
          MOMENTS FROM THE LOCALS
      ====================================================== */}

      <section className="locals-gallery">

        <div className="gallery-header">

          <div>

            <span className="section-kicker">
              Through our lens
            </span>

            <h2>
              Moments from
              <br />
              <em>The Locals.</em>
            </h2>

          </div>


          <div className="gallery-header-right">

            <p>
              Culture is best remembered through the people
              who live it. A glimpse into our celebrations,
              performances and community.
            </p>

            <a
              href="https://www.instagram.com/thelocals_kathmandu/"
              target="_blank"
              rel="noreferrer"
              className="instagram-link"
            >
              <Instagram size={17} />

              @thelocals_kathmandu

              <ArrowUpRight size={16} />
            </a>

          </div>

        </div>

{/* ======================================================
    JOIN THE MOVEMENT
====================================================== */}

<section className="join-movement">

  <div className="join-intro">

    <div>
      <span className="section-kicker">
        Be part of The Locals
      </span>

      <h2>
        Don't just watch.
        <br />
        <em>Be part of it.</em>
      </h2>
    </div>

    <p>
      Culture becomes stronger when more people participate.
      Whether you want to perform, volunteer or collaborate,
      there is a place for you at The Locals.
    </p>

  </div>


  <div className="join-grid">

    {/* PERFORM */}

    <Link
      to="/join?type=perform"
      className="join-card join-card-red"
    >
      <div className="join-card-top">

        <span>01</span>

        <ArrowUpRight size={24} />

      </div>

      <div className="join-icon">
        <Music2 size={30} />
      </div>

      <div className="join-card-content">

        <span className="join-label">
          Perform
        </span>

        <h3>
          Take the
          <br />
          stage.
        </h3>

        <p>
          Join our cultural performances, dance groups,
          music experiences and community celebrations.
        </p>

      </div>
    </Link>


    {/* VOLUNTEER */}

    <Link
      to="/join?type=volunteer"
      className="join-card join-card-black"
    >
      <div className="join-card-top">

        <span>02</span>

        <ArrowUpRight size={24} />

      </div>

      <div className="join-icon">
        <HandHeart size={30} />
      </div>

      <div className="join-card-content">

        <span className="join-label">
          Volunteer
        </span>

        <h3>
          Help make
          <br />
          it happen.
        </h3>

        <p>
          Work behind the scenes with our team and help
          turn cultural ideas into unforgettable experiences.
        </p>

      </div>
    </Link>


    {/* COLLABORATE */}

    <Link
      to="/join?type=collaborate"
      className="join-card join-card-white"
    >
      <div className="join-card-top">

        <span>03</span>

        <ArrowUpRight size={24} />

      </div>

      <div className="join-icon">
        <Users size={30} />
      </div>

      <div className="join-card-content">

        <span className="join-label">
          Collaborate
        </span>

        <h3>
          Create
          <br />
          together.
        </h3>

        <p>
          Artists, communities, organisations and brands —
          let's build meaningful cultural experiences together.
        </p>

      </div>
    </Link>

  </div>


  <div className="join-footer">

    <div className="join-footer-line" />

    <p>
      Have something different in mind?
    </p>

    <Link to="/contact">
      Start a conversation
      <ArrowRight size={16} />
    </Link>

  </div>

</section>

        {/* GALLERY GRID */}

        <div className="gallery-grid">

          {galleryImages.map((item, index) => (

            <a
              key={item.id}
              href="https://www.instagram.com/thelocals_kathmandu/"
              target="_blank"
              rel="noreferrer"
              className={`gallery-item gallery-item-${index + 1}`}
            >

              <img
                src={item.image}
                alt={`${item.title} - The Locals Kathmandu`}
              />


              <div className="gallery-overlay" />


              <div className="gallery-number">
                {String(index + 1).padStart(2, "0")}
                <span>
                  /
                  {String(galleryImages.length).padStart(2, "0")}
                </span>
              </div>


              <div className="gallery-content">

                <span>
                  {item.category}
                </span>

                <div>

                  <h3>
                    {item.title}
                  </h3>

                  <ArrowUpRight size={20} />

                </div>

              </div>

            </a>

          ))}

        </div>


        <div className="gallery-bottom">

          <span>
            Kathmandu · Nepal
          </span>

          <a
            href="https://www.instagram.com/thelocals_kathmandu/"
            target="_blank"
            rel="noreferrer"
          >
            Explore more moments

            <ArrowUpRight size={17} />
          </a>

        </div>

      </section>


      {/* ======================================================
          MANIFESTO
      ====================================================== */}

      <section className="manifesto premium-manifesto">

        <div className="manifesto-label">
          Our purpose
        </div>


        <div className="manifesto-copy">

          <h2>
            Tradition stays alive when people take part in it.
          </h2>

          <p>
            We create spaces where people can perform,
            volunteer, collaborate, learn and celebrate.
            The goal is simple: culture should not only
            be observed — it should be lived.
          </p>

          <Link
            to="/about"
            className="manifesto-link"
          >
            More about The Locals
            <ArrowRight size={17} />
          </Link>

        </div>


        <div className="manifesto-icons">

          <div>
            <Users />
            <span>Community</span>
          </div>

          <div>
            <CalendarDays />
            <span>Experiences</span>
          </div>

          <div>
            <Heart />
            <span>Belonging</span>
          </div>

        </div>

      </section>


      {/* ======================================================
          THE LOCALS EXPERIENCE
      ====================================================== */}

      <section className="section locals-experience">

        <div className="locals-experience-copy">

          <span className="section-kicker">
            The Locals experience
          </span>

          <h2>
            More than an event.
            <em> A shared experience.</em>
          </h2>

          <p>
            Every Locals event is built around people
            coming together — dancers, musicians,
            volunteers, creators, families and communities.
          </p>

          <Link
            to="/events"
            className="btn primary"
          >
            Explore experiences
            <ArrowRight size={18} />
          </Link>

        </div>


        <div className="experience-cards">

          <div className="experience-card red">

            <Music2 size={27} />

            <span>01</span>

            <h3>
              Perform
            </h3>

            <p>
              Be part of cultural performances and celebrations.
            </p>

          </div>


          <div className="experience-card black">

            <Users size={27} />

            <span>02</span>

            <h3>
              Participate
            </h3>

            <p>
              Join a community that keeps traditions moving forward.
            </p>

          </div>


          <div className="experience-card white">

            <HandHeart size={27} />

            <span>03</span>

            <h3>
              Support
            </h3>

            <p>
              Help create larger and more inclusive experiences.
            </p>

          </div>

        </div>

      </section>


      {/* ======================================================
          SUPPORT
      ====================================================== */}

      <section className="support-banner premium-support-banner">

        <div>

          <span className="section-kicker">
            Support the movement
          </span>

          <h2>
            Help us create what Kathmandu remembers.
          </h2>

          <p>
            Your support helps us organise cultural events,
            create opportunities for local talent and bring
            communities together through meaningful experiences.
          </p>

        </div>


        <Link
          to="/support"
          className="btn light"
        >
          Support The Locals
          <ArrowRight size={18} />
        </Link>

      </section>

    </>
  );
}