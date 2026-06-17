import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, Download } from 'lucide-react';

export function HomePage() {
  const navigate = useNavigate();
  
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'var(--bg-primary)'
      }}
    >
      <div className="max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 
            className="text-5xl font-bold mb-3"
            style={{ color: 'var(--text-primary)' }}
          >
            File Transfer
          </h1>
          <p style={{ color: 'var(--text-muted)' }} className="text-lg">
            Direct, private, peer-to-peer transfers
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <button
              onClick={() => navigate('/send')}
              className="w-full group"
            >
              <div 
                className="rounded-2xl p-8 transition-all duration-200 hover:shadow-lg border"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-light)',
                  boxShadow: 'var(--shadow-sm)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-light)';
                }}
              >
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform"
                  style={{
                    backgroundColor: 'var(--accent-light)'
                  }}
                >
                  <Upload className="w-10 h-10" style={{ color: 'var(--accent)' }} />
                </div>
                <h2 
                  className="text-2xl font-semibold mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Send Files
                </h2>
                <p style={{ color: 'var(--text-muted)' }}>Share files directly to another device</p>
              </div>
            </button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <button
              onClick={() => navigate('/receive')}
              className="w-full group"
            >
              <div 
                className="rounded-2xl p-8 transition-all duration-200 hover:shadow-lg border"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-light)',
                  boxShadow: 'var(--shadow-sm)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-light)';
                }}
              >
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform"
                  style={{
                    backgroundColor: 'var(--accent-light)'
                  }}
                >
                  <Download className="w-10 h-10" style={{ color: 'var(--accent)' }} />
                </div>
                <h2 
                  className="text-2xl font-semibold mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Receive Files
                </h2>
                <p style={{ color: 'var(--text-muted)' }}>Accept files from someone else</p>
              </div>
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}