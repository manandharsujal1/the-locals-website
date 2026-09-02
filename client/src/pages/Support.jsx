import {
  useEffect,
  useState
} from "react";

import {
  Heart,
  Copy,
  Check
} from "lucide-react";


const API =
  import.meta.env.VITE_API_URL ||
  "http://localhost:4000/api";


const fallback = {
  title:
    "Support The Locals",

  message:
    "Your contribution helps us create cultural events, support performers and build stronger community experiences.",

  accountName:
    "The Locals Kathmandu",

  bank:
    "Donation details editable from admin",

  accountNumber:
    "—",

  qrImage:
    ""
};


export default function Support() {

  const [donation, setDonation] =
    useState(fallback);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [copied, setCopied] =
    useState(false);


  useEffect(() => {

    const loadDonation =
      async () => {

        try {

          const response =
            await fetch(
              `${API}/donation`
            );


          if (!response.ok) {

            throw new Error(
              "Unable to load donation details."
            );

          }


          const data =
            await response.json();


          setDonation({
            ...fallback,
            ...data
          });

        } catch (err) {

          console.error(err);

          setError(
            "Donation details could not be loaded right now."
          );

        } finally {

          setLoading(false);

        }

      };


    loadDonation();

  }, []);


  const copyDonationId =
    async () => {

      if (
        !donation.accountNumber ||
        donation.accountNumber === "—"
      ) {
        return;
      }


      try {

        await navigator.clipboard.writeText(
          donation.accountNumber
        );


        setCopied(true);


        window.setTimeout(
          () => {
            setCopied(false);
          },
          2000
        );

      } catch (err) {

        console.error(
          "Unable to copy donation ID:",
          err
        );

      }

    };


  return (
    <div className="page">

      {/* ======================================================
          HERO
      ====================================================== */}

      <section className="page-hero">

        <span className="section-kicker">
          Support Us
        </span>

        <h1>
          Back the people who keep{" "}
          <em>
            culture moving.
          </em>
        </h1>

        <p>
          {donation.message}
        </p>

      </section>


      {/* ======================================================
          DONATION SECTION
      ====================================================== */}

      <section className="section donation-layout">

        {/* LEFT */}

        <div className="donation-copy">

          <Heart size={44} />

          <h2>
            {donation.title}
          </h2>

          <p>
            Every contribution—big or
            small—supports event
            production, cultural
            programming, volunteer
            coordination and community
            participation.
          </p>


          {loading && (

            <p className="donation-loading">
              Loading donation details...
            </p>

          )}


          {error && (

            <p className="donation-error">
              {error}
            </p>

          )}


          <div className="donation-details">

            <span>

              Account name

              <strong>
                {
                  donation.accountName
                }
              </strong>

            </span>


            <span>

              Bank / Wallet

              <strong>
                {donation.bank}
              </strong>

            </span>


            <span>

              Account / ID

              <strong>
                {
                  donation.accountNumber
                }
              </strong>

            </span>

          </div>

        </div>


        {/* QR */}

        <div className="qr-card">

          <span className="section-kicker">
            Scan to support
          </span>


          {donation.qrImage ? (

            <img
              src={
                donation.qrImage
              }
              alt="The Locals donation QR"
            />

          ) : (

            <div className="qr-placeholder">

              <div>
                QR
              </div>

              <small>
                Upload the official QR
                from Admin Dashboard
              </small>

            </div>

          )}


          <button
            type="button"
            className="text-link"
            onClick={
              copyDonationId
            }
            disabled={
              !donation.accountNumber ||
              donation.accountNumber ===
                "—"
            }
          >

            {copied ? (

              <>
                <Check size={16} />
                Copied
              </>

            ) : (

              <>
                <Copy size={16} />
                Copy donation ID
              </>

            )}

          </button>

        </div>

      </section>

    </div>
  );
}