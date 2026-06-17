export interface FileMetadata {
  id: string;
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

export interface TransferFile {
  metadata: FileMetadata;
  chunks: Uint8Array[];
  receivedChunks?: number;
}

export interface TransferSession {
  sessionId: string;
  files: FileMetadata[];
  totalSize: number;
  status: 'waiting' | 'transferring' | 'complete' | 'failed' | 'cancelled';
  startTime?: number;
  endTime?: number;
}

export interface TransferHistoryEntry {
  id: string;
  sessionId: string;
  direction: 'sent' | 'received';
  files: FileMetadata[];
  totalSize: number;
  timestamp: number;
  status: 'complete' | 'failed' | 'cancelled';
}

export interface PeerMessage {
  type: 'offer' | 'answer' | 'ice-candidate' | 'file-metadata' | 'file-chunk' | 'transfer-complete' | 'accept' | 'reject';
  payload: any;
  sessionId?: string;
}