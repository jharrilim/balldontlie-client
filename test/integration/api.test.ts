import { BallDontLie, Team } from '../../src';
import { SeasonAverages } from '../../src/api/v1/season-averages';

describe('BallDontLie API Test', () => {
    describe('Players', () => {
        it('can get players', async () => {
            const api = BallDontLie.v1();
            const players = await api.players(0, 3);
            const player1Response = await players.next(); // First 3 players
            const player2Response = await players.next(); // Second 3 players

            if (player1Response.done || player2Response.done) {
                throw Error('Expected a response when calling the players API');
            }

            const player1 = player1Response.value;
            const player2 = player2Response.value;

            expect(player1).toBeDefined();
            expect(player2).toBeDefined();
            expect(player1).toBeInstanceOf(Array);
            expect(player1.length).toBe(3);
            expect(player2).toBeInstanceOf(Array);
            expect(player2.length).toBe(3);
        });

        it('can get player by id', async () => {
            const api = BallDontLie.v1();
            const players = await api.players(5, 1).next();
            if (players.done) {
                throw Error('Expected a response when calling the players API');
            }

            expect(players.value).toBeDefined();
            expect(players.value.length).toBe(1);

            const id = players.value[0].id;
            expect(id).toBeDefined();

            const player = await api.player(id);

            expect(player).toBeDefined();
            expect(player.id).toBe(id);
        });
    });

    describe('Teams', () => {
        it('can get teams', async () => {
            const api = BallDontLie.v1();
            let limit = 2;
            let count = 0;
            let totalTeams: Team[] = [];
            for await (const teams of api.teams()) {
                totalTeams = teams;
                count++;
                if (count >= limit) throw Error('Exceeded expected amount of calls');
            }
            expect(totalTeams.length).toBeGreaterThanOrEqual(30);
        });

        it('can get team by id', async () => {
            const api = BallDontLie.v1();

            const teamResponse = (await api.teams(0, 1).next());
            if (teamResponse.done) {
                throw Error('Expected teams');
            }

            const team = teamResponse.value;
            expect(team).toBeDefined();
            expect(team.length).toBe(1);

            const id = team[0].id;
            expect(id).toBeDefined();

            const teamById = await api.team(id);

            expect(teamById).toBeDefined();
            expect(teamById.id).toBe(id);
        });
    });

    describe('Games', () => {
        it('can get games with #games and get a single game with #game', async () => {
            const api = BallDontLie.v1();

            const gamesResponse = await api.games(0, 2).next();
            if (gamesResponse.done) {
                throw Error('Expected to get games from Games API');
            }
            const games1 = gamesResponse.value;
            expect(games1).toBeDefined();
            expect(games1.length).toBe(2);

            const gamesResponse2 = await api.games(0, 3, { seasons: [2018] }).next();
            if (gamesResponse2.done) {
                throw Error('Expected to get games from Games API');
            }
            const games2 = gamesResponse2.value;

            expect(games2).toBeDefined();
            expect(games2.length).toBe(3);
            expect(games2[0].season).toBe(2018);
            expect(games2[1].season).toBe(2018);
            expect(games2[2].season).toBe(2018);

            const { id, home_team, home_team_score, visitor_team, visitor_team_score } = games2[0];
            const g3 = await api.game(id);

            expect(g3).toBeDefined();
            expect(g3.id).toEqual(id);
            expect(g3.home_team.name).toBe(home_team.name);
            expect(g3.home_team_score).toBe(home_team_score);
            expect(g3.visitor_team.name).toBe(visitor_team.name);
            expect(g3.visitor_team_score).toBe(visitor_team_score);
        });
    });

    describe('Stats', () => {
        it('can get stats', async () => {
            const api = BallDontLie.v1();

            const stats = await api.stats(0, 10, { playerIds: ['100', '120'] }).next();
            if (stats.done) {
                throw Error('Expected to get stats from Stats API');
            }

            expect(stats.value).toBeDefined();
            expect(stats.value[0].ast).toBeDefined();
        });
    });

    describe('Season Averages', () => {
        it('can get season averages', async () => {
            const api = BallDontLie.v1();
            const averagesResponse = await api.players(0, 1, 'kawhi').next();
            if (averagesResponse.done) {
                throw Error('Expected to get season averages from Season Averages API');
            }
            const [player] = averagesResponse.value;
            const [avgs] = await api.seasonAverages('2018', [player.id]);

            expect(avgs).toBeDefined();
            expect(avgs.player_id).toBe(player.id);
        })
    })
});
