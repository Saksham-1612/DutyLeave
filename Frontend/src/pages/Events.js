import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BACKEND_URL } from "../service/BackendUrl";
import CreateEvent from "../components/events/CreateEvent";
import axios from "axios";
import UserBadgeItem from "../components/userItems/UserBadgeItem";
import UserListItem from "../components/userItems/UserListItem";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [userDetails, setUserDetails] = useState([]);
  const [facultyDetails, setFacultyDetails] = useState([]);
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [eventId, setEventId] = useState();
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState([]);
  const [searchResult1, setSearchResult1] = useState([]);
  const [searchResult2, setSearchResult2] = useState([]);
  const [selectedAttendees, setSelectedAttendees] = useState([]);
  const [search1, setSearch1] = useState("");
  const [search2, setSearch2] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const toast = useToast();

  const getAllEvents = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/event/get-events`);
      const allUserIds = data?.events.flatMap((event) =>
        event.attendees.map((attendee) => attendee.user)
      );

      // console.log(data);
      const allFacultyIds = data?.events.flatMap((event) =>
        event.faculty.map((fac) => fac)
      );
      // console.log(allFacultyIds);

      const userData = await axios.get(`${BACKEND_URL}/api/event/attendees`, {
        params: { allUserIds },
      });

      setUserDetails(
        userData?.data?.attendeesData.reduce((acc, user) => {
          acc[user._id] = user; // Assuming 'id' is the user's ID
          return acc;
        }, {})
      );

      const facultyData = await axios.get(`${BACKEND_URL}/api/event/faculty`, {
        params: { allFacultyIds },
      });

      setFacultyDetails(
        facultyData?.data?.facultyData.reduce((acc, faculty) => {
          acc[faculty._id] = faculty; // Assuming 'id' is the user's ID
          return acc;
        }, {})
      );
      setEvents(data?.events);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllEvents();
  }, []);

  const handleDeleteEvent = async (e_id) => {
    try {
      const res = await axios.delete(
        `${BACKEND_URL}/api/event/delete-event/${e_id}`
      );
      if (res.data.success) {
        toast({
          title: "Event deleted!",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        getAllEvents();
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error occured!",
        description: "Failed to delete!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

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

  const getUser = async (u_id) => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/user/get-user/${u_id}`);
      // console.log(res.data);
      // console.log(res.data.userD);
      if (res.data && res.data.success) {
        return res.data.userD;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getSingleEvent = async (e_id) => {
    try {
      const { data } = await axios.get(
        `${BACKEND_URL}/api/event/get-event/${e_id}`
      );
      // console.log(data.eventData);
      // console.log(data?.success);
      const eventD = data.eventData;
      // console.log(eventD);
      // console.log(eventD.title);
      setEventId(e_id);
      setTitle(eventD.title);
      setDescription(eventD.description);
      setStartTime(formatDateForInput(eventD.startTime));
      setEndTime(formatDateForInput(eventD.endTime));
      const facultyPromises = eventD.faculty.map((f) => getUser(f));
      const facultyDetails = await Promise.all(facultyPromises);
      setSelectedFaculty(facultyDetails);

      const attendeesPromises = eventD.attendees.map((a) => getUser(a.user));
      const attendeesDetails = await Promise.all(attendeesPromises);
      setSelectedAttendees(attendeesDetails);

      // console.log(selectedFaculty);
      // console.log(eventD.startTime);
      // console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const formattedDate = date.toISOString().slice(0, 16); // Format to 'YYYY-MM-DDTHH:mm'
    return formattedDate;
  };

  const handleSearch1 = async (query) => {
    setSearch1(query);
    if (!query) {
      return;
    }
    try {
      setLoading1(true);

      const { data } = await axios.get(
        `${BACKEND_URL}/api/user/faculty?search=${search1}`
      );
      setLoading1(false);
      setSearchResult1(data);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error occured!",
        description: "Failed to search faculty!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
    setLoading1(false);
  };

  const handleSearch2 = async (query) => {
    setSearch2(query);
    if (!query) {
      return;
    }
    try {
      setLoading2(true);

      const { data } = await axios.get(
        `${BACKEND_URL}/api/user/attendees?search=${search2}`
      );
      setLoading2(false);
      setSearchResult2(data);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error occured!",
        description: "Failed to search students!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
    setLoading2(false);
  };

  const handleGroup1 = (userToAdd) => {
    if (selectedFaculty.some((user) => user._id === userToAdd._id)) {
      toast({
        title: "Student is already added!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setSelectedFaculty([...selectedFaculty, userToAdd]);
  };

  const handleGroup2 = (userToAdd) => {
    if (selectedAttendees.some((user) => user._id === userToAdd._id)) {
      toast({
        title: "Student is already added!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setSelectedAttendees([...selectedAttendees, userToAdd]);
  };

  const handleDelete1 = (deletedUser) => {
    setSelectedFaculty(
      selectedFaculty.filter((sel) => sel._id !== deletedUser._id)
    );
  };

  const handleDelete2 = (deletedUser) => {
    setSelectedAttendees(
      selectedAttendees.filter((sel) => sel._id !== deletedUser._id)
    );
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `${BACKEND_URL}/api/event/update-event/${eventId}`,
        {
          title: title,
          description: description,
          startTime: new Date(startTime).toISOString(),
          endTime: new Date(endTime).toISOString(),
          faculty: JSON.stringify(selectedFaculty.map((a) => a._id)),
          attendees: JSON.stringify(selectedAttendees.map((f) => f._id)),
        }
      );

      if (res.data && res.data.success) {
        toast({
          title: res.data.message,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        getAllEvents();
        onClose();
        setTitle("");
        setDescription("");
        setStartTime("");
        setEndTime("");
        setSelectedFaculty([]);
        setSelectedAttendees([]);
        setSearchResult1([]);
        setSearchResult2([]);
      }
    } catch (error) {
      console.log(error);
      toast({
        title: res.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
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
            <Text
              mt="20px"
              w="100%"
              display="flex"
              justifyContent="space-between"
            >
              <span>Starts at {formatDate(e.startTime)}</span>
              <span>Ends at {formatDate(e.endTime)}</span>
            </Text>
            <Text mb="20px" mt="40px" textAlign="center">
              Faculty In-charge
            </Text>
            <Box mb="50px">
              {e.faculty.map((f, i) => (
                <Box
                  key={f}
                  w="100%"
                  display="flex"
                  justifyContent="space-between"
                  mt="10px"
                >
                  <p>
                    {i + 1}. Faculty Name: {facultyDetails[f]?.name}
                  </p>
                  <p>UID: {facultyDetails[f]?.reg}</p>
                </Box>
              ))}
            </Box>
            <Text mb="20px" mt="40px" textAlign="center">
              Attendees
            </Text>
            <Box mb="30px">
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
            <Box
              w="100%"
              display="flex"
              justifyContent="center"
              gap="10px"
              mb="20px"
            >
              <Button
                variant="solid"
                colorScheme="blue"
                onClick={() => {
                  onOpen();
                  getSingleEvent(e._id);
                }}
              >
                Update
              </Button>
              <Button
                variant="solid"
                colorScheme="red"
                onClick={() => handleDeleteEvent(e._id)}
              >
                Delete
              </Button>
            </Box>
            <hr></hr>
          </Box>
        ))}
      </Box>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent bg="#212121" color="white">
          <ModalHeader>Update Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input
                ref={initialRef}
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4}>
              <Input
                placeholder="Add Faculty In-Charge"
                mb="1"
                onChange={(e) => handleSearch1(e.target.value)}
              />
            </FormControl>
            <Box w="100%" display="flex" flexWrap="wrap">
              {selectedFaculty.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete1(u)}
                />
              ))}
            </Box>
            {loading1 ? (
              <Box textAlign="center">loading...</Box>
            ) : (
              searchResult1
                ?.slice(0, 5)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup1(user)}
                  />
                ))
            )}

            <FormControl mt={4}>
              <Input
                placeholder="Add Attendees"
                mb="1"
                onChange={(e) => handleSearch2(e.target.value)}
              />
            </FormControl>
            <Box w="100%" display="flex" flexWrap="wrap">
              {selectedAttendees.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete2(u)}
                />
              ))}
            </Box>
            {loading2 ? (
              <Box textAlign="center">loading...</Box>
            ) : (
              searchResult2
                ?.slice(0, 5)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup2(user)}
                  />
                ))
            )}

            <FormControl mt={4}>
              <FormLabel>Event Start Time</FormLabel>
              <Input
                placeholder="Event Start Time"
                size="md"
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Event End Time</FormLabel>
              <Input
                placeholder="Event End Time"
                size="md"
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              // isLoading={loading}
              colorScheme="blue"
              mr={3}
              onClick={handleUpdate}
            >
              Update
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Events;
