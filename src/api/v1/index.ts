import Axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { BallDontLieResponse } from "./response";
import { Player, Team } from "./player";

export class V1Client {
    private readonly _axios: AxiosInstance;
    constructor(config?: AxiosRequestConfig) {
        const baseUrl = 'https://www.balldontlie.io/api/v1';

        if (config) {
            config.baseURL = config.baseURL ||  baseUrl;
            this._axios = Axios.create(config);
        }
        else {
            this._axios = Axios.create({
                baseURL: baseUrl,
            });
        }
    }

    async *players(page: number = 0, amountPerPage: number = 25, search?: string) {
        let currentPage = page;
        do {
            const { data: { data, meta } } = await this._axios
                .get<BallDontLieResponse<Player[]>>('players', {
                    params: {
                        page: page++,
                        per_page: amountPerPage,
                        search
                    }
                });
            yield data;
            currentPage = meta.next_page;
        } while (currentPage)
    }

    async player(id: number) {
        const { data: { data } } = await this._axios
            .get<BallDontLieResponse<Player>>(`players/${id.toString()}`);
        return data;
    }

    async *teams(page: number = 0, amountPerPage: number = 30) {
        let totalPages = 0;
        do {
            const resp = await this._axios.get<BallDontLieResponse<Team>>('teams', {
                params: {
                    page,
                    per_page: amountPerPage
                }
            });
            yield resp;
            totalPages = resp.data.meta.total_pages;
        } while (page <= totalPages)
    }

    async team(id: number) {
        const { data: { data } } = await this._axios
            .get<BallDontLieResponse<Team>>(`teams/${id.toString()}`);
        return data;
    }

    
}
