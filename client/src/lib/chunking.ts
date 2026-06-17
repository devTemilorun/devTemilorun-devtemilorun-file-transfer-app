
const CHUNK_SIZE = 16 * 1024; 

export interface ChunkInfo {
  fileId: string;
  chunkIndex: number;
  totalChunks: number;
  data: Uint8Array;
}

export async function* chunkFile(file: File, fileId: string): AsyncGenerator<ChunkInfo> {
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  
  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, file.size);
    const chunkData = await file.slice(start, end).arrayBuffer();
    
    yield {
      fileId,
      chunkIndex: i,
      totalChunks,
      data: new Uint8Array(chunkData)
    };
  }
}

export class FileAssembler {
  private chunks: Map<string, Map<number, Uint8Array>> = new Map();
  private expectedChunks: Map<string, number> = new Map();
  
  addChunk(fileId: string, chunkIndex: number, totalChunks: number, data: Uint8Array): boolean {
    if (!this.chunks.has(fileId)) {
      this.chunks.set(fileId, new Map());
      this.expectedChunks.set(fileId, totalChunks);
    }
    
    const fileChunks = this.chunks.get(fileId)!;
    fileChunks.set(chunkIndex, data);
    
    return fileChunks.size === totalChunks;
  }
  
  async assembleFile(fileId: string, fileName: string, fileType: string): Promise<File> {
    const fileChunks = this.chunks.get(fileId);
    const totalChunks = this.expectedChunks.get(fileId);
    
    if (!fileChunks || !totalChunks) {
      throw new Error(`Incomplete file data for ${fileId}`);
    }
    
    const chunks: Uint8Array[] = [];
    for (let i = 0; i < totalChunks; i++) {
      const chunk = fileChunks.get(i);
      if (!chunk) {
        throw new Error(`Missing chunk ${i} for ${fileId}`);
      }
      chunks.push(chunk);
    }
    
    const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
    const combined = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      combined.set(chunk, offset);
      offset += chunk.length;
    }
    
    const blob = new Blob([combined], { type: fileType });
    return new File([blob], fileName, { type: fileType, lastModified: Date.now() });
  }
  
  cleanup(fileId: string) {
    this.chunks.delete(fileId);
    this.expectedChunks.delete(fileId);
  }
}

export function calculateSpeed(bytesTransferred: number, timeMs: number): number {
  const seconds = timeMs / 1000;
  if (seconds === 0) return 0;
  const mbps = (bytesTransferred / 1024 / 1024) / seconds;
  return Math.round(mbps * 100) / 100;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}