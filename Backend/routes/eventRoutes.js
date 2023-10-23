import express from "express";
import {
  createEventController,
  deleteEventController,
  getEventAttendees,
  getEventsController,
} from "../controllers/eventController.js";

const router = express.Router();

router.post("/create-event", createEventController);

router.get("/get-events", getEventsController);

router.get("/attendees", getEventAttendees);

router.delete("/delete-event/:id", deleteEventController);

export default router;
