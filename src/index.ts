import { AxiosRequestConfig } from 'axios';
import { V1Client } from './api/v1';

export namespace BallDontLie {

    export function v1(axiosConfig: AxiosRequestConfig): V1Client {
        return new V1Client(axiosConfig);
    }
}
