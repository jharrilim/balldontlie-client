import Axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { PaginatedResponse } from "./paginated-response";
import { Player } from "./player";
import { Team } from "./team";

/**
 * A Client for the V1 API of balldontlie.
 * @export
 * @class V1Client
 */
export class V1Client {
    private readonly _axios: AxiosInstance;
    constructor(config?: AxiosRequestConfig) {
        const baseUrl = 'https://www.balldontlie.io/api/v1';

        if (config) {
            config.baseURL = config.baseURL || baseUrl;
            this._axios = Axios.create(config);
        }
        else {
            this._axios = Axios.create({
                baseURL: baseUrl,
            });
        }
    }

    /**
     * An async generator for yielding players in a paginated fashion.
     *
     * ##### Related: [Players](https://www.balldontlie.io/#get-all-players)
     * 
     * @param {number} [page=0] The page to start paginating from. Defaults to 0.
     * @param {number} [amountPerPage=25] The amount of players per page. Defaults to 25.
     * @param {string} [search] A filter for player names. Searches first and last name. Optional.
     * @yields {Promise<Player[]>} A promise containing a list of players.
     * @memberof V1Client
     */
    async *players(page: number = 0, amountPerPage: number = 25, search?: string) {
        let currentPage = page;
        do {
            const { data: { data, meta } } = await this._axios
                .get<PaginatedResponse<Player[]>>('players', {
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

    /**
     * Gets a player from the API using its player ID.
     *
     * ##### Related: [Player](https://www.balldontlie.io/#get-a-specific-player)
     * 
     * @param {number} id The ID of a player.
     * @returns {Promise<Player>} A promise containing the player.
     * @memberof V1Client
     */
    async player(id: number) {
        if(typeof id !== 'number')
            throw new Error('Player ID must be a number.');

        const { data } = await this._axios
            .get<Player>(`players/${id}`);
        return data;
    }

    /**
     * An async generator yielding teams in a paginated fashion.
     *
     * ##### Related: [Teams](https://www.balldontlie.io/#get-all-teams)
     * 
     * @param {number} [page=0] The page to start paginating from. Defaults to 0.
     * @param {number} [amountPerPage=30] The amount of teams per page. Defaults to 30 (The current amount of teams in the NBA).
     * @yields {Promise<Team[]>} A promise containing a list of teams.
     * @memberof V1Client
     */
    async *teams(page: number = 0, amountPerPage: number = 30) {
        let currentPage = page;
        do {
            const { data: { data, meta } } = await this._axios.get<PaginatedResponse<Team[]>>('teams', {
                params: {
                    page: page++,
                    per_page: amountPerPage
                }
            });
            yield data;
            currentPage = meta.next_page;
        } while (currentPage)
    }

    /**
     * Gets a team from the API using its team ID.
     * 
     * ##### Related: [Team](https://www.balldontlie.io/#get-a-specific-team)
     * 
     * @param {number} id The ID of the team.
     * @returns {Promise<Team>} A promise containing the team.
     * @memberof V1Client
     */
    async team(id: number) {
        if(typeof id !== 'number')
            throw new Error('Team ID must be a number.');

        const { data } = await this._axios
            .get<Team>(`teams/${id}`);
        return data;
    }

}
