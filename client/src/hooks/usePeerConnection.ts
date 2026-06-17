import { useEffect, useRef, useState, useCallback } from 'react';
import Peer from 'peerjs';
import { io, Socket } from 'socket.io-client';
import { config } from '../config';


interface UsePeerConnectionOptions {
  onConnected?: () => void;
  onDisconnected?: () => void;
  onError?: (error: Error) => void;
  onData?: (data: any) => void;
}

export function usePeerConnection(options: UsePeerConnectionOptions = {}) {
  const [peerId, setPeerId] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'failed'>('disconnected');
  const peerRef = useRef<Peer | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const connectionRef = useRef<any>(null);

  const connectToPeer = useCallback((targetPeerId: string) => {
    console.log('connectToPeer called with:', targetPeerId);
    
    if (!peerRef.current) {
      console.error('Peer not initialized');
      options.onError?.(new Error('Peer not initialized'));
      return;
    }
    
    setConnectionStatus('connecting');
    
    try {
      const conn = peerRef.current.connect(targetPeerId);
      connectionRef.current = conn;
      
      conn.on('open', () => {
        console.log('Connection opened to peer:', targetPeerId);
        setConnectionStatus('connected');
        options.onConnected?.();
      });
      
      conn.on('data', (data) => {
        console.log('Data received:', data);
        options.onData?.(data);
      });
      
      conn.on('close', () => {
        console.log('Connection closed');
        setConnectionStatus('disconnected');
        options.onDisconnected?.();
      });
      
      conn.on('error', (err) => {
        console.error('Connection error:', err);
        setConnectionStatus('failed');
        options.onError?.(err);
      });
    } catch (err) {
      console.error('Failed to connect:', err);
      setConnectionStatus('failed');
      options.onError?.(err as Error);
    }
  }, [options]);

  const sendData = useCallback((data: any) => {
    if (connectionRef.current && connectionStatus === 'connected') {
      connectionRef.current.send(data);
      return true;
    }
    console.warn('Cannot send data: not connected');
    return false;
  }, [connectionStatus]);
  
  const disconnect = useCallback(() => {
    if (connectionRef.current) {
      connectionRef.current.close();
      connectionRef.current = null;
    }
    setConnectionStatus('disconnected');
  }, []);

  useEffect(() => {
    console.log('Initializing PeerJS...');
    
    const peer = new Peer({
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' },
        ]
      }
    });

    peerRef.current = peer;

    peer.on('open', (id) => {
      console.log('Peer ready with ID:', id);
      setPeerId(id);
      setConnectionStatus('disconnected');
      
      const signalingUrl = import.meta.env.VITE_SIGNALING_URL || 'http://localhost:3001';
      console.log('Connecting to signaling server:', signalingUrl);
      
      const socket = io(config.signalingUrl);  

      socketRef.current = socket;
      
      socket.on('connect', () => {
        console.log('Signaling server connected');
        socket.emit('register', { peerId: id });
      });
      
      socket.on('peer-joined', ({ senderId, receiverId }) => {
        console.log('Peer joined event:', { senderId, receiverId });
      });
      
      socket.on('offer', async ({ from, offer }) => {
        console.log('Received offer from:', from);
        setConnectionStatus('connecting');
        
        const conn = peer.connect(from);
        connectionRef.current = conn;
        
        conn.on('open', () => {
          console.log('Connection accepted from:', from);
          setConnectionStatus('connected');
          options.onConnected?.();
        });
        
        conn.on('data', (data) => {
          options.onData?.(data);
        });
        
        conn.on('close', () => {
          setConnectionStatus('disconnected');
          options.onDisconnected?.();
        });
        
        conn.on('error', (err) => {
          console.error('Connection error:', err);
          setConnectionStatus('failed');
          options.onError?.(err);
        });
      });
      
      socket.on('connect_error', (err) => {
        console.error('Signaling connection error:', err);
        options.onError?.(new Error('Failed to connect to signaling server'));
      });
    });
    
    peer.on('error', (error) => {
      console.error('Peer error:', error);
      setConnectionStatus('failed');
      options.onError?.(error);
    });
    
    peer.on('disconnected', () => {
      console.log('Peer disconnected');
      setConnectionStatus('disconnected');
      options.onDisconnected?.();
    });
    
    return () => {
      console.log('Cleaning up peer connection');
      if (connectionRef.current) {
        connectionRef.current.close();
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (peerRef.current) {
        peerRef.current.destroy();
      }
    };
  }, [options]);
  
  return {
    peerId,
    connectionStatus,
    connectToPeer,
    sendData,
    disconnect,
  };
}