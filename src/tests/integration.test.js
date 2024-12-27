import request from 'supertest';
import app from '../App'; // Ensure consistent casing
import { AppError } from '../utils/errorHandler'; // Ensure the correct export

describe('API Integration Tests', () => {
    test('GET /api/status should return server status', async () => {
        const response = await request(app)
            .get('/api/status')
            .expect(200);
        
        expect(response.body).toHaveProperty('status');
    });

    test('POST /api/server/control requires authentication', async () => {
        await request(app)
            .post('/api/server/control')
            .send({ action: 'restart' })
            .expect(403);
    });

    test('GET /api/metrics requires proper permissions', async () => {
        await request(app)
            .get('/api/metrics')
            .expect(403);
    });

    test('GET /api/players should return a list of players', async () => {
        const response = await request(app)
            .get('/api/players')
            .expect(200);
        
        expect(response.body).toBeInstanceOf(Array);
    });

    test('POST /api/players should create a new player', async () => {
        const newPlayer = { id: '123', username: 'testuser', points: 100 };
        const response = await request(app)
            .post('/api/players')
            .send(newPlayer)
            .expect(201);
        
        expect(response.body).toHaveProperty('id', '123');
        expect(response.body).toHaveProperty('username', 'testuser');
    });

    test('GET /api/players/:id should return player details', async () => {
        const response = await request(app)
            .get('/api/players/123')
            .expect(200);
        
        expect(response.body).toHaveProperty('id', '123');
        expect(response.body).toHaveProperty('username', 'testuser');
    });

    test('PUT /api/players/:id should update player details', async () => {
        const updates = { points: 200 };
        const response = await request(app)
            .put('/api/players/123')
            .send(updates)
            .expect(200);
        
        expect(response.body).toHaveProperty('points', 200);
    });

    test('DELETE /api/players/:id should delete a player', async () => {
        await request(app)
            .delete('/api/players/123')
            .expect(204);
    });
});
