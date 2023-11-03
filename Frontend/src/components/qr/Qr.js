import React, { useEffect, useRef } from "react";
import QRCode from "qrcode.react";

export default function Qr() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const qrCodeRef = useRef(null);

  useEffect(() => {
    if (userInfo && qrCodeRef.current) {
      // Generate the QR code and set it in the component's state
      qrCodeRef.current.makeCode(JSON.stringify(userInfo.user));
    }
  }, [userInfo]);

  return (
    <div>
      <h1>This is QR CODE</h1>
      <div>
        <div className="padding">
          {userInfo ? (
            <div>
              <QRCode ref={qrCodeRef} value={JSON.stringify(userInfo.user)} />
            </div>
          ) : (
            <p>No user information found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
