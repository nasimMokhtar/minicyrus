const  request = require('supertest');
const mongoose = require('mongoose');
const {User} = require('../../models/user');

let server;

describe('/api/users', () => {
    beforeEach(() => { server = require('../../index'); });
    afterEach(() => {
        server.close();
    });
    describe('GET /', () => {
        it('should return all users', async () => {
            const users = [
                { firstName: 'Nasim' },
                { firstName: 'Nasim2' },
            ];

            await User.collection.insertMany(users);
            const res = await request(server).get('/api/users');

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.firstName === 'Nasim')).toBeTruthy();
            expect(res.body.some(g => g.firstName === 'Nasim2')).toBeTruthy();

        });
    });
});
