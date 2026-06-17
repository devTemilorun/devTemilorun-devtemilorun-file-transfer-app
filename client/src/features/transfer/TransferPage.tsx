import  { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { useFileTransfer } from '../../hooks/useFileTransfer';
import { useToast } from '../../components/ui/Toast';
import { X, Clock, Zap } from 'lucide-react';

interface TransferState {
  files: File[];
  isSender: boolean;
}

export function TransferPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const state = location.state as TransferState;
  const [cancelled, setCancelled] = useState(false);

  const {
    isTransferring,
    currentFileIndex,
    progressMap,
    speed,
    sendFiles,
    formatBytes: formatSize
  } = useFileTransfer({
    onComplete: (files) => {
      showToast('Transfer complete!', 'success');
      navigate('/complete/123', { state: { transferredFiles: files, isSender: state?.isSender } });
    },
    onError: (error) => {
      showToast(`Transfer failed: ${error.message}`, 'error');
    }
  });

  useEffect(() => {
    if (state?.isSender && state?.files && !isTransferring) {
      const mockSendData = (data: any) => console.log('Sending:', data);
      sendFiles(state.files, mockSendData);
    } else if (!state?.isSender) {
    }
  }, [state]);

  const handleCancel = () => {
    setCancelled(true);
    showToast('Transfer cancelled', 'info');
    navigate('/');
  };

  const totalProgress = progressMap.size > 0
    ? Array.from(progressMap.values()).reduce((a, b) => a + b, 0) / progressMap.size
    : 0;

  const currentFile = state?.files?.[currentFileIndex];

  return (
    <div className="min-h-screen p-4 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 rounded-xl border border-gray-700 p-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              {state?.isSender ? 'Sending Files...' : 'Receiving Files...'}
            </h2>
            <p className="text-gray-400">
              {state?.isSender ? 'Uploading' : 'Downloading'} {state?.files?.length || 0} file{state?.files?.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Overall Progress</span>
              <span>{Math.round(totalProgress)}%</span>
            </div>
            <ProgressBar progress={totalProgress} height="lg" />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-900 rounded-lg p-3 flex items-center gap-3">
              <Zap className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-xs text-gray-500">Speed</p>
                <p className="text-white font-medium">{speed} MB/s</p>
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg p-3 flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-xs text-gray-500">Time Remaining</p>
                <p className="text-white font-medium">Calculating...</p>
              </div>
            </div>
          </div>

          {currentFile && (
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-300 truncate flex-1">{currentFile.name}</span>
                <span className="text-gray-500 ml-4">{formatSize(currentFile.size)}</span>
              </div>
              <ProgressBar 
                progress={progressMap.get(`${currentFile.name}-${currentFile.lastModified}`) || 0} 
                height="md"
              />
            </div>
          )}

          <div className="space-y-2 max-h-48 overflow-y-auto mb-6">
            {state?.files?.map((file, idx) => {
              const fileId = `${file.name}-${file.lastModified}`;
              const progress = progressMap.get(fileId) || 0;
              const isActive = idx === currentFileIndex;
              
              return (
                <div key={idx} className={`p-2 rounded-lg ${isActive ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-gray-900'}`}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300 truncate flex-1">{file.name}</span>
                    <span className="text-gray-500 text-xs ml-4">{Math.round(progress)}%</span>
                  </div>
                  <ProgressBar progress={progress} height="sm" showLabel={false} />
                </div>
              );
            })}
          </div>

          <Button
            variant="secondary"
            onClick={handleCancel}
            className="w-full"
            disabled={!isTransferring || cancelled}
          >
            <X className="w-4 h-4 mr-2" />
            {cancelled ? 'Cancelled' : 'Cancel Transfer'}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}