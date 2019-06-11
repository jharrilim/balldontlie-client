import { BallDontLie, Team } from '../../src';

describe('BallDontLie API Test', () => {
    describe('Players', () => {
        it('can get players', async () => {
            const api = BallDontLie.v1();

            const player1 = (await api.players(0, 1).next()).value;
            const player2 = (await api.players(0, 3).next()).value;

            expect(player1).toBeDefined();
            expect(player2).toBeDefined();
            expect(player1).toBeInstanceOf(Array);
            expect(player1.length).toBe(1);
            expect(player2).toBeInstanceOf(Array);
            expect(player2.length).toBe(3);
        });

        it('can get player by id', async () => {
            const api = BallDontLie.v1();
            const players = await api.players(5, 1).next();

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

            const t = (await api.teams(0, 1).next()).value;

            expect(t).toBeDefined();
            expect(t.length).toBe(1);

            const id = t[0].id;
            expect(id).toBeDefined();

            const team = await api.team(id);

            expect(team).toBeDefined();
            expect(team.id).toBe(id);
        });
    });

    describe('Games', () => {
        it('can get games', async () => {
            const api = BallDontLie.v1();

            const g = (await api.games(0, 2).next()).value;

            expect(g).toBeDefined();
            expect(g.length).toBe(2);

            const g2 = (await api.games(0, 3, { seasons: [ 2018 ] }).next()).value;
            
            expect(g2).toBeDefined();
            expect(g2.length).toBe(3);
            expect(g2[0].season).toBe(2018);
            expect(g2[1].season).toBe(2018);
            expect(g2[2].season).toBe(2018);
        });
    });
});
