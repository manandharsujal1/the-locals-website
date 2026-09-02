import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import {
  Plus,
  Trash2,
  Save,
  LayoutDashboard,
  CalendarDays,
  Heart,
  Inbox,
  Users,
  Music2,
  HandHeart,
  Building2,
  Mail,
  Phone,
  Clock,
  X,
  Search,
  CheckCircle2,
  UserCheck,
  UserX,
  MessageCircle,
  RefreshCw,
  LogOut,
  ExternalLink,
  ShieldCheck,
  ChevronRight
} from "lucide-react";

import Logo from "../components/Logo";
import { fallbackEvents } from "../data/fallback";

const API =
  import.meta.env.VITE_API_URL ||
  "http://localhost:4000/api";

const EMPTY_DONATION = {
  title: "Support The Locals",
  message: "",
  accountName: "The Locals Kathmandu",
  bank: "",
  accountNumber: "",
  qrImage: ""
};

const STATUS_OPTIONS = [
  "New",
  "Contacted",
  "Accepted",
  "Rejected"
];

const getToken = () =>
  localStorage.getItem("locals_admin_token");

const authHeaders = (includeContentType = true) => {
  const headers = {
    Authorization: `Bearer ${getToken()}`
  };

  if (includeContentType) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

export default function Admin() {
  const navigate = useNavigate();

  const [tab, setTab] = useState("dashboard");
  const [events, setEvents] = useState(fallbackEvents);
  const [donation, setDonation] = useState(EMPTY_DONATION);
  const [subs, setSubs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [applicationFilter, setApplicationFilter] = useState("All");
  const [applicationTypeFilter, setApplicationTypeFilter] = useState("All");
  const [applicationSearch, setApplicationSearch] = useState("");

  const adminUser = useMemo(() => {
    try {
      return JSON.parse(
        localStorage.getItem("locals_admin_user") || "{}"
      );
    } catch {
      return {};
    }
  }, []);

  const handleUnauthorized = useCallback(() => {
    localStorage.removeItem("locals_admin_token");
    localStorage.removeItem("locals_admin_user");

    navigate("/admin/login", {
      replace: true
    });
  }, [navigate]);

  const adminFetch = useCallback(
    async (url, options = {}) => {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...authHeaders(options.body !== undefined),
          ...(options.headers || {})
        }
      });

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        handleUnauthorized();
        throw new Error("Your session has expired.");
      }

      return response;
    },
    [handleUnauthorized]
  );

  const showNotice = (message) => {
    setNotice(message);
    setError("");

    window.setTimeout(() => {
      setNotice("");
    }, 3000);
  };

  const showError = (message) => {
    setError(message);
    setNotice("");
  };

  const loadApplications = useCallback(async () => {
    setLoadingApplications(true);

    try {
      const response = await adminFetch(
        `${API}/applications`
      );

      if (!response.ok) {
        throw new Error("Could not load applications.");
      }

      const data = await response.json();

      setApplications(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      if (err.message !== "Your session has expired.") {
        console.error(err);
        showError("Unable to load applications.");
      }
    } finally {
      setLoadingApplications(false);
    }
  }, [adminFetch]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [
        eventsResponse,
        donationResponse,
        submissionsResponse,
        applicationsResponse
      ] = await Promise.all([
        fetch(`${API}/events`),
        fetch(`${API}/donation`),
        adminFetch(`${API}/submissions`),
        adminFetch(`${API}/applications`)
      ]);

      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json();

        if (Array.isArray(eventsData)) {
          setEvents(eventsData);
        }
      }

      if (donationResponse.ok) {
        const donationData = await donationResponse.json();

        setDonation(
          donationData || EMPTY_DONATION
        );
      }

      if (submissionsResponse.ok) {
        const submissionsData =
          await submissionsResponse.json();

        setSubs(
          Array.isArray(submissionsData)
            ? submissionsData
            : []
        );
      }

      if (applicationsResponse.ok) {
        const applicationsData =
          await applicationsResponse.json();

        setApplications(
          Array.isArray(applicationsData)
            ? applicationsData
            : []
        );
      }
    } catch (err) {
      if (err.message !== "Your session has expired.") {
        console.error(err);
        showError(
          "Some dashboard information could not be loaded."
        );
      }
    } finally {
      setLoading(false);
    }
  }, [adminFetch]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const logout = () => {
    localStorage.removeItem("locals_admin_token");
    localStorage.removeItem("locals_admin_user");

    navigate("/admin/login", {
      replace: true
    });
  };

  const updateEvent = (index, field, value) => {
    setEvents((current) =>
      current.map((event, i) =>
        i === index
          ? {
              ...event,
              [field]: value
            }
          : event
      )
    );
  };

  const addEvent = () => {
    setEvents((current) => [
      ...current,
      {
        id: Date.now().toString(),
        title: "New Event",
        date: "",
        location: "Kathmandu",
        category: "Event",
        status: "Upcoming",
        description: ""
      }
    ]);
  };

  const removeEvent = (index) => {
    const confirmed =
      window.confirm("Remove this event?");

    if (!confirmed) return;

    setEvents((current) =>
      current.filter((_, i) => i !== index)
    );
  };

  const saveEvents = async () => {
    try {
      const response = await adminFetch(
        `${API}/events`,
        {
          method: "PUT",
          body: JSON.stringify(events)
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      showNotice("Events saved successfully.");
    } catch (err) {
      if (err.message !== "Your session has expired.") {
        showError("Unable to save events.");
      }
    }
  };

  const saveDonation = async () => {
    try {
      const response = await adminFetch(
        `${API}/donation`,
        {
          method: "PUT",
          body: JSON.stringify(donation)
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      showNotice("Donation details saved.");
    } catch (err) {
      if (err.message !== "Your session has expired.") {
        showError("Unable to save donation details.");
      }
    }
  };

  const updateApplicationStatus =
    async (id, status) => {
      try {
        const response = await adminFetch(
          `${API}/applications/${id}/status`,
          {
            method: "PATCH",
            body: JSON.stringify({ status })
          }
        );

        if (!response.ok) {
          throw new Error();
        }

        const updated = await response.json();

        setApplications((current) =>
          current.map((item) =>
            item.id === id
              ? updated
              : item
          )
        );

        setSelectedApplication((current) =>
          current?.id === id
            ? updated
            : current
        );

        showNotice(
          `Application marked as ${status}.`
        );
      } catch (err) {
        if (err.message !== "Your session has expired.") {
          showError("Unable to update application.");
        }
      }
    };

  const deleteApplication = async (id) => {
    const confirmed =
      window.confirm(
        "Delete this application permanently?"
      );

    if (!confirmed) return;

    try {
      const response = await adminFetch(
        `${API}/applications/${id}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      setApplications((current) =>
        current.filter(
          (item) => item.id !== id
        )
      );

      if (
        selectedApplication?.id === id
      ) {
        setSelectedApplication(null);
      }

      showNotice("Application deleted.");
    } catch (err) {
      if (err.message !== "Your session has expired.") {
        showError("Unable to delete application.");
      }
    }
  };

  const stats = useMemo(() => {
    return {
      total: applications.length,

      new: applications.filter(
        (item) =>
          item.status === "New"
      ).length,

      contacted: applications.filter(
        (item) =>
          item.status === "Contacted"
      ).length,

      accepted: applications.filter(
        (item) =>
          item.status === "Accepted"
      ).length,

      rejected: applications.filter(
        (item) =>
          item.status === "Rejected"
      ).length,

      performers: applications.filter(
        (item) =>
          item.applicationType === "perform"
      ).length,

      volunteers: applications.filter(
        (item) =>
          item.applicationType === "volunteer"
      ).length,

      collaborations:
        applications.filter(
          (item) =>
            item.applicationType === "collaborate"
        ).length
    };
  }, [applications]);

  const filteredApplications =
    useMemo(() => {
      return applications.filter(
        (application) => {
          const statusMatch =
            applicationFilter === "All" ||
            application.status ===
              applicationFilter;

          const typeMatch =
            applicationTypeFilter === "All" ||
            application.applicationType ===
              applicationTypeFilter;

          const search =
            applicationSearch
              .trim()
              .toLowerCase();

          const searchMatch =
            !search ||
            [
              application.name,
              application.email,
              application.phone,
              application.event,
              application.role,
              application.organisation
            ]
              .filter(Boolean)
              .join(" ")
              .toLowerCase()
              .includes(search);

          return (
            statusMatch &&
            typeMatch &&
            searchMatch
          );
        }
      );
    }, [
      applications,
      applicationFilter,
      applicationTypeFilter,
      applicationSearch
    ]);

  const getTypeLabel = (type) => {
    if (type === "perform") {
      return "Performer";
    }

    if (type === "volunteer") {
      return "Volunteer";
    }

    if (type === "collaborate") {
      return "Collaboration";
    }

    return type || "Application";
  };

  const getTypeIcon = (type) => {
    if (type === "perform") {
      return <Music2 size={17} />;
    }

    if (type === "volunteer") {
      return <HandHeart size={17} />;
    }

    return <Building2 size={17} />;
  };

  const formatDate = (date) => {
    if (!date) return "—";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return date;
    }

    return parsed.toLocaleString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit"
      }
    );
  };

  const formatShortDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric"
      }
    );
  };

  const tabTitle = {
    dashboard: "Dashboard",
    events: "Events",
    applications: "Applications",
    donation: "Donation",
    submissions: "Submissions"
  }[tab];

  return (
    <div className="admin-shell">

      <aside className="admin-side">

        <div>

          <div className="admin-brand">

            <Logo />

            <div className="admin-brand-meta">
              <span>ADMIN CONSOLE</span>
              <strong>The Locals</strong>
            </div>

          </div>

          <div className="admin-nav-label">
            Workspace
          </div>

          <nav className="admin-nav">

            <button
              type="button"
              onClick={() =>
                setTab("dashboard")
              }
              className={
                tab === "dashboard"
                  ? "active"
                  : ""
              }
            >
              <LayoutDashboard />
              <span>Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() =>
                setTab("events")
              }
              className={
                tab === "events"
                  ? "active"
                  : ""
              }
            >
              <CalendarDays />
              <span>Events</span>
              <small>{events.length}</small>
            </button>

            <button
              type="button"
              onClick={() =>
                setTab("applications")
              }
              className={
                tab === "applications"
                  ? "active"
                  : ""
              }
            >
              <Users />
              <span>Applications</span>

              {stats.new > 0 && (
                <small className="nav-alert">
                  {stats.new}
                </small>
              )}
            </button>

            <button
              type="button"
              onClick={() =>
                setTab("donation")
              }
              className={
                tab === "donation"
                  ? "active"
                  : ""
              }
            >
              <Heart />
              <span>Donation</span>
            </button>

            <button
              type="button"
              onClick={() =>
                setTab("submissions")
              }
              className={
                tab === "submissions"
                  ? "active"
                  : ""
              }
            >
              <Inbox />
              <span>Submissions</span>

              {subs.length > 0 && (
                <small>
                  {subs.length}
                </small>
              )}
            </button>

          </nav>

        </div>

        <div className="admin-side-bottom">

          <div className="admin-side-user">

            <div className="admin-user-avatar">
              TL
            </div>

            <div>
              <strong>The Locals</strong>

              <span>
                {adminUser.email ||
                  "Administrator"}
              </span>
            </div>

          </div>

          <Link
            to="/"
            className="back-site"
          >
            <ExternalLink size={15} />
            View website
          </Link>

          <button
            type="button"
            className="admin-logout"
            onClick={logout}
          >
            <LogOut size={15} />
            Logout
          </button>

        </div>

      </aside>

      <main className="admin-main">

        <header className="admin-top">

          <div>
            <span>THE LOCALS · ADMIN</span>
            <h1>{tabTitle}</h1>
          </div>

          <div className="admin-top-actions">

            <div className="admin-secure-badge">
              <ShieldCheck size={16} />
              Secure session
            </div>

            <button
              type="button"
              className="admin-refresh"
              onClick={refresh}
              title="Refresh data"
            >
              <RefreshCw size={18} />
            </button>

            <button
              type="button"
              className="admin-top-logout"
              onClick={logout}
            >
              <LogOut size={16} />
              Logout
            </button>

          </div>

        </header>

        {notice && (
          <div className="admin-notice success-notice">
            <CheckCircle2 size={17} />
            {notice}
          </div>
        )}

        {error && (
          <div className="admin-notice error-notice">
            <X size={17} />
            {error}
          </div>
        )}

        {tab === "dashboard" && (
          <section className="admin-dashboard">

            <div className="admin-dashboard-intro">

              <div>
                <span className="admin-eyebrow">
                  Overview
                </span>

                <h2>
                  Manage your
                  <em> community.</em>
                </h2>
              </div>

              <div className="admin-dashboard-intro-copy">
                <p>
                  Events, applications,
                  enquiries and community
                  management — all from one
                  workspace.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setTab("applications")
                  }
                >
                  Review applications
                  <ChevronRight size={15} />
                </button>
              </div>

            </div>

            <div className="admin-stat-grid">

              <button
                type="button"
                className="admin-stat-card red"
                onClick={() =>
                  setTab("applications")
                }
              >
                <div className="admin-stat-top">
                  <div className="admin-stat-icon">
                    <Users size={20} />
                  </div>
                  <span>01</span>
                </div>

                <div className="admin-stat-body">
                  <small>Applications</small>
                  <strong>{stats.total}</strong>
                  <p>
                    {stats.new} new application
                    {stats.new === 1 ? "" : "s"}
                  </p>
                </div>
              </button>

              <button
                type="button"
                className="admin-stat-card black"
                onClick={() =>
                  setTab("events")
                }
              >
                <div className="admin-stat-top">
                  <div className="admin-stat-icon">
                    <CalendarDays size={20} />
                  </div>
                  <span>02</span>
                </div>

                <div className="admin-stat-body">
                  <small>Website Events</small>
                  <strong>{events.length}</strong>
                  <p>Manage public events</p>
                </div>
              </button>

              <button
                type="button"
                className="admin-stat-card white"
                onClick={() =>
                  setTab("submissions")
                }
              >
                <div className="admin-stat-top">
                  <div className="admin-stat-icon">
                    <Inbox size={20} />
                  </div>
                  <span>03</span>
                </div>

                <div className="admin-stat-body">
                  <small>Enquiries</small>
                  <strong>{subs.length}</strong>
                  <p>Website submissions</p>
                </div>
              </button>

              <button
                type="button"
                className="admin-stat-card white"
                onClick={() => {
                  setApplicationFilter("Accepted");
                  setTab("applications");
                }}
              >
                <div className="admin-stat-top">
                  <div className="admin-stat-icon">
                    <UserCheck size={20} />
                  </div>
                  <span>04</span>
                </div>

                <div className="admin-stat-body">
                  <small>Accepted</small>
                  <strong>{stats.accepted}</strong>
                  <p>Approved applications</p>
                </div>
              </button>

            </div>

            <div className="admin-dashboard-grid">

              <div className="admin-dashboard-panel admin-recent-panel">

                <div className="admin-panel-heading">
                  <div>
                    <span>APPLICATIONS</span>
                    <h3>Recent applications</h3>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setTab("applications")
                    }
                  >
                    View all
                    <ChevronRight size={14} />
                  </button>
                </div>

                {loadingApplications || loading ? (
                  <div className="admin-panel-loading">
                    Loading applications...
                  </div>
                ) : applications.length ? (
                  <div className="admin-recent-list">

                    {applications
                      .slice(0, 6)
                      .map((application) => (
                        <button
                          type="button"
                          key={application.id}
                          onClick={() => {
                            setSelectedApplication(
                              application
                            );

                            setTab("applications");
                          }}
                        >
                          <div className="admin-recent-avatar">
                            {application.name
                              ?.charAt(0)
                              ?.toUpperCase() ||
                              "?"}
                          </div>

                          <div className="admin-recent-person">
                            <strong>
                              {application.name}
                            </strong>

                            <span>
                              {getTypeLabel(
                                application.applicationType
                              )}
                              {" · "}
                              {application.event ||
                                "General"}
                            </span>
                          </div>

                          <span className="admin-recent-date">
                            {formatShortDate(
                              application.createdAt
                            )}
                          </span>

                          <span
                            className={`application-status status-${application.status?.toLowerCase()}`}
                          >
                            {application.status}
                          </span>
                        </button>
                      ))}

                  </div>
                ) : (
                  <div className="admin-empty-state">
                    <div className="admin-empty-icon">
                      <Users size={24} />
                    </div>

                    <h4>No applications yet</h4>

                    <p>
                      New performer, volunteer
                      and collaboration requests
                      will appear here.
                    </p>

                    <Link to="/join">
                      View join page
                      <ExternalLink size={14} />
                    </Link>
                  </div>
                )}

              </div>

              <div className="admin-dashboard-panel admin-breakdown-panel">

                <div className="admin-panel-heading">
                  <div>
                    <span>COMMUNITY</span>
                    <h3>
                      Application breakdown
                    </h3>
                  </div>
                </div>

                <div className="application-breakdown">

                  <button
                    type="button"
                    onClick={() => {
                      setApplicationTypeFilter("perform");
                      setTab("applications");
                    }}
                  >
                    <div>
                      <div className="breakdown-icon">
                        <Music2 size={17} />
                      </div>
                      <span>Performers</span>
                    </div>

                    <strong>
                      {stats.performers}
                    </strong>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setApplicationTypeFilter("volunteer");
                      setTab("applications");
                    }}
                  >
                    <div>
                      <div className="breakdown-icon">
                        <HandHeart size={17} />
                      </div>
                      <span>Volunteers</span>
                    </div>

                    <strong>
                      {stats.volunteers}
                    </strong>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setApplicationTypeFilter("collaborate");
                      setTab("applications");
                    }}
                  >
                    <div>
                      <div className="breakdown-icon">
                        <Building2 size={17} />
                      </div>
                      <span>Collaborations</span>
                    </div>

                    <strong>
                      {stats.collaborations}
                    </strong>
                  </button>

                </div>

                <div className="breakdown-footer">
                  <span>
                    Total community requests
                  </span>

                  <strong>{stats.total}</strong>
                </div>

              </div>

            </div>

            <div className="admin-quick-actions">

              <div>
                <span>QUICK ACTIONS</span>
                <h3>Keep things moving.</h3>
              </div>

              <div className="admin-quick-buttons">

                <button
                  type="button"
                  onClick={() =>
                    setTab("events")
                  }
                >
                  <CalendarDays size={17} />
                  Manage events
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setTab("applications")
                  }
                >
                  <Users size={17} />
                  Review applications
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setTab("donation")
                  }
                >
                  <Heart size={17} />
                  Donation settings
                </button>

                <Link to="/">
                  <ExternalLink size={17} />
                  Open website
                </Link>

              </div>

            </div>

          </section>
        )}

        {tab === "events" && (
          <section className="admin-content-section">

            <div className="admin-section-header">
              <div>
                <span>PUBLIC WEBSITE</span>
                <h2>Manage events</h2>

                <p>
                  Create, edit and manage
                  the events displayed on
                  the public website.
                </p>
              </div>

              <button
                type="button"
                className="admin-primary-action"
                onClick={addEvent}
              >
                <Plus size={16} />
                Add event
              </button>
            </div>

            <div className="admin-list">

              {events.map((event, index) => (
                <article
                  className="admin-event-card"
                  key={event.id}
                >
                  <div className="admin-event-number">
                    {String(index + 1).padStart(
                      2,
                      "0"
                    )}
                  </div>

                  <div className="admin-event-form">

                    <div className="admin-card-row">
                      <input
                        className="admin-event-title"
                        value={event.title}
                        onChange={(e) =>
                          updateEvent(
                            index,
                            "title",
                            e.target.value
                          )
                        }
                      />

                      <button
                        type="button"
                        className="icon-btn"
                        onClick={() =>
                          removeEvent(index)
                        }
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>

                    <div className="grid-2">

                      <label>
                        <span>Date</span>
                        <input
                          placeholder="Event date"
                          value={event.date}
                          onChange={(e) =>
                            updateEvent(
                              index,
                              "date",
                              e.target.value
                            )
                          }
                        />
                      </label>

                      <label>
                        <span>Location</span>
                        <input
                          placeholder="Kathmandu"
                          value={event.location}
                          onChange={(e) =>
                            updateEvent(
                              index,
                              "location",
                              e.target.value
                            )
                          }
                        />
                      </label>

                      <label>
                        <span>Category</span>
                        <input
                          placeholder="Cultural Event"
                          value={event.category}
                          onChange={(e) =>
                            updateEvent(
                              index,
                              "category",
                              e.target.value
                            )
                          }
                        />
                      </label>

                      <label>
                        <span>Status</span>
                        <input
                          placeholder="Upcoming"
                          value={event.status}
                          onChange={(e) =>
                            updateEvent(
                              index,
                              "status",
                              e.target.value
                            )
                          }
                        />
                      </label>

                    </div>

                    <label className="admin-description-field">
                      <span>Description</span>

                      <textarea
                        rows="4"
                        value={event.description}
                        onChange={(e) =>
                          updateEvent(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                      />
                    </label>

                  </div>
                </article>
              ))}

            </div>

            <div className="admin-save-bar">
              <span>
                {events.length} event
                {events.length === 1 ? "" : "s"}{" "}
                currently configured.
              </span>

              <button
                type="button"
                className="admin-primary-action"
                onClick={saveEvents}
              >
                <Save size={16} />
                Save events
              </button>
            </div>

          </section>
        )}

        {tab === "applications" && (
          <section className="applications-admin admin-content-section">

            <div className="admin-section-header">
              <div>
                <span>COMMUNITY</span>
                <h2>Applications</h2>

                <p>
                  Review performers,
                  volunteers and
                  collaboration requests.
                </p>
              </div>
            </div>

            <div className="application-stats">
              {[
                ["All", stats.total],
                ["New", stats.new],
                ["Contacted", stats.contacted],
                ["Accepted", stats.accepted],
                ["Rejected", stats.rejected]
              ].map(([label, value]) => (
                <button
                  type="button"
                  key={label}
                  className={
                    applicationFilter === label
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setApplicationFilter(label)
                  }
                >
                  <span>{label}</span>
                  <strong>{value}</strong>
                </button>
              ))}
            </div>

            <div className="applications-toolbar">

              <div className="admin-search">
                <Search size={17} />

                <input
                  type="search"
                  value={applicationSearch}
                  onChange={(e) =>
                    setApplicationSearch(
                      e.target.value
                    )
                  }
                  placeholder="Search by name, email, event or role..."
                />
              </div>

              <select
                value={applicationTypeFilter}
                onChange={(e) =>
                  setApplicationTypeFilter(
                    e.target.value
                  )
                }
              >
                <option value="All">
                  All application types
                </option>

                <option value="perform">
                  Performers
                </option>

                <option value="volunteer">
                  Volunteers
                </option>

                <option value="collaborate">
                  Collaborations
                </option>
              </select>

              <button
                type="button"
                className="application-refresh"
                onClick={loadApplications}
              >
                <RefreshCw size={16} />
                Refresh
              </button>

            </div>

            {loadingApplications ? (
              <div className="applications-loading">
                Loading applications...
              </div>
            ) : filteredApplications.length ? (
              <div className="applications-table">

                <div className="applications-table-head">
                  <span>Applicant</span>
                  <span>Type</span>
                  <span>Event / Role</span>
                  <span>Status</span>
                  <span>Submitted</span>
                  <span />
                </div>

                {filteredApplications.map(
                  (application) => (
                    <div
                      className="application-row"
                      key={application.id}
                      onClick={() =>
                        setSelectedApplication(
                          application
                        )
                      }
                    >
                      <div className="application-person">
                        <div className="application-avatar">
                          {application.name
                            ?.charAt(0)
                            ?.toUpperCase() ||
                            "?"}
                        </div>

                        <div>
                          <strong>
                            {application.name}
                          </strong>

                          <span>
                            {application.email}
                          </span>
                        </div>
                      </div>

                      <div className="application-type">
                        {getTypeIcon(
                          application.applicationType
                        )}

                        <span>
                          {getTypeLabel(
                            application.applicationType
                          )}
                        </span>
                      </div>

                      <div className="application-event">
                        <strong>
                          {application.event ||
                            "General"}
                        </strong>

                        <span>
                          {application.role ||
                            application.organisation ||
                            "—"}
                        </span>
                      </div>

                      <span
                        className={`application-status status-${application.status?.toLowerCase()}`}
                      >
                        {application.status}
                      </span>

                      <span className="application-date">
                        {formatDate(
                          application.createdAt
                        )}
                      </span>

                      <button
                        type="button"
                        className="application-open"
                        onClick={(e) => {
                          e.stopPropagation();

                          setSelectedApplication(
                            application
                          );
                        }}
                      >
                        View
                      </button>
                    </div>
                  )
                )}

              </div>
            ) : (
              <div className="applications-empty">
                <div className="admin-empty-icon">
                  <Users size={25} />
                </div>

                <h3>
                  No applications found.
                </h3>

                <p>
                  Applications matching
                  your filters will appear
                  here.
                </p>
              </div>
            )}

          </section>
        )}

        {tab === "donation" && (
          <section className="admin-content-section">

            <div className="admin-section-header">
              <div>
                <span>SUPPORT</span>
                <h2>Donation settings</h2>

                <p>
                  Manage public donation
                  details shown on The
                  Locals website.
                </p>
              </div>
            </div>

            <div className="donation-admin admin-form-panel">

              <label>
                <span>Section title</span>

                <input
                  value={donation.title || ""}
                  onChange={(e) =>
                    setDonation({
                      ...donation,
                      title:
                        e.target.value
                    })
                  }
                />
              </label>

              <label>
                <span>Public message</span>

                <textarea
                  rows="5"
                  value={
                    donation.message || ""
                  }
                  onChange={(e) =>
                    setDonation({
                      ...donation,
                      message:
                        e.target.value
                    })
                  }
                />
              </label>

              <div className="grid-2">

                <label>
                  <span>Account name</span>

                  <input
                    value={
                      donation.accountName ||
                      ""
                    }
                    onChange={(e) =>
                      setDonation({
                        ...donation,
                        accountName:
                          e.target.value
                      })
                    }
                  />
                </label>

                <label>
                  <span>Bank / Wallet</span>

                  <input
                    value={
                      donation.bank || ""
                    }
                    onChange={(e) =>
                      setDonation({
                        ...donation,
                        bank:
                          e.target.value
                      })
                    }
                  />
                </label>

                <label>
                  <span>Account / ID</span>

                  <input
                    value={
                      donation.accountNumber ||
                      ""
                    }
                    onChange={(e) =>
                      setDonation({
                        ...donation,
                        accountNumber:
                          e.target.value
                      })
                    }
                  />
                </label>

                <label>
                  <span>QR image URL</span>

                  <input
                    value={
                      donation.qrImage ||
                      ""
                    }
                    onChange={(e) =>
                      setDonation({
                        ...donation,
                        qrImage:
                          e.target.value
                      })
                    }
                  />
                </label>

              </div>

              <button
                type="button"
                className="admin-primary-action"
                onClick={saveDonation}
              >
                <Save size={16} />
                Save donation details
              </button>

            </div>

          </section>
        )}

        {tab === "submissions" && (
          <section className="admin-content-section">

            <div className="admin-section-header">
              <div>
                <span>INBOX</span>
                <h2>Submissions</h2>

                <p>
                  Messages and enquiries
                  submitted through the
                  website.
                </p>
              </div>
            </div>

            <div className="submissions">

              {subs.length ? (
                subs.map(
                  (submission, index) => (
                    <article
                      className="submission"
                      key={
                        submission.id ||
                        index
                      }
                    >
                      <div className="submission-head">

                        <div className="submission-avatar">
                          {submission.name
                            ?.charAt(0)
                            ?.toUpperCase() ||
                            "V"}
                        </div>

                        <div>
                          <strong>
                            {submission.name ||
                              "Visitor"}
                          </strong>

                          <span>
                            {submission.email}
                          </span>
                        </div>

                        <small>
                          {formatDate(
                            submission.createdAt
                          )}
                        </small>

                      </div>

                      <div className="submission-category">
                        {submission.subject ||
                          submission.type ||
                          "Website enquiry"}
                      </div>

                      <p>
                        {submission.message}
                      </p>
                    </article>
                  )
                )
              ) : (
                <div className="applications-empty">
                  <div className="admin-empty-icon">
                    <Inbox size={25} />
                  </div>

                  <h3>
                    No submissions yet.
                  </h3>

                  <p>
                    Website enquiries will
                    appear here.
                  </p>
                </div>
              )}

            </div>

          </section>
        )}

      </main>

      {selectedApplication && (
        <div
          className="application-modal-backdrop"
          onClick={() =>
            setSelectedApplication(null)
          }
        >
          <aside
            className="application-drawer"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div className="application-drawer-header">
              <div>
                <span>
                  Application details
                </span>

                <h2>
                  {selectedApplication.name}
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedApplication(
                    null
                  )
                }
              >
                <X size={21} />
              </button>
            </div>

            <div className="drawer-application-type">
              <div>
                {getTypeIcon(
                  selectedApplication.applicationType
                )}
              </div>

              <div>
                <span>
                  Application type
                </span>

                <strong>
                  {getTypeLabel(
                    selectedApplication.applicationType
                  )}
                </strong>
              </div>
            </div>

            <div className="drawer-section">
              <span className="drawer-label">
                Contact
              </span>

              <a
                href={`mailto:${selectedApplication.email}`}
              >
                <Mail size={17} />

                <div>
                  <span>Email</span>
                  <strong>
                    {selectedApplication.email}
                  </strong>
                </div>
              </a>

              <a
                href={`tel:${selectedApplication.phone}`}
              >
                <Phone size={17} />

                <div>
                  <span>Phone</span>
                  <strong>
                    {selectedApplication.phone}
                  </strong>
                </div>
              </a>
            </div>

            <div className="drawer-section">
              <span className="drawer-label">
                Application
              </span>

              <ApplicationDetail
                icon={<CalendarDays />}
                label="Event"
                value={
                  selectedApplication.event ||
                  "Not specified"
                }
              />

              <ApplicationDetail
                icon={<Users />}
                label="Role / Interest"
                value={
                  selectedApplication.role ||
                  selectedApplication.organisation ||
                  "Not specified"
                }
              />

              <ApplicationDetail
                icon={<Clock />}
                label="Availability"
                value={
                  selectedApplication.availability ||
                  "Not specified"
                }
              />

              {selectedApplication.age && (
                <ApplicationDetail
                  icon={<Users />}
                  label="Age"
                  value={
                    selectedApplication.age
                  }
                />
              )}
            </div>

            {selectedApplication.experience && (
              <div className="drawer-text-section">
                <span>Experience</span>

                <p>
                  {selectedApplication.experience}
                </p>
              </div>
            )}

            {selectedApplication.message && (
              <div className="drawer-text-section">
                <span>Message</span>

                <p>
                  {selectedApplication.message}
                </p>
              </div>
            )}

            <div className="drawer-text-section">
              <span>Submitted</span>

              <p>
                {formatDate(
                  selectedApplication.createdAt
                )}
              </p>
            </div>

            <div className="drawer-status">
              <span>
                Application status
              </span>

              <div className="drawer-status-options">

                {STATUS_OPTIONS.map(
                  (status) => (
                    <button
                      type="button"
                      key={status}
                      className={
                        selectedApplication.status ===
                        status
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        updateApplicationStatus(
                          selectedApplication.id,
                          status
                        )
                      }
                    >
                      {status === "Accepted" && (
                        <UserCheck size={15} />
                      )}

                      {status === "Rejected" && (
                        <UserX size={15} />
                      )}

                      {status === "Contacted" && (
                        <MessageCircle size={15} />
                      )}

                      {status === "New" && (
                        <Inbox size={15} />
                      )}

                      {status}
                    </button>
                  )
                )}

              </div>
            </div>

            <button
              type="button"
              className="drawer-delete"
              onClick={() =>
                deleteApplication(
                  selectedApplication.id
                )
              }
            >
              <Trash2 size={16} />
              Delete application
            </button>

          </aside>
        </div>
      )}

    </div>
  );
}

function ApplicationDetail({
  icon,
  label,
  value
}) {
  return (
    <div className="application-detail">
      {icon}

      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}
