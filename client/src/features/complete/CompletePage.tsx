import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { CheckCircle, Download, Share2, Home } from 'lucide-react';
import { formatBytes } from '../../lib/chunking';

export function CompletePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { transferredFiles = [], isSender = false } = location.state || {};

  const handleDownload = (file: File) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    transferredFiles.forEach(handleDownload);
  };

  return (
    <div className="min-h-screen p-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full"
      >
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-green-500" />
          </motion.div>

          <h2 className="text-2xl font-bold text-white mb-2">
            {isSender ? 'Files Sent!' : 'Files Received!'}
          </h2>
          <p className="text-gray-400 mb-6">
            {transferredFiles.length} file{transferredFiles.length !== 1 ? 's' : ''} transferred successfully
          </p>

          {!isSender && transferredFiles.length > 0 && (
            <div className="mb-6">
              <div className="bg-gray-900 rounded-lg p-4 max-h-64 overflow-y-auto">
                <h3 className="text-sm font-medium text-gray-400 mb-3">Downloaded Files</h3>
                {transferredFiles.map((file: File, idx: number) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                    <div className="flex-1 text-left">
                      <p className="text-white text-sm truncate">{file.name}</p>
                      <p className="text-gray-500 text-xs">{formatBytes(file.size)}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDownload(file)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button onClick={handleDownloadAll} variant="secondary" className="w-full mt-3">
                <Download className="w-4 h-4 mr-2" />
                Download All
              </Button>
            </div>
          )}

          <div className="flex gap-3">
            <Button onClick={() => navigate('/')} className="flex-1">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
            <Button 
              onClick={() => navigate(isSender ? '/send' : '/receive')} 
              variant="secondary" 
              className="flex-1"
            >
              <Share2 className="w-4 h-4 mr-2" />
              {isSender ? 'Send More' : 'Receive More'}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}