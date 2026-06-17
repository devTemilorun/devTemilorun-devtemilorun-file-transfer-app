import React, { useEffect, useRef, useState } from 'react';
import { Button } from './Button';
import { Camera, X } from 'lucide-react';
import { config } from '../../config';

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

export function QRScanner({ onScan, onClose }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        setError('Camera access denied or unavailable');
      }
    }
    setupCamera();

    return () => {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  // Fixed: Use env variable instead of hardcoded URL
  const handleScan = () => {
    // This would be replaced with actual QR code scanning logic
    // For demo purposes, create a valid session link
    const demoSessionId = Math.random().toString(36).substring(2, 10).toUpperCase();
    const scanResult = `${config.appUrl}/receive/${demoSessionId}`;
    onScan(scanResult);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
      <div className="relative w-full max-w-md p-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-800 hover:bg-gray-700"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-blue-500">
          <video ref={videoRef} className="w-full h-full object-cover" />
          <div className="absolute inset-0 border-2 border-blue-400 m-8 rounded-lg pointer-events-none" />
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}
        
        <Button onClick={handleScan} className="mt-4 w-full">
          <Camera className="w-4 h-4 mr-2" />
          Simulate QR Scan
        </Button>
      </div>
    </div>
  );
}