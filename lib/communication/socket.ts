import { CastState } from 'showveo-lib';
import io, { Socket as RemoteSocket } from 'socket.io-client';

export interface DeviceStatusMessage {
    device: string;
    media: string | null;
    state: CastState;
    elapsed: number;
}

class SocketClass {
    private socket: RemoteSocket;

    constructor() {
        this.socket = io('https://api.showveo.com');
    }

    on(type: 'status', callback: (message: DeviceStatusMessage) => void) {
        this.socket.on(type, callback);
    }

    off(type: 'status', callback: (message: DeviceStatusMessage) => void) {
        this.socket.off(type, callback);
    }
}

export const Socket = new SocketClass();