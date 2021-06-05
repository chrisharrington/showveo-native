import { HttpStatus, HttpError } from '@lib/errors';

export default class BaseService {
    async get(url: string, params?: any) : Promise<any> {
        // const response = await fetch(`${url}${buildQuery(params)}`, {
        //     method: 'GET',
        //     mode: 'cors',
        //     credentials: 'include'
        // });

        // if (response.status === HttpStatus.Unauthorized)
        //     throw new HttpError(HttpStatus.Unauthorized, 'Unauthorized.');
        // if (response.status !== HttpStatus.Success)
        //     throw new HttpError(response.status, response.body ? response.body.toString() : '');

        // return await response.json();
        return Promise.resolve({});
    }

    async post(url: string, params?: any, headers?: any) {
        // headers = headers || {};
        // headers['Content-Type'] = 'application/json';
        
        // const response = await fetch(url, {
        //     method: 'POST',
        //     mode: 'cors',
        //     headers: new Headers(headers),
        //     body: JSON.stringify(params),
        //     credentials: 'include'
        // });

        // if (response.status === HttpStatus.Unauthorized)
        //     throw new HttpError(HttpStatus.Unauthorized, 'Unauthorized.');
        // if (response.status !== HttpStatus.Success)
        //     throw new HttpError(response.status, response.body ? response.body.toString() : '');

        // return response;
        return { status: 200 };
    }
}

function buildQuery(params: any) : string {
    var query = '';
    for (let name in params)
        query += `&${name}=${params[name] ? encodeURIComponent(params[name]) : ''}`;
    return query ? `?${query.substring(1)}` : query;
}