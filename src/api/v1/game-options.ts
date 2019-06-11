/**
 * Options for the #games method on the V1Client.
 *
 * 
 * @see {@link http://www.balldontlie.io/#get-all-games }
 * @export
 * @interface GameOptions
 */
export interface GameOptions {
    /**
     * An array of dates in the format 'YYYY-MM-DD'.
     *
     * Example:
     * 
     * ['1999-12-25', '2010-01-09', '2018-11-08']
     * 
     * @type {string[]}
     * @memberof GameOptions
     */
    dates?: string[];

    /**
     * An array of seasons.
     *
     * Example:
     * 
     * [1999, 2010, 2018]
     * 
     * or
     * 
     * ['1999', '2010', '2018']
     * 
     * @type {Array<string | number>}
     * @memberof GameOptions
     */
    seasons?: Array<string | number>;

    /**
     * An array of team IDs.
     * 
     * Example:
     * 
     * ['9', '1']
     * 
     * or
     * 
     * [9, 1]
     *
     * @type {string[]}
     * @memberof GameOptions
     */
    teamIds?: Array<string | number>;

    /**
     * Boolean for filtering for post season games. Set to true to get only post season games.
     *
     * @type {boolean}
     * @memberof GameOptions
     */
    postSeason?: boolean;

    /**
     * A single date in 'YYYY-MM-DD' format.
     * This is used to select games that occur on or after this date.
     *
     * @type {string}
     * @memberof GameOptions
     */
    startDate?: string;

    /**
     * A single date in 'YYYY-MM-DD' format.
     * This is used to select games that occur on or before this date.
     *
     * @type {string}
     * @memberof GameOptions
     */
    endDate?: string;
}
