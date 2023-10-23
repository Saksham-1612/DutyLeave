import { Box, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BACKEND_URL } from "../service/BackendUrl";
import CreateEvent from "../components/events/CreateEvent";
import axios from "axios";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [userDetails, setUserDetails] = useState([]);

  const getAllEvents = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/event/get-events`);
      const allUserIds = data?.events.flatMap((event) =>
        event.attendees.map((attendee) => attendee.user)
      );
      // console.log(allUserIds);

      const userData = await axios.get(`${BACKEND_URL}/api/event/attendees`, {
        params: { allUserIds },
      });

      setUserDetails(
        userData?.data?.attendeesData.reduce((acc, user) => {
          acc[user._id] = user; // Assuming 'id' is the user's ID
          return acc;
        }, {})
      );

      console.log("userDetails:", userDetails);

      // console.log(userData);
      // setUserIds(userData?.data?.attendeesData);
      // setUserIds(allUserIds);
      // console.log(userIds);
      setEvents(data?.events);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllEvents();
  }, []);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Box
      w="100vw"
      display="flex"
      justifyContent="space-evenly"
      minH="100vh"
      pt="50px"
    >
      <CreateEvent />
      <Box w="50%">
        <Text fontWeight="900" fontSize="20px" textAlign="center" mb="30px">
          Events
        </Text>
        {events.map((e) => (
          <Box key={e._id} mb="50px">
            <h3>Event Name: {e.title}</h3>
            <p>Description: {e.description}</p>
            <Text w="100%" display="flex" justifyContent="space-between">
              <span>Starts at {formatDate(e.startTime)}</span>
              <span>Ends at {formatDate(e.endTime)}</span>
            </Text>
            <Text mb="20px" mt="40px" textAlign="center">
              Attendees
            </Text>
            <Box mb="50px">
              {e.attendees.map((a, i) => (
                <Box
                  key={a._id}
                  w="100%"
                  display="flex"
                  justifyContent="space-between"
                  mt="10px"
                >
                  <p>
                    {i + 1}. Name: {userDetails[a.user]?.name}
                  </p>
                  <p>Reg. No.: {userDetails[a.user]?.reg}</p>
                </Box>
              ))}
            </Box>
            <hr></hr>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Events;
