import React, { useEffect, useRef } from "react";
import QRCode from "qrcode.react";
import { Box, Text } from "@chakra-ui/react";

export default function Qr() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const qrCodeRef = useRef(null);

  useEffect(() => {
    if (userInfo && qrCodeRef.current) {
      qrCodeRef.current.makeCode(JSON.stringify(userInfo.user));
    }
  }, [userInfo]);

  return (
    <Box width="100vw" textAlign="center" mt="8">
      <Text fontSize="xl" mb="4">
        This is QR CODE
      </Text>
      <Box
        p="1"
        display="flex"
        justifyContent="center"
        alignItems="center"
        margin={"auto"}
        bg="beige"
        width={"25vw"}
        height="55vh"
      >
        {userInfo ? (
          <div>
            <QRCode
              ref={qrCodeRef}
              value={JSON.stringify(userInfo.user)}
              size={320}
            />
          </div>
        ) : (
          <Text>No user information found.</Text>
        )}
      </Box>
    </Box>
  );
}
