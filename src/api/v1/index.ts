import Axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { PaginatedResponse } from "./paginated-response";
import { Player } from "./player";
import { Team } from "./team";
import { Game } from "./game";
import { GameOptions } from "./game-options";
import { Stat } from "./stat";
import { StatOptions } from "./stat-options";

const fmtArrayParam = (vals: Array<string | number>) => (prefix: string) => vals
    .reduce<string>((acc, s) => `${acc}${prefix}[]=${s.toString()}&`, '');

const mergeParamsWithArrayParams = <T>(params: T) => <V>(arrayParams: V) => {
    let paramStr = '';
    for (const v of Object.values(arrayParams)) {
        if (v !== undefined)
            paramStr += v;
    }
    for (const [k, v] of Object.entries(params)) {
        if (v !== undefined)
            paramStr += `${k}=${v}&`;
    }
    return paramStr.slice(0, -1);
};

function formatStatOptions(opts: StatOptions) {
    const arrOpts = {
        dates: opts.dates && fmtArrayParam(opts.dates)('dates'),
        seasons: opts.seasons && fmtArrayParam(opts.seasons)('seasons'),
        player_ids: opts.playerIds && fmtArrayParam(opts.playerIds)('player_ids'),
        game_ids: opts.gameIds && fmtArrayParam(opts.gameIds)('game_ids')
    };

    const restOfOpts = {
        postseason: opts.postseason,
        start_date: opts.startDate,
        end_date: opts.endDate
    };

    return mergeParamsWithArrayParams(restOfOpts)(arrOpts);
}

function formatGameOptions(opts: GameOptions) {

    const arrOpts = {
        dates: opts.dates && fmtArrayParam(opts.dates)('dates'),
        seasons: opts.seasons && fmtArrayParam(opts.seasons)('seasons'),
        team_ids: opts.teamIds && fmtArrayParam(opts.teamIds)('team_ids')
    };

    const restOfOpts = {
        postseason: opts.postSeason,
        start_date: opts.startDate,
        end_date: opts.endDate
    };

    return mergeParamsWithArrayParams(restOfOpts)(arrOpts);
}

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
        const { data } = await this._axios.get<Player>(`players/${id}`);
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
        const { data } = await this._axios.get<Team>(`teams/${id}`);
        return data;
    }

    /**
     * An async generator yielding games in a paginated fashion.
     * 
     * Pre season games are not included. Games will update approximately every 10 minutes.
     * 
     * ##### Related: [Games](https://www.balldontlie.io/#get-all-games)
     *
     * @param {number} [page=0] The page to start paginating from. Defaults to 0.
     * @param {number} [amountPerPage=25] The amount of games per page. Defaults to 25.
     * @param {GameOptions} [gameOptions] An options object for filtering games.
     * @yields {Promise<Game[]>}
     * @memberof V1Client
     */
    async *games(page: number = 0, amountPerPage: number = 25, gameOptions?: GameOptions) {
        if (gameOptions) {
            yield* this._gamesWithOptions(page, amountPerPage, gameOptions);
        } else {
            yield* this._games(page, amountPerPage);
        }
    }

    async *_games(page: number, amountPerPage: number) {
        let currentPage = page;
        do {
            const { data: { data, meta } } = await this
                ._axios
                .get<PaginatedResponse<Game[]>>('games', {
                    params: {
                        page: page++,
                        per_page: amountPerPage
                    },
                });
            yield data;
            currentPage = meta.next_page;
        } while (currentPage)

    }

    async *_gamesWithOptions(page: number, amountPerPage: number, gameOptions: GameOptions) {
        let currentPage = page;
        const url = `games?${formatGameOptions(gameOptions)}`;
        do {
            const { data: { data, meta } } = await this._axios.get<PaginatedResponse<Game[]>>(
                `${url}&page=${page++}&per_page=${amountPerPage}`
            );
            yield data;
            currentPage = meta.next_page;
        } while (currentPage)
    }

    /**
     * Gets a game from the API using its game ID.
     *
     * @param {number} id The ID associated with the game
     * @returns {Promise<Game>}
     * @memberof V1Client
     */
    async game(id: number) {
        const { data } = await this._axios.get<Game>(`games/${id}`);
        return data;
    }

    async *stats(page: number = 0, amountPerPage: number = 25, statOptions?: StatOptions) {
        if (statOptions) {
            yield* this._statsWithOptions(page, amountPerPage, statOptions);
        } else {
            yield* this._stats(page, amountPerPage);
        }
    }

    async *_statsWithOptions(page: number, amountPerPage: number, statOptions: StatOptions) {
        let currentPage = page;
        const url = `stats?${formatStatOptions(statOptions)}`;
        do {
            const { data: { data, meta } } = await this._axios.get<PaginatedResponse<Game[]>>(
                `${url}&page=${page++}&per_page=${amountPerPage}`
            );
            yield data;
            currentPage = meta.next_page;
        } while (currentPage)
    }

    async *_stats(page: number, amountPerPage: number) {
        let currentPage = page;
        do {
            const { data: { data, meta } } = await this._axios.get<PaginatedResponse<Stat[]>>(
                'stats', {
                    params: {
                        page: page++,
                        per_page: amountPerPage
                    }
                }
            );
            yield data;
            currentPage = meta.next_page;
        } while (currentPage)
    }
}
