import { Device, Castable, PlayableType } from '@lib/models';
import Config from '@lib/config';

import BaseService from './base';

class DeviceService extends BaseService {
    async getAll() : Promise<Device[]> {
        const devices = await this.get(`${Config.ApiUrl}/devices`);
        return [Device.thisDevice()].concat(devices.map((device: Device) => this.build(device)));
    }

    async cast(castable: Castable) : Promise<void> {
        const params: any = {
            url: castable.playable.video(),
            host: castable.options.device.host
        };

        if (castable.playable.type === PlayableType.Movie)
            params.movieId = castable.playable._id;
        else if (castable.playable.type === PlayableType.Episode)
            params.episodeId = castable.playable._id;

        await this.post(`${Config.ApiUrl}/devices/cast`, params);
    }

    async pause(device: Device) {
        await this.post(`${Config.ApiUrl}/devices/pause`, { host: device.host });
    }

    async unpause(device: Device) {
        await this.post(`${Config.ApiUrl}/devices/unpause`, { host: device.host });
    }

    async stop(device: Device) {
        await this.post(`${Config.ApiUrl}/devices/stop`, { host: device.host });
    }

    async seek(device: Device, time: number) {
        await this.post(`${Config.ApiUrl}/devices/seek`, { host: device.host, time });
    }

    async enableSubtitles(device: Device) {
        await this.post(`${Config.ApiUrl}/devices/enable-subtitles`, { host: device.host });
    }

    async disableSubtitles(device: Device) {
        await this.post(`${Config.ApiUrl}/devices/disable-subtitles`, { host: device.host });
    }

    private build(data: any) : Device {
        const built = new Device() as any;
        Object.keys(data).forEach(k => built[k] = data[k]);
        return built;
    }
}

export default new DeviceService();