import {
  useMemo,
  useState
} from "react";

import {
  useSearchParams,
  Link
} from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Music2,
  HandHeart,
  Users,
  User,
  Mail,
  Phone,
  CalendarDays,
  MessageSquare,
  BriefcaseBusiness
} from "lucide-react";

const API =
  import.meta.env.VITE_API_URL ||
  "http://localhost:4000/api";

const applicationTypes = {
  perform: {
    title: "Performer Application",
    shortTitle: "Perform",
    subtitle:
      "Join The Locals as a performer and become part of our cultural experiences.",
    icon: Music2
  },

  volunteer: {
    title: "Volunteer Application",
    shortTitle: "Volunteer",
    subtitle:
      "Work with The Locals behind the scenes and help bring our events to life.",
    icon: HandHeart
  },

  collaborate: {
    title: "Collaboration Request",
    shortTitle: "Collaborate",
    subtitle:
      "Artists, organisations, communities and brands can create meaningful experiences with us.",
    icon: Users
  }
};


export default function Join() {

  const [searchParams] = useSearchParams();

  const requestedType =
    searchParams.get("type") || "perform";


  const type =
    applicationTypes[requestedType]
      ? requestedType
      : "perform";


  const config =
    applicationTypes[type];


  const Icon =
    config.icon;


  const [form, setForm] = useState({
    applicationType: type,

    name: "",
    email: "",
    phone: "",
    age: "",

    event: "",

    role: "",

    experience: "",

    availability: "",

    organisation: "",

    message: ""
  });


  const [status, setStatus] =
    useState("idle");


  const [error, setError] =
    useState("");


  const applicationLabel =
    useMemo(() => {

      if (type === "perform") {
        return "Performer";
      }

      if (type === "volunteer") {
        return "Volunteer";
      }

      return "Collaborator";

    }, [type]);


  function handleChange(e) {

    const {
      name,
      value
    } = e.target;


    setForm((current) => ({
      ...current,
      [name]: value
    }));
  }


  async function handleSubmit(e) {

    e.preventDefault();

    setStatus("loading");
    setError("");


    try {

      const response =
        await fetch(
          `${API}/applications`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
              ...form,
              applicationType: type
            })
          }
        );


      if (!response.ok) {

        const result =
          await response.json()
            .catch(() => ({}));


        throw new Error(
          result.message ||
          "Unable to submit application."
        );
      }


      setStatus("success");


      setForm({
        applicationType: type,

        name: "",
        email: "",
        phone: "",
        age: "",

        event: "",
        role: "",
        experience: "",
        availability: "",
        organisation: "",
        message: ""
      });

    } catch (err) {

      console.error(err);

      setStatus("error");

      setError(
        "Your application could not be submitted. Please try again."
      );
    }
  }


  if (status === "success") {

    return (
      <section className="join-success-page">

        <div className="join-success-card">

          <div className="join-success-icon">
            <CheckCircle2 size={42} />
          </div>

          <span className="section-kicker">
            Application received
          </span>

          <h1>
            You're officially
            <em> in the mix.</em>
          </h1>

          <p>
            Thanks for your interest in
            joining The Locals as a{" "}
            {applicationLabel.toLowerCase()}.
            Our team will review your
            application and get in touch
            if there is a suitable
            opportunity.
          </p>

          <div className="join-success-actions">

            <Link
              to="/"
              className="btn primary"
            >
              Back to home
              <ArrowRight size={17} />
            </Link>

            <Link
              to="/events"
              className="join-success-link"
            >
              Explore events
            </Link>

          </div>

        </div>

      </section>
    );
  }


  return (
    <>

      {/* ====================================================
          JOIN HERO
      ==================================================== */}

      <section className="join-page-hero">

        <div className="join-page-hero-pattern" />

        <div className="join-page-hero-copy">

          <Link
            to="/"
            className="join-back"
          >
            <ArrowLeft size={16} />
            Back
          </Link>

          <div className="join-page-icon">
            <Icon size={27} />
          </div>

          <span className="section-kicker">
            Join The Locals
          </span>

          <h1>
            {config.shortTitle}
            <em> with us.</em>
          </h1>

          <p>
            {config.subtitle}
          </p>

        </div>

      </section>


      {/* ====================================================
          FORM
      ==================================================== */}

      <section className="join-form-section">

        <div className="join-form-layout">

          {/* LEFT */}

          <aside className="join-form-intro">

            <span className="section-kicker">
              Application
            </span>

            <h2>
              {config.title}
            </h2>

            <p>
              Tell us a little about
              yourself. The information
              below will help our team
              understand how you would
              like to be involved.
            </p>


            <div className="join-form-notes">

              <div>
                <span>01</span>

                <p>
                  Complete the application
                  with accurate contact
                  information.
                </p>
              </div>

              <div>
                <span>02</span>

                <p>
                  Our team reviews
                  applications depending
                  on upcoming events and
                  opportunities.
                </p>
              </div>

              <div>
                <span>03</span>

                <p>
                  If selected, The Locals
                  will contact you with
                  further details.
                </p>
              </div>

            </div>

          </aside>


          {/* FORM */}

          <form
            className="join-application-form"
            onSubmit={handleSubmit}
          >

            <div className="join-form-header">

              <span>
                {config.title}
              </span>

              <strong>
                The Locals Kathmandu
              </strong>

            </div>


            {/* BASIC INFO */}

            <div className="join-form-block">

              <div className="join-form-block-title">

                <span>01</span>

                <div>
                  <strong>
                    Personal information
                  </strong>

                  <small>
                    How we can reach you
                  </small>
                </div>

              </div>


              <div className="join-form-grid">

                <label>
                  <span>
                    Full name *
                  </span>

                  <div className="join-input">

                    <User size={16} />

                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      required
                    />

                  </div>
                </label>


                <label>
                  <span>
                    Email address *
                  </span>

                  <div className="join-input">

                    <Mail size={16} />

                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                    />

                  </div>
                </label>


                <label>
                  <span>
                    Phone number *
                  </span>

                  <div className="join-input">

                    <Phone size={16} />

                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+977..."
                      required
                    />

                  </div>
                </label>


                <label>
                  <span>
                    Age
                  </span>

                  <div className="join-input">

                    <CalendarDays size={16} />

                    <input
                      type="number"
                      name="age"
                      min="10"
                      max="100"
                      value={form.age}
                      onChange={handleChange}
                      placeholder="Age"
                    />

                  </div>
                </label>

              </div>

            </div>


            {/* APPLICATION DETAILS */}

            <div className="join-form-block">

              <div className="join-form-block-title">

                <span>02</span>

                <div>
                  <strong>
                    Application details
                  </strong>

                  <small>
                    Tell us how you want to
                    participate
                  </small>
                </div>

              </div>


              <div className="join-form-grid">

                <label>
                  <span>
                    Event of interest
                  </span>

                  <select
                    name="event"
                    value={form.event}
                    onChange={handleChange}
                  >
                    <option value="">
                      Select an event
                    </option>

                    <option value="Indra Jatra 2083">
                      Indra Jatra 2083
                    </option>

                    <option value="Dhime">
                      Dhime
                    </option>

                    <option value="Basuri">
                      Basuri
                    </option>

                    <option value="Future Events">
                      Future Events
                    </option>
                  </select>

                </label>


                {type === "perform" && (

                  <label>
                    <span>
                      Performance interest
                    </span>

                    <select
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                    >
                      <option value="">
                        Select an area
                      </option>

                      <option value="Dhime Dance">
                        Dhime Dance
                      </option>

                      <option value="Basuri">
                        Basuri
                      </option>

                      <option value="Super Mom">
                        Super Mom
                      </option>

                      <option value="Couples">
                        Couples
                      </option>

                      <option value="Other">
                        Other
                      </option>
                    </select>

                  </label>

                )}


                {type === "volunteer" && (

                  <label>
                    <span>
                      Preferred role
                    </span>

                    <select
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                    >
                      <option value="">
                        Select a role
                      </option>

                      <option value="Event Operations">
                        Event Operations
                      </option>

                      <option value="Registration">
                        Registration
                      </option>

                      <option value="Crowd Management">
                        Crowd Management
                      </option>

                      <option value="Media">
                        Media / Content
                      </option>

                      <option value="Artist Support">
                        Artist Support
                      </option>

                      <option value="General Volunteer">
                        General Volunteer
                      </option>
                    </select>

                  </label>

                )}


                {type === "collaborate" && (

                  <label>
                    <span>
                      Organisation / Brand
                    </span>

                    <div className="join-input">

                      <BriefcaseBusiness
                        size={16}
                      />

                      <input
                        type="text"
                        name="organisation"
                        value={form.organisation}
                        onChange={handleChange}
                        placeholder="Organisation name"
                      />

                    </div>
                  </label>

                )}


                <label className="full-width">
                  <span>
                    Availability
                  </span>

                  <input
                    type="text"
                    name="availability"
                    value={form.availability}
                    onChange={handleChange}
                    placeholder="Example: Weekends / evenings / flexible"
                  />
                </label>

              </div>

            </div>


            {/* EXPERIENCE */}

            <div className="join-form-block">

              <div className="join-form-block-title">

                <span>03</span>

                <div>
                  <strong>
                    Tell us about yourself
                  </strong>

                  <small>
                    Experience is welcome,
                    but not always required
                  </small>
                </div>

              </div>


              <label>
                <span>
                  Relevant experience
                </span>

                <textarea
                  name="experience"
                  rows="4"
                  value={form.experience}
                  onChange={handleChange}
                  placeholder={
                    type === "perform"
                      ? "Tell us about your dance, music or performance experience..."
                      : type === "volunteer"
                      ? "Tell us about any volunteering or event experience..."
                      : "Tell us about your organisation, previous collaborations or ideas..."
                  }
                />
              </label>


              <label>
                <span>
                  Message to The Locals
                </span>

                <div className="join-textarea">

                  <MessageSquare
                    size={17}
                  />

                  <textarea
                    name="message"
                    rows="5"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Why would you like to be part of The Locals?"
                  />

                </div>

              </label>

            </div>


            {status === "error" && (

              <div className="join-form-error">
                {error}
              </div>

            )}


            <div className="join-submit-row">

              <p>
                By submitting this form,
                you agree that The Locals
                may contact you regarding
                events and opportunities.
              </p>

              <button
                type="submit"
                className="btn primary join-submit"
                disabled={status === "loading"}
              >
                {status === "loading"
                  ? "Submitting..."
                  : "Submit application"}

                {status !== "loading" && (
                  <ArrowRight size={17} />
                )}

              </button>

            </div>

          </form>

        </div>

      </section>

    </>
  );
}