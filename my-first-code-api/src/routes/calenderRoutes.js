  // // ============================================================
  // // FILE: src/routes/calendarRoutes.js
  // // ============================================================

  // import express from "express";

  // import {
  //   createEvent,
  //   getEvents,
  //   updateEvent,
  //   deleteEvent,
  // } from "../controllers/calenderController.js";

  // import {
  //   verifyToken,
  // } from "../middleware/authMiddleware.js";


  // import { getAllEventsAdmin, getEventsByStandard } from "../controllers/calenderController.js";
  // import { authorizeRoles } from "../middleware/roleMiddleware.js.js";

  // const router =
  //   express.Router();

  // // ============================================================
  // // AUTH
  // // ============================================================

  // router.use(
  //   verifyToken
  // );

  // // ============================================================
  // // DASHBOARD
  // // ============================================================

  // // router.get(
  // //   "/dashboard",

  // //   authorizeRoles(
  // //     "teacher",
  // //     "admin"
  // //   ),

  // //   getDashboard
  // // );

  // // ============================================================
  // // EVENTS
  // // ============================================================

  // // GET ALL EVENTS

  // router.get(
  //   "/",
  //   getEvents
  // );

  // // GET SINGLE EVENT

  // // router.get(
  // //   "/:id",
  // //   getEventById
  // // );

  // // CREATE EVENT

  // router.post(
  //   "/create",

  //   authorizeRoles(
  //     "teacher",
  //     "admin"
  //   ),

  //   createEvent
  // );

  // // UPDATE EVENT

  // router.put(
  //   "/update/:id",

  //   authorizeRoles(
  //     "teacher",
  //     "admin"
  //   ),

  //   updateEvent
  // );

  // // DELETE EVENT

  // router.delete(
  //   "/delete/:id",

  //   authorizeRoles(
  //     "teacher",
  //     "admin"
  //   ),

  //   deleteEvent
  // );


  // router.get(
  //   "/events/student/:standard",
  //   authorizeRoles,
  //   getEventsByStandard
  // );

  // router.get(
  //   "/admin/events",
  //   authorizeRoles("admin"),
  //   getAllEventsAdmin
  // );

  // export default router;














  import express from "express";

  import {
    createEvent,
    getEvents,
    updateEvent,
    deleteEvent,
    getEventsByStandard,
    getAllEventsAdmin,
  } from "../controllers/calenderController.js";
  import {verifyToken} from '../middleware/authMiddleware.js';
  import {authorizeRoles} from "../middleware/roleMiddleware.js";

  const router = express.Router();

  router.use(verifyToken);

  // Teacher Events
  router.get(
    "/",
    authorizeRoles("teacher", "admin"),
    getEvents
  );

  // Create
  router.post(
    "/create",
    authorizeRoles("teacher", "admin"),
    createEvent
  );

  // Update
  router.put(
    "/update/:id",
    authorizeRoles("teacher", "admin"),
    updateEvent
  );

  // Delete
  router.delete(
    "/delete/:id",
    authorizeRoles("teacher", "admin"),
    deleteEvent
  );

  // Student Calendar
  router.get(
    "/events/student/:standard",
    authorizeRoles("student", "teacher", "admin"),
    getEventsByStandard
  );

  // Admin Calendar
  router.get(
    "/admin/events",
    authorizeRoles("admin"),
    getAllEventsAdmin
  );

  export default router;