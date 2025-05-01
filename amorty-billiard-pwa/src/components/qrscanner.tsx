import React, { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

const QrScanner = ({ onScan }: { onScan: (result: string) => void }) => {
  const scannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scanner = new Html5Qrcode(scannerRef.current!.id);
    const config = { fps: 10, qrbox: 250 };

    scanner.start(
      { facingMode: "environment" },
      config,
      (decodedText) => {
        console.log("QR Detected:", decodedText);
        onScan(decodedText);
        scanner.stop(); // kalau mau otomatis stop setelah detect
      },
      (errorMessage) => {
        // console log error scan
        console.log("QR Scan Error", errorMessage);
      }
    );

    return () => {
      scanner.stop().catch(err => console.log("Stop error", err));
    };
  }, [onScan]);

  return <div id="qr-reader" ref={scannerRef} style={{ width: "100%" }} />;
};

export default QrScanner;
