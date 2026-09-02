import {
  useState
} from "react";

import {
  Mail,
  Instagram,
  MapPin
} from "lucide-react";


const API =
  import.meta.env.VITE_API_URL ||
  "http://localhost:4000/api";


export default function Contact() {

  const [sent, setSent] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  const submit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSent(false);

    const form =
      e.currentTarget;

    const data =
      Object.fromEntries(
        new FormData(form)
      );


    try {

      const response =
        await fetch(
          `${API}/submissions`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
              ...data,
              type: "contact"
            })
          }
        );


      const result =
        await response
          .json()
          .catch(() => ({}));


      if (!response.ok) {
        throw new Error(
          result.message ||
          "Unable to send your message."
        );
      }


      setSent(true);

      form.reset();

    } catch (err) {

      console.error(err);

      setError(
        err.message ||
        "Something went wrong. Please try again."
      );

    } finally {

      setLoading(false);

    }
  };


  return (
    <div className="page">

      <section className="page-hero">

        <span className="section-kicker">
          Contact
        </span>

        <h1>
          Let's make something{" "}
          <em>meaningful.</em>
        </h1>

        <p>
          Event partnership,
          collaboration,
          volunteering or a simple
          hello—reach out to our team.
        </p>

      </section>


      <section className="section contact-grid">

        <div className="contact-info">

          <div>
            <Mail />

            <span>
              Email
            </span>

            <strong>
              hello@thelocals.com
            </strong>
          </div>


          <div>
            <Instagram />

            <span>
              Instagram
            </span>

            <strong>
              @thelocals_kathmandu
            </strong>
          </div>


          <div>
            <MapPin />

            <span>
              Based in
            </span>

            <strong>
              Kathmandu, Nepal
            </strong>
          </div>

        </div>


        <form
          className="form-card"
          onSubmit={submit}
        >

          <label>

            Name

            <input
              required
              name="name"
              placeholder="Your full name"
            />

          </label>


          <label>

            Email

            <input
              required
              type="email"
              name="email"
              placeholder="you@example.com"
            />

          </label>


          <label>

            What are you reaching
            out about?

            <select name="subject">

              <option>
                Event collaboration
              </option>

              <option>
                Volunteer
              </option>

              <option>
                Brand partnership
              </option>

              <option>
                Media / Press
              </option>

              <option>
                General inquiry
              </option>

            </select>

          </label>


          <label>

            Message

            <textarea
              required
              name="message"
              rows="6"
              placeholder="Tell us a little more..."
            />

          </label>


          <button
            className="btn primary"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Sending..."
              : "Send message"}
          </button>


          {sent && (

            <p className="success">
              Thanks! Your message
              has been recorded.
            </p>

          )}


          {error && (

            <p className="form-error">
              {error}
            </p>

          )}

        </form>

      </section>

    </div>
  );
}