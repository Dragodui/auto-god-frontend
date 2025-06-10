import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;

  connect(): Socket {
    if (!this.socket) {
      this.socket = io(import.meta.env.VITE_SERVER_HOST || 'http://localhost:8000', {
        withCredentials: true,
      });
    }
    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  joinChat(chatId: string): void {
    if (this.socket) {
      this.socket.emit('join-chat', chatId);
    }
  }

  onNewMessage(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on('new-message', callback);
    }
  }

  offNewMessage(): void {
    if (this.socket) {
      this.socket.off('new-message');
    }
  }
}

export default new SocketService();