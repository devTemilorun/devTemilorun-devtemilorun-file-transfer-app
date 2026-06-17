import  { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { Upload, X, File, Link as LinkIcon } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { usePeerConnection } from '../../hooks/usePeerConnection';
import { formatBytes } from '../../lib/chunking';
import { config } from '../../config';

interface SelectedFile {
  file: File;
  id: string;
}

export function SendPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [localConnectionStatus, setLocalConnectionStatus] = useState<'waiting' | 'connected' | 'failed'>('waiting');

  const { peerId, connectionStatus } = usePeerConnection({
    onConnected: () => {
      console.log('Peer connection established!');
      setLocalConnectionStatus('connected');
      showToast('Receiver connected! Starting transfer...', 'success');
      setTimeout(() => {
        navigate(`/transfer/${sessionId}`, { 
          state: { 
            files: selectedFiles.map(f => f.file), 
            isSender: true 
          } 
        });
      }, 1000);
    },
    onError: (error) => {
      console.error('Connection error:', error);
      setLocalConnectionStatus('failed');
      showToast('Connection failed. Try again.', 'error');
    },
    onDisconnected: () => {
      console.log('Peer disconnected');
      setLocalConnectionStatus('waiting');
    }
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      id: `${file.name}-${file.lastModified}-${Math.random()}`
    }));
    setSelectedFiles(prev => [...prev, ...newFiles]);
    showToast(`${acceptedFiles.length} file(s) added`, 'success');
  }, [showToast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: false,
    noKeyboard: false
  });

  const removeFile = (id: string) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== id));
  };

  const createShareSession = async () => {
    if (selectedFiles.length === 0) {
      showToast('Please select files first', 'error');
      return;
    }

    setIsCreatingSession(true);
    
    // Generate a random session ID
    const newSessionId = Math.random().toString(36).substring(2, 10).toUpperCase();
    setSessionId(newSessionId);
    
    console.log('Session created:', newSessionId);
    console.log('My Peer ID:', peerId);
    console.log('App URL:', config.appUrl);
    
    setShareModalOpen(true);
    setIsCreatingSession(false);
  };

  const copyLink = () => {
    const link = getShareLink();
    navigator.clipboard.writeText(link);
    showToast('Link copied to clipboard!', 'success');
  };

  const getShareLink = () => {
    return `${config.appUrl}/receive/${sessionId}`;
  };

  const totalSize = selectedFiles.reduce((sum, f) => sum + f.file.size, 0);

  console.log('SendPage render - peerId:', peerId, 'connectionStatus:', connectionStatus);

  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Send Files</h1>
          <p className="text-gray-400">Drag & drop files or click to browse</p>
          {peerId && (
            <p className="text-xs text-gray-500 mt-2">Your Peer ID: {peerId.substring(0, 8)}...</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6"
        >
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
              transition-all duration-200
              ${isDragActive 
                ? 'border-blue-500 bg-blue-500/10' 
                : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
              }
            `}
          >
            <input {...getInputProps()} />
            <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragActive ? 'text-blue-500' : 'text-gray-500'}`} />
            <p className="text-gray-400">
              {isDragActive ? 'Drop files here...' : 'Drag & drop files here, or click to select'}
            </p>
            <p className="text-sm text-gray-600 mt-2">Any file type, any size (P2P transfer)</p>
          </div>
        </motion.div>

        {selectedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden mb-6"
          >
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <span className="text-white font-medium">
                {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''}
              </span>
              <span className="text-gray-400 text-sm">{formatBytes(totalSize)}</span>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {selectedFiles.map((fileItem) => (
                <div key={fileItem.id} className="flex items-center justify-between p-3 hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <File className="w-5 h-5 text-blue-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">{fileItem.file.name}</p>
                      <p className="text-gray-500 text-xs">{formatBytes(fileItem.file.size)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(fileItem.id)}
                    className="p-1 rounded-lg hover:bg-gray-600 transition-colors"
                    aria-label="Remove file"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <Button
          onClick={createShareSession}
          disabled={selectedFiles.length === 0 || isCreatingSession || !peerId}
          className="w-full"
          size="lg"
        >
          {isCreatingSession ? 'Creating session...' : !peerId ? 'Initializing...' : 'Create Share Link →'}
        </Button>

        <Modal isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} title="Share to Receive">
          {sessionId && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="bg-white p-4 rounded-2xl">
                  <QRCodeCanvas 
                    value={getShareLink()} 
                    size={180}
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value={getShareLink()}
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300"
                  />
                  <Button onClick={copyLink} size="sm">
                    <LinkIcon className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Connection Status</span>
                    <span className={`text-sm ${
                      localConnectionStatus === 'connected' ? 'text-green-500' :
                      localConnectionStatus === 'failed' ? 'text-red-500' : 'text-yellow-500'
                    }`}>
                      {localConnectionStatus === 'waiting' ? 'Waiting for receiver...' :
                       localConnectionStatus === 'connected' ? 'Connected!' : 'Connection failed'}
                    </span>
                  </div>
                  <ProgressBar progress={localConnectionStatus === 'connected' ? 100 : 0} height="sm" showLabel={false} />
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}