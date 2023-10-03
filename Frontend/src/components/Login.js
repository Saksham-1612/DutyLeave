"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { BACKEND_URL } from "@/service/BackendUrl";
import { GlobalState } from "@/context/GlobalProvider";

const Login = () => {
  const [show, setShow] = useState(false);
  const [reg, setReg] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);

  const { setUser } = GlobalState();

  const router = useRouter();

  const toast = useToast();

  const handleClick = () => {
    setShow(!show);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      //   const config = {
      //     headers: {
      //       "Content-type": "application/json",
      //     },
      //   };

      const res = await axios.post(`${BACKEND_URL}/api/user/login`, {
        reg,
        password,
      });

      console.log(res.data);

      if (res && res.data.success) {
        toast({
          title: res.data && res.data.message,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setUser(res.data.user);
        router.push("/");
        localStorage.setItem("userInfo", JSON.stringify(res.data.user));
        console.log(res.data.user);
      } else {
        toast({
          title: res.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast({
        title: "Something went wrong!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
    setLoading(false);
  };

  return (
    <VStack spacing="5px">
      <FormControl id="reg" isRequired>
        <FormLabel>Registration No.</FormLabel>
        <Input
          placeholder="Enter Your Registration No."
          value={reg}
          onChange={(e) => setReg(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement w="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme="cyan"
        w="100%"
        style={{ marginTop: 15 }}
        onClick={handleSubmit}
        isLoading={loading}
      >
        Sign In
      </Button>
      <Button
        variant="solid"
        colorScheme="red"
        w="100%"
        onClick={() => {
          setReg("12104444");
          setPassword("123456");
        }}
      >
        Login As Guest User
      </Button>
    </VStack>
  );
};

export default Login;
