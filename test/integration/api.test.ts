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
                if(count >= limit) throw Error('Exceeded expected amount of calls');
            }
            expect(totalTeams.length).toBeGreaterThanOrEqual(30);
        });
    });
});
