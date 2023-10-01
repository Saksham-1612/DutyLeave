"use client";
import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function Home() {
  const User = {
    Name: "Saksham",
    Reg: 12111097,
  };

  User.email = `${User.Name}.${User.Reg}@lpu.in`;

  const [result, setResult] = useState(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      qrbox: {
        width: 450,
        height: 450,
      },
      fps: 5,
    });

    const success = (decodedText) => {
      setResult(decodedText);
    };

    const error = (err) => {
      console.warn(err);
    };

    scanner.render(success, error);
  }, []);

  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <h1>QR CODE SCANNER</h1>
        {result ? (
          <div>
            Success {User.Name} - {User.Reg}
          </div>
        ) : (
          <div
            className="h-96 w-96 rounded-lg overflow-hidden"
            id="reader"
          ></div>
        )}
      </div>
    </>
  );
}
