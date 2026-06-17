import  { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { QRScanner } from '../../components/ui/QRScanner';
import { useToast } from '../../components/ui/Toast';
import { usePeerConnection } from '../../hooks/usePeerConnection';
import { Camera, Link2 } from 'lucide-react';

export function ReceivePage() {
  const { sessionId: paramSessionId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [showScanner, setShowScanner] = useState(false);
  const [sessionId, setSessionId] = useState(paramSessionId || '');
  const [isJoining, setIsJoining] = useState(false);

  const { connectionStatus, connectToPeer } = usePeerConnection({
    onConnected: () => {
      showToast('Connected to sender!', 'success');
      navigate(`/transfer/${sessionId}`, { state: { isSender: false } });
    },
  });

  const handleJoin = async () => {
    if (!sessionId.trim()) {
      showToast('Please enter a session ID or scan QR code', 'error');
      return;
    }

    setIsJoining(true);
    setTimeout(() => {
      connectToPeer('sender-peer-id-placeholder');
    }, 500);
  };

  const handleQRScan = (data: string) => {
    const match = data.match(/\/receive\/([a-z0-9]+)/);
    if (match && match[1]) {
      setSessionId(match[1]);
      setShowScanner(false);
      showToast('QR code scanned!', 'success');
      setTimeout(() => handleJoin(), 500);
    } else {
      showToast('Invalid QR code', 'error');
    }
  };

  useEffect(() => {
    if (paramSessionId) {
      handleJoin();
    }
  }, [paramSessionId]);

  return (
    <div className="min-h-screen p-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Receive Files</h1>
          <p className="text-gray-400">Enter the share code or scan QR code</p>
        </div>

        <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Session ID / Share Link
            </label>
            <input
              type="text"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              placeholder="e.g., abc123def"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex gap-3">
            <Button onClick={handleJoin} loading={isJoining} className="flex-1">
              <Link2 className="w-4 h-4 mr-2" />
              Connect
            </Button>
            <Button variant="secondary" onClick={() => setShowScanner(true)}>
              <Camera className="w-4 h-4" />
            </Button>
          </div>

          {connectionStatus === 'connecting' && (
            <div className="p-3 bg-blue-500/10 border border-blue-500 rounded-lg">
              <p className="text-blue-400 text-sm text-center">Connecting to sender...</p>
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Files transfer directly between devices - completely private</p>
        </div>
      </motion.div>

      {showScanner && (
        <QRScanner onScan={handleQRScan} onClose={() => setShowScanner(false)} />
      )}
    </div>
  );
}