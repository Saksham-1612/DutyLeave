import eventModel from "../models/eventModel.js";
import userModel from "../models/userModel.js";

//create event
export const createEventController = async (req, res) => {
  try {
    const { title, description, startTime, endTime } = req.body;

    if (!title || !description || !startTime || !endTime) {
      return res.status(400).send({
        success: false,
        message: "All the fields are mandatory!",
      });
    }

    const attendees = JSON.parse(req.body.attendees);

    const event = new eventModel({
      title,
      description,
      startTime,
      endTime,
    });

    for (const attendeeId of attendees) {
      const userData = await userModel.findById(attendeeId).select("-password");
      if (userData) {
        event.attendees.push({
          user: userData,
          // attended: attendee.attended || false,
        });
      }
    }

    // const attendeePromises = attendees.map(async (attendeeId) => {
    //   const userData = await userModel.findById(attendeeId).select("-password");
    //   return { user: userData };
    // });

    // const attendeesData = await Promise.all(attendeePromises);

    // event.attendees = attendeesData;

    await event.save();

    res.status(200).send({
      success: true,
      message: "Event created successfully!",
      event,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error creating event!",
      error,
    });
  }
};

export const getEventAttendees = async (req, res) => {
  try {
    const { allUserIds } = req.query; // Assuming the request body contains an array of attendee IDs
    console.log(allUserIds);

    // Fetch user details for the provided attendee IDs
    const attendeesData = await userModel
      .find({ _id: { $in: allUserIds } })
      .select("-password");

    console.log(attendeesData);

    res.status(200).send({
      success: true,
      message: "Attendees details fetched successfully!",
      attendeesData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to fetch attendees' details",
      error,
    });
  }
};

// get events
export const getEventsController = async (req, res) => {
  try {
    const events = await eventModel.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "All events ",
      events,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr in getting events!",
      error: error.message,
    });
  }
};

//delete event
export const deleteEventController = async (req, res) => {
  try {
    await eventModel.findByIdAndDelete(req.params.id);
    res.status(200).send({
      success: true,
      message: "Event deleted successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting event!",
      error,
    });
  }
};
