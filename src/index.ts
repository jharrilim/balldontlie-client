import { AxiosRequestConfig } from 'axios';
import { V1Client } from './api/v1';

/**
 * BallDontLie namespace containing functions for each version of the API.
 */
export namespace BallDontLie {

    /**
     * API V1 Client for balldontlie.io.
     *
     * @export
     * @param {AxiosRequestConfig} axiosConfig Axios configuration options for internal axios instance
     * @returns {V1Client}
     */
    export function v1(axiosConfig: AxiosRequestConfig): V1Client {
        return new V1Client(axiosConfig);
    }
}

export default BallDontLie;
