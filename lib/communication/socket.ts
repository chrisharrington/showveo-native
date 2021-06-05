import io, { Socket as RemoteSocket } from 'socket.io-client';
import * as Application from 'expo-application';

import { MessageRequest, MessageType } from './types';

class SocketClass {
    private socket: RemoteSocket;

    constructor() {
        this.socket = io('https://api.showveo.com');
    }

    onReply<Payload>(type: MessageType, callback: (payload: Payload) => void) {
        console.log(`[native] Listening for \"${type}\" replies.`);
        this.socket.on(type, response => {
            console.log(`[native] Received \"${type}\" with payload: ${JSON.stringify(response).substring(0, 5000)}`);
            if (response.deviceId === Application.androidId)
                callback(response.payload);
        });
    }

    onAll<Payload>(type: MessageType, callback: (payload: Payload) => void) {
        console.log(`[native] Listening for \"${type}\" broadcasts.`);
        this.socket.on(type, response => {
            console.log(`[native] Received \"${type}\" with payload: ${JSON.stringify(response).substring(0, 5000)}`);
            callback(response.payload);
        });
    }

    off(type: MessageType, callback: (message: any) => void) {
        this.socket.off(type, callback);
    }

    emit(type: MessageType, payload?: any) {
        const p = payload || {} as MessageRequest;
        p.deviceId = Application.androidId;

        console.log(`[native] Emitting \"${type}\" with payload: ${p ? JSON.stringify(p) : '<empty>'}`);

        this.socket.emit(type, p);
    }
}

export const Socket = new SocketClass();