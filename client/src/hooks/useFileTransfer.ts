import { useState, useCallback, useRef } from 'react';
import { chunkFile, FileAssembler, calculateSpeed, formatBytes } from '../lib/chunking';
import type { FileMetadata, PeerMessage } from '../../../shared/types';

interface UseFileTransferOptions {
  onProgress?: (fileId: string, progress: number) => void;
  onComplete?: (files: File[]) => void;
  onError?: (error: Error) => void;
}

export function useFileTransfer(options: UseFileTransferOptions = {}) {
  const [isTransferring, setIsTransferring] = useState(false);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [progressMap, setProgressMap] = useState<Map<string, number>>(new Map());
  const [speed, setSpeed] = useState(0);
  const assemblerRef = useRef(new FileAssembler());
  const startTimeRef = useRef<number>(0);
  const bytesTransferredRef = useRef<number>(0);
  
  const sendFiles = useCallback(async (files: File[], sendData: (data: any) => void) => {
    setIsTransferring(true);
    startTimeRef.current = Date.now();
    bytesTransferredRef.current = 0;
    
    const metadata: FileMetadata[] = files.map(f => ({
      id: `${f.name}-${f.lastModified}`,
      name: f.name,
      size: f.size,
      type: f.type,
      lastModified: f.lastModified
    }));
    
    sendData({
      type: 'file-metadata',
      payload: { files: metadata }
    });
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileId = metadata[i].id;
      setCurrentFileIndex(i);
      
      for await (const chunk of chunkFile(file, fileId)) {
        sendData({
          type: 'file-chunk',
          payload: {
            fileId: chunk.fileId,
            chunkIndex: chunk.chunkIndex,
            totalChunks: chunk.totalChunks,
            data: Array.from(chunk.data)
          }
        });
        
        bytesTransferredRef.current += chunk.data.length;
        const progress = ((chunk.chunkIndex + 1) / chunk.totalChunks) * 100;
        setProgressMap(prev => new Map(prev).set(fileId, progress));
        options.onProgress?.(fileId, progress);
        
        const elapsed = Date.now() - startTimeRef.current;
        setSpeed(calculateSpeed(bytesTransferredRef.current, elapsed));
      }
    }
    
    sendData({
      type: 'transfer-complete',
      payload: {}
    });
    
    setIsTransferring(false);
    options.onComplete?.(files);
  }, [options]);
  
  const handleReceivedData = useCallback(async (message: PeerMessage) => {
    if (message.type === 'file-metadata') {
      // Store expected files
      const { files } = message.payload;
      files.forEach((file: FileMetadata) => {
        setProgressMap(prev => new Map(prev).set(file.id, 0));
      });
    }
    
    if (message.type === 'file-chunk') {
      const { fileId, chunkIndex, totalChunks, data } = message.payload;
      const isComplete = assemblerRef.current.addChunk(
        fileId,
        chunkIndex,
        totalChunks,
        new Uint8Array(data)
      );
      
      const progress = ((chunkIndex + 1) / totalChunks) * 100;
      setProgressMap(prev => new Map(prev).set(fileId, progress));
      options.onProgress?.(fileId, progress);
      
      if (isComplete) {
      }
    }
    
    if (message.type === 'transfer-complete') {
      setIsTransferring(false);
    }
  }, [options]);
  
  return {
    isTransferring,
    currentFileIndex,
    progressMap,
    speed,
    sendFiles,
    handleReceivedData,
    formatBytes
  };
}