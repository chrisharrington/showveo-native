// import MovieService from '@lib/data/movies';
// import EpisodeService from '@lib/data/episodes';
import Config from '@lib/config';
import { StringExtensions } from '@lib/extensions';

export enum Status {
    Missing = 'missing',
    Queued = 'queued',
    Fulfilled = 'fulfilled'
}

export enum CastState {
    Idle = 'IDLE',
    Paused = 'PAUSED',
    Playing = 'PLAYING',
    Buffering = 'BUFFERING',
    Finished = 'FINISHED'
}

export enum PlayableType {
    Movie,
    Episode
}

export enum Screen {
    Movies = 'Movies',
    Cast = 'Cast'
}

export interface Navigation {
    navigate: (screen: Screen, params?: any) => void;
    closeDrawer: () => void;
    goBack: () => void;
}

export interface Playable {
    _id: string;
    runtime: number;
    progress: number;
    subtitlesStatus: Status;
    type: PlayableType;

    video(seek?: number) : string;
    subtitle() : string;
    saveProgress(time: number) : Promise<void>;
    stop(device: Device) : Promise<void>;
}

export interface Media {
    name: string;
    poster: string;
    synopsis: string;
    backdrop: string;
    year: string;
    genres: string[];
}

export class Movie implements Media, Playable {
    _id: string;
    name: string;
    poster: string;
    backdrop: string;
    synopsis: string;
    runtime: number;
    progress: number;
    year: string;
    subtitlesStatus: Status;
    genres: string[];
    type: PlayableType = PlayableType.Movie;

    static fromRaw(raw: any) : Movie {
        const movie = new Movie() as any;
        Object.keys(raw).forEach(key => movie[key] = raw[key]);
        return movie;
    }

    video(seek?: number) : string {
        return `${Config.ApiUrl}/movies/play/${this.year}/${StringExtensions.toKebabCase(this.name)}?seek=${seek || 0}`;
    }

    subtitle() : string {
        return `${Config.ApiUrl}/movies/subtitle/${this.year}/${StringExtensions.toKebabCase(this.name)}`;
    }

    async saveProgress(time: number) : Promise<void> {
        // await MovieService.saveProgress(this._id, time);
    }

    async stop(device: Device) : Promise<void> {
        // await MovieService.stop(this, device);
    }
}

export class Show implements Media {
    name: string;
    poster: string;
    backdrop: string;
    synopsis: string;
    year: string;
    genres: string[];
    runtime: number;
}

export class Season {
    number: number;
    poster: string;
    synopsis: string;
    episodeCount: number;
}

export class Episode implements Playable {
    _id: string;
    runtime: number;
    progress: number;
    name: string;
    show: string;
    season: number;
    number: number;
    synopsis: string;
    subtitlesStatus: Status;
    airDate: string;
    type: PlayableType = PlayableType.Episode;

    video(seek?: number) : string {
        return `${Config.ApiUrl}/shows/play/${this.show}/${this.season}/${this.number}?seek=${seek || 0}`;
    }

    subtitle() : string {
        return `${Config.ApiUrl}/shows/subtitle/${this._id}`;
    }

    async saveProgress(time: number) : Promise<void> {
        // await EpisodeService.saveProgress(this._id, time);
    }

    async stop(device: Device) : Promise<void> {
        // await EpisodeService.stop(this, device);
    }
}

export class Device {
    id: string;
    name: string;
    media: string | null;
    host: string;
    isThisDevice: boolean;

    constructor() {
        this.isThisDevice = false;
    }

    static fromRaw(raw: any) : Device {
        const device = new Device() as any;
        Object.keys(raw).forEach(key => device[key] = raw[key]);
        return device;
    }

    static thisDevice() : Device {
        const device = new Device();
        device.id = '';
        device.name = 'This Device';
        device.host = 'local';
        device.isThisDevice = true;
        return device;
    }
}

export class PlayOptions {
    device: Device;
    isResume: boolean;
    isSubtitled: boolean;

    constructor(device: Device, isResume: boolean, isSubtitled: boolean) {
        this.device = device;
        this.isResume = isResume;
        this.isSubtitled = isSubtitled;
    }
}

export class Castable {
    playable: Playable;
    options: PlayOptions;

    constructor(playable: Playable, options: PlayOptions) {
        this.playable = playable;
        this.options = options;
    }
}

export class User {
    emailAddress: string;
}