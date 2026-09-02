import express from "express";
import cors from "cors";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import {
  createClient
} from "@supabase/supabase-js";


// ============================================================
// ENVIRONMENT
// ============================================================

dotenv.config();


// ============================================================
// CONFIGURATION
// ============================================================

const PORT =
  process.env.PORT || 4000;

const JWT_SECRET =
  process.env.JWT_SECRET;

const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL;

const ADMIN_PASSWORD_HASH =
  process.env.ADMIN_PASSWORD_HASH;

const SUPABASE_URL =
  process.env.SUPABASE_URL;

const SUPABASE_SECRET_KEY =
  process.env.SUPABASE_SECRET_KEY;


// ============================================================
// CHECK ENVIRONMENT VARIABLES
// ============================================================

const requiredVariables = [
  ["JWT_SECRET", JWT_SECRET],
  ["ADMIN_EMAIL", ADMIN_EMAIL],
  ["ADMIN_PASSWORD_HASH", ADMIN_PASSWORD_HASH],
  ["SUPABASE_URL", SUPABASE_URL],
  ["SUPABASE_SECRET_KEY", SUPABASE_SECRET_KEY]
];


for (
  const [name, value]
  of requiredVariables
) {

  if (!value) {

    console.error(
      `ERROR: ${name} is missing from server/.env`
    );

    process.exit(1);

  }

}


// ============================================================
// SUPABASE
// ============================================================

const supabase =
  createClient(
    SUPABASE_URL,
    SUPABASE_SECRET_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    }
  );


// ============================================================
// EXPRESS APP
// ============================================================

const app = express();


// ============================================================
// CORS
// ============================================================

const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL
].filter(Boolean);


app.use(
  cors({
    origin(origin, callback) {

      /*
       * Requests without an Origin header,
       * such as Postman/server requests,
       * are allowed.
       */

      if (!origin) {

        return callback(
          null,
          true
        );

      }


      if (
        allowedOrigins.includes(
          origin
        )
      ) {

        return callback(
          null,
          true
        );

      }


      return callback(
        new Error(
          "Origin not allowed by CORS."
        )
      );

    },

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS"
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization"
    ]
  })
);


// ============================================================
// JSON BODY
// ============================================================

app.use(
  express.json({
    limit: "2mb"
  })
);


// ============================================================
// DATABASE MAPPERS
// ============================================================

function mapEvent(row) {

  if (!row) {
    return null;
  }


  return {
    id:
      row.id,

    title:
      row.title,

    date:
      row.date || "",

    time:
      row.time || "",

    location:
      row.location || "",

    category:
      row.category || "",

    status:
      row.status || "",

    description:
      row.description || "",

    shortDescription:
      row.short_description || "",

    image:
      row.image || "",

    highlights:
      row.highlights || []
  };

}


function mapDonation(row) {

  if (!row) {

    return {
      title:
        "Support The Locals",

      message:
        "",

      accountName:
        "",

      bank:
        "",

      accountNumber:
        "",

      qrImage:
        ""
    };

  }


  return {
    title:
      row.title || "",

    message:
      row.message || "",

    accountName:
      row.account_name || "",

    bank:
      row.bank || "",

    accountNumber:
      row.account_number || "",

    qrImage:
      row.qr_image || ""
  };

}


function mapSubmission(row) {

  if (!row) {
    return null;
  }


  return {
    id:
      row.id,

    name:
      row.name || "",

    email:
      row.email || "",

    subject:
      row.subject || "",

    type:
      row.type || "",

    message:
      row.message || "",

    createdAt:
      row.created_at
  };

}


function mapApplication(row) {

  if (!row) {
    return null;
  }


  return {
    id:
      row.id,

    applicationType:
      row.application_type,

    name:
      row.name,

    email:
      row.email,

    phone:
      row.phone,

    age:
      row.age || "",

    event:
      row.event || "",

    role:
      row.role || "",

    experience:
      row.experience || "",

    availability:
      row.availability || "",

    organisation:
      row.organisation || "",

    message:
      row.message || "",

    status:
      row.status || "New",

    createdAt:
      row.created_at,

    updatedAt:
      row.updated_at
  };

}


// ============================================================
// AUTH MIDDLEWARE
// ============================================================

const requireAdmin = (
  req,
  res,
  next
) => {

  const authHeader =
    req.headers.authorization;


  if (
    !authHeader ||
    !authHeader.startsWith(
      "Bearer "
    )
  ) {

    return res
      .status(401)
      .json({
        message:
          "Authentication required."
      });

  }


  const token =
    authHeader.substring(7);


  if (!token) {

    return res
      .status(401)
      .json({
        message:
          "Authentication required."
      });

  }


  try {

    const decoded =
      jwt.verify(
        token,
        JWT_SECRET
      );


    if (
      decoded.role !==
      "admin"
    ) {

      return res
        .status(403)
        .json({
          message:
            "Admin access required."
        });

    }


    req.admin =
      decoded;

    next();

  } catch {

    return res
      .status(401)
      .json({
        message:
          "Invalid or expired session."
      });

  }

};


// ============================================================
// HEALTH
// ============================================================

app.get(
  "/api/health",

  async (_, res) => {

    try {

      const {
        error
      } =
        await supabase
          .from("events")
          .select(
            "id",
            {
              head: true,
              count: "exact"
            }
          );


      if (error) {
        throw error;
      }


      res.json({
        ok: true,

        service:
          "The Locals API",

        database:
          "connected"
      });

    } catch (error) {

      console.error(
        "Health check error:",
        error
      );


      res
        .status(500)
        .json({
          ok: false,

          service:
            "The Locals API",

          database:
            "error"
        });

    }

  }
);


// ============================================================
// ADMIN LOGIN
// ============================================================

app.post(
  "/api/admin/login",

  async (req, res) => {

    try {

      const {
        email,
        password
      } =
        req.body || {};


      if (
        !email ||
        !password
      ) {

        return res
          .status(400)
          .json({
            message:
              "Email and password are required."
          });

      }


      const normalizedEmail =
        String(email)
          .trim()
          .toLowerCase();


      const configuredEmail =
        String(
          ADMIN_EMAIL
        )
          .trim()
          .toLowerCase();


      if (
        normalizedEmail !==
        configuredEmail
      ) {

        return res
          .status(401)
          .json({
            message:
              "Invalid email or password."
          });

      }


      const passwordCorrect =
        await bcrypt.compare(
          String(password),
          ADMIN_PASSWORD_HASH
        );


      if (
        !passwordCorrect
      ) {

        return res
          .status(401)
          .json({
            message:
              "Invalid email or password."
          });

      }


      const token =
        jwt.sign(
          {
            email:
              normalizedEmail,

            role:
              "admin"
          },

          JWT_SECRET,

          {
            expiresIn:
              "8h"
          }
        );


      return res.json({

        message:
          "Login successful.",

        token,

        user: {

          name:
            "The Locals Admin",

          email:
            normalizedEmail,

          role:
            "admin"
        }

      });

    } catch (error) {

      console.error(
        "Admin login error:",
        error
      );


      return res
        .status(500)
        .json({
          message:
            "Unable to login. Please try again."
        });

    }

  }
);


// ============================================================
// VERIFY ADMIN SESSION
// ============================================================

app.get(
  "/api/admin/me",

  requireAdmin,

  (req, res) => {

    res.json({

      authenticated:
        true,

      user: {

        name:
          "The Locals Admin",

        email:
          req.admin.email,

        role:
          req.admin.role
      }

    });

  }
);


// ============================================================
// EVENTS
// ============================================================


// ------------------------------------------------------------
// PUBLIC: GET EVENTS
// ------------------------------------------------------------

app.get(
  "/api/events",

  async (_, res) => {

    try {

      const {
        data,
        error
      } =
        await supabase
          .from("events")
          .select("*")
          .order(
            "created_at",
            {
              ascending: true
            }
          );


      if (error) {
        throw error;
      }


      res.json(
        (data || []).map(
          mapEvent
        )
      );

    } catch (error) {

      console.error(
        "Get events error:",
        error
      );


      res
        .status(500)
        .json({
          message:
            "Unable to load events."
        });

    }

  }
);


// ------------------------------------------------------------
// ADMIN: UPDATE EVENTS
// ------------------------------------------------------------

app.put(
  "/api/events",

  requireAdmin,

  async (req, res) => {

    try {

      if (
        !Array.isArray(
          req.body
        )
      ) {

        return res
          .status(400)
          .json({
            message:
              "Events must be an array."
          });

      }


      const incomingEvents =
        req.body;


      /*
       * Get existing IDs first.
       * This allows PUT /events to keep
       * the same behaviour as your old
       * content.json implementation:
       * the submitted array becomes the
       * complete event list.
       */

      const {
        data:
          existingRows,

        error:
          existingError
      } =
        await supabase
          .from("events")
          .select("id");


      if (existingError) {
        throw existingError;
      }


      const incomingIds =
        new Set(
          incomingEvents.map(
            (event) =>
              String(
                event.id
              )
          )
        );


      const idsToDelete =
        (existingRows || [])
          .map(
            (row) =>
              row.id
          )
          .filter(
            (id) =>
              !incomingIds.has(
                String(id)
              )
          );


      if (
        idsToDelete.length
      ) {

        const {
          error:
            deleteError
        } =
          await supabase
            .from("events")
            .delete()
            .in(
              "id",
              idsToDelete
            );


        if (deleteError) {
          throw deleteError;
        }

      }


      if (
        incomingEvents.length ===
        0
      ) {

        return res.json(
          []
        );

      }


      const rows =
        incomingEvents.map(
          (event) => ({

            id:
              String(
                event.id ||
                crypto.randomUUID()
              ),

            title:
              String(
                event.title ||
                "Untitled Event"
              ).trim(),

            date:
              event.date ||
              "",

            time:
              event.time ||
              "",

            location:
              event.location ||
              "",

            category:
              event.category ||
              "",

            status:
              event.status ||
              "",

            description:
              event.description ||
              "",

            short_description:
              event.shortDescription ||
              "",

            image:
              event.image ||
              "",

            highlights:
              Array.isArray(
                event.highlights
              )
                ? event.highlights
                : [],

            updated_at:
              new Date()
                .toISOString()
          })
        );


      const {
        data,
        error
      } =
        await supabase
          .from("events")
          .upsert(
            rows,
            {
              onConflict:
                "id"
            }
          )
          .select();


      if (error) {
        throw error;
      }


      const eventMap =
        new Map(
          (data || []).map(
            (row) => [
              String(row.id),
              mapEvent(row)
            ]
          )
        );


      /*
       * Return events in the same order
       * sent by the Admin interface.
       */

      const responseEvents =
        rows.map(
          (row) =>
            eventMap.get(
              String(row.id)
            ) ||
            mapEvent(row)
        );


      res.json(
        responseEvents
      );

    } catch (error) {

      console.error(
        "Update events error:",
        error
      );


      res
        .status(500)
        .json({
          message:
            "Unable to save events."
        });

    }

  }
);


// ============================================================
// DONATION
// ============================================================


// ------------------------------------------------------------
// PUBLIC: GET DONATION DETAILS
// ------------------------------------------------------------

app.get(
  "/api/donation",

  async (_, res) => {

    try {

      const {
        data,
        error
      } =
        await supabase
          .from("donation")
          .select("*")
          .eq(
            "id",
            1
          )
          .maybeSingle();


      if (error) {
        throw error;
      }


      res.json(
        mapDonation(
          data
        )
      );

    } catch (error) {

      console.error(
        "Get donation error:",
        error
      );


      res
        .status(500)
        .json({
          message:
            "Unable to load donation details."
        });

    }

  }
);


// ------------------------------------------------------------
// ADMIN: UPDATE DONATION DETAILS
// ------------------------------------------------------------

app.put(
  "/api/donation",

  requireAdmin,

  async (req, res) => {

    try {

      const donation =
        req.body || {};


      const row = {

        id:
          1,

        title:
          donation.title ||
          "",

        message:
          donation.message ||
          "",

        account_name:
          donation.accountName ||
          "",

        bank:
          donation.bank ||
          "",

        account_number:
          donation.accountNumber ||
          "",

        qr_image:
          donation.qrImage ||
          "",

        updated_at:
          new Date()
            .toISOString()
      };


      const {
        data,
        error
      } =
        await supabase
          .from("donation")
          .upsert(
            row,
            {
              onConflict:
                "id"
            }
          )
          .select()
          .single();


      if (error) {
        throw error;
      }


      res.json(
        mapDonation(
          data
        )
      );

    } catch (error) {

      console.error(
        "Update donation error:",
        error
      );


      res
        .status(500)
        .json({
          message:
            "Unable to update donation details."
        });

    }

  }
);


// ============================================================
// CONTACT SUBMISSIONS
// ============================================================


// ------------------------------------------------------------
// PUBLIC: CREATE SUBMISSION
// ------------------------------------------------------------

app.post(
  "/api/submissions",

  async (req, res) => {

    try {

      const {
        name,
        email,
        subject,
        type,
        message
      } =
        req.body || {};


      if (
        !name ||
        !email ||
        !message
      ) {

        return res
          .status(400)
          .json({
            message:
              "Name, email and message are required."
          });

      }


      const row = {

        id:
          crypto.randomUUID(),

        name:
          String(name)
            .trim(),

        email:
          String(email)
            .trim(),

        subject:
          subject ||
          "",

        type:
          type ||
          "contact",

        message:
          String(message)
            .trim(),

        created_at:
          new Date()
            .toISOString()
      };


      const {
        data,
        error
      } =
        await supabase
          .from("submissions")
          .insert(row)
          .select()
          .single();


      if (error) {
        throw error;
      }


      res
        .status(201)
        .json(
          mapSubmission(
            data
          )
        );

    } catch (error) {

      console.error(
        "Create submission error:",
        error
      );


      res
        .status(500)
        .json({
          message:
            "Unable to send your message."
        });

    }

  }
);


// ------------------------------------------------------------
// ADMIN: GET SUBMISSIONS
// ------------------------------------------------------------

app.get(
  "/api/submissions",

  requireAdmin,

  async (_, res) => {

    try {

      const {
        data,
        error
      } =
        await supabase
          .from(
            "submissions"
          )
          .select("*")
          .order(
            "created_at",
            {
              ascending: false
            }
          );


      if (error) {
        throw error;
      }


      res.json(
        (data || []).map(
          mapSubmission
        )
      );

    } catch (error) {

      console.error(
        "Get submissions error:",
        error
      );


      res
        .status(500)
        .json({
          message:
            "Unable to load submissions."
        });

    }

  }
);


// ============================================================
// APPLICATIONS
// ============================================================


// ------------------------------------------------------------
// PUBLIC: CREATE APPLICATION
// ------------------------------------------------------------

app.post(
  "/api/applications",

  async (req, res) => {

    try {

      const {
        applicationType,
        name,
        email,
        phone,
        age,
        event,
        role,
        experience,
        availability,
        organisation,
        message
      } =
        req.body || {};


      if (
        !applicationType ||
        !name ||
        !email ||
        !phone
      ) {

        return res
          .status(400)
          .json({
            message:
              "Application type, name, email and phone are required."
          });

      }


      const validTypes = [
        "perform",
        "volunteer",
        "collaborate"
      ];


      if (
        !validTypes.includes(
          applicationType
        )
      ) {

        return res
          .status(400)
          .json({
            message:
              "Invalid application type."
          });

      }


      const now =
        new Date()
          .toISOString();


      const row = {

        id:
          crypto.randomUUID(),

        application_type:
          applicationType,

        name:
          String(name)
            .trim(),

        email:
          String(email)
            .trim(),

        phone:
          String(phone)
            .trim(),

        age:
          age || "",

        event:
          event || "",

        role:
          role || "",

        experience:
          experience || "",

        availability:
          availability || "",

        organisation:
          organisation || "",

        message:
          message || "",

        status:
          "New",

        created_at:
          now,

        updated_at:
          now
      };


      const {
        data,
        error
      } =
        await supabase
          .from(
            "applications"
          )
          .insert(row)
          .select()
          .single();


      if (error) {
        throw error;
      }


      res
        .status(201)
        .json(
          mapApplication(
            data
          )
        );

    } catch (error) {

      console.error(
        "Create application error:",
        error
      );


      res
        .status(500)
        .json({
          message:
            "Unable to submit application."
        });

    }

  }
);


// ------------------------------------------------------------
// ADMIN: GET ALL APPLICATIONS
// ------------------------------------------------------------

app.get(
  "/api/applications",

  requireAdmin,

  async (_, res) => {

    try {

      const {
        data,
        error
      } =
        await supabase
          .from(
            "applications"
          )
          .select("*")
          .order(
            "created_at",
            {
              ascending: false
            }
          );


      if (error) {
        throw error;
      }


      res.json(
        (data || []).map(
          mapApplication
        )
      );

    } catch (error) {

      console.error(
        "Get applications error:",
        error
      );


      res
        .status(500)
        .json({
          message:
            "Unable to load applications."
        });

    }

  }
);


// ============================================================
// APPLICATION STATISTICS
// ============================================================

app.get(
  "/api/applications-stats",

  requireAdmin,

  async (_, res) => {

    try {

      const {
        data,
        error
      } =
        await supabase
          .from(
            "applications"
          )
          .select(
            "status, application_type"
          );


      if (error) {
        throw error;
      }


      const applications =
        data || [];


      const stats = {

        total:
          applications.length,


        new:
          applications.filter(
            (item) =>
              item.status ===
              "New"
          ).length,


        contacted:
          applications.filter(
            (item) =>
              item.status ===
              "Contacted"
          ).length,


        accepted:
          applications.filter(
            (item) =>
              item.status ===
              "Accepted"
          ).length,


        rejected:
          applications.filter(
            (item) =>
              item.status ===
              "Rejected"
          ).length,


        performers:
          applications.filter(
            (item) =>
              item.application_type ===
              "perform"
          ).length,


        volunteers:
          applications.filter(
            (item) =>
              item.application_type ===
              "volunteer"
          ).length,


        collaborations:
          applications.filter(
            (item) =>
              item.application_type ===
              "collaborate"
          ).length
      };


      res.json(
        stats
      );

    } catch (error) {

      console.error(
        "Application stats error:",
        error
      );


      res
        .status(500)
        .json({
          message:
            "Unable to load application statistics."
        });

    }

  }
);


// ------------------------------------------------------------
// ADMIN: GET SINGLE APPLICATION
// ------------------------------------------------------------

app.get(
  "/api/applications/:id",

  requireAdmin,

  async (req, res) => {

    try {

      const {
        data,
        error
      } =
        await supabase
          .from(
            "applications"
          )
          .select("*")
          .eq(
            "id",
            req.params.id
          )
          .maybeSingle();


      if (error) {
        throw error;
      }


      if (!data) {

        return res
          .status(404)
          .json({
            message:
              "Application not found."
          });

      }


      res.json(
        mapApplication(
          data
        )
      );

    } catch (error) {

      console.error(
        "Get application error:",
        error
      );


      res
        .status(500)
        .json({
          message:
            "Unable to load application."
        });

    }

  }
);


// ------------------------------------------------------------
// ADMIN: UPDATE APPLICATION STATUS
// ------------------------------------------------------------

app.patch(
  "/api/applications/:id/status",

  requireAdmin,

  async (req, res) => {

    try {

      const {
        status
      } =
        req.body || {};


      const validStatuses = [
        "New",
        "Contacted",
        "Accepted",
        "Rejected"
      ];


      if (
        !validStatuses.includes(
          status
        )
      ) {

        return res
          .status(400)
          .json({
            message:
              "Invalid application status."
          });

      }


      const {
        data,
        error
      } =
        await supabase
          .from(
            "applications"
          )
          .update({
            status,

            updated_at:
              new Date()
                .toISOString()
          })
          .eq(
            "id",
            req.params.id
          )
          .select()
          .maybeSingle();


      if (error) {
        throw error;
      }


      if (!data) {

        return res
          .status(404)
          .json({
            message:
              "Application not found."
          });

      }


      res.json(
        mapApplication(
          data
        )
      );

    } catch (error) {

      console.error(
        "Update application status error:",
        error
      );


      res
        .status(500)
        .json({
          message:
            "Unable to update application status."
        });

    }

  }
);


// ------------------------------------------------------------
// ADMIN: DELETE APPLICATION
// ------------------------------------------------------------

app.delete(
  "/api/applications/:id",

  requireAdmin,

  async (req, res) => {

    try {

      /*
       * First fetch the record so the
       * response remains compatible
       * with your previous API.
       */

      const {
        data:
          existing,

        error:
          findError
      } =
        await supabase
          .from(
            "applications"
          )
          .select("*")
          .eq(
            "id",
            req.params.id
          )
          .maybeSingle();


      if (findError) {
        throw findError;
      }


      if (!existing) {

        return res
          .status(404)
          .json({
            message:
              "Application not found."
          });

      }


      const {
        error:
          deleteError
      } =
        await supabase
          .from(
            "applications"
          )
          .delete()
          .eq(
            "id",
            req.params.id
          );


      if (deleteError) {
        throw deleteError;
      }


      res.json({

        message:
          "Application deleted successfully.",

        application:
          mapApplication(
            existing
          )
      });

    } catch (error) {

      console.error(
        "Delete application error:",
        error
      );


      res
        .status(500)
        .json({
          message:
            "Unable to delete application."
        });

    }

  }
);


// ============================================================
// API 404
// KEEP AFTER ALL API ROUTES
// ============================================================

app.use(
  "/api",

  (req, res) => {

    res
      .status(404)
      .json({
        message:
          "API endpoint not found."
      });

  }
);


// ============================================================
// ERROR HANDLER
// ============================================================

app.use(
  (
    error,
    req,
    res,
    next
  ) => {

    console.error(
      "Server error:",
      error
    );


    res
      .status(500)
      .json({
        message:
          "Internal server error."
      });

  }
);


// ============================================================
// LOCAL SERVER
// ============================================================

if (
  process.env.VERCEL !==
  "1"
) {

  app.listen(
    PORT,

    () => {

      console.log(
        "=========================================="
      );

      console.log(
        "       THE LOCALS API"
      );

      console.log(
        "=========================================="
      );

      console.log(
        `Server: http://localhost:${PORT}`
      );

      console.log(
        `Health: http://localhost:${PORT}/api/health`
      );

      console.log(
        `Admin login: http://localhost:${PORT}/api/admin/login`
      );

      console.log(
        "Database: Supabase PostgreSQL"
      );

      console.log(
        "=========================================="
      );

    }
  );

}


// ============================================================
// VERCEL EXPORT
// ============================================================

export default app;