export enum MessageType {
    GetDevicesRequest = 'get-devices-request',
    GetDevicesResponse = 'get-devices-response',

    GetMoviesRequest = 'get-movies-request',
    GetMoviesResponse = 'get-movies-response',

    CastRequest = 'cast-request',
    CastResponse = 'cast-response',

    PauseRequest = 'pause-request',
    PauseResponse = 'pause-response',

    UnpauseRequest = 'unpause-request',
    UnpauseResponse = 'unpause-response',

    SeekRequest = 'seek-request',
    SeekResponse = 'seek-response',

    SubtitlesRequest = 'subtitles-request',
    SubtitlesResponse = 'subtitles-response',

    DeviceStatusRequest = 'device-status-request',
    DeviceStatusResponse = 'device-status-response'
}

export enum MessageResponseStatus {
    Success,
    Error
}

export interface MessageRequest {
    deviceId: string | null;
}

export interface MessageResponse {
    deviceId: string;
    status: MessageResponseStatus; 
}

export interface CastMessageRequest extends MessageRequest {
    movieId?: string;
    episodeId?: string;
}