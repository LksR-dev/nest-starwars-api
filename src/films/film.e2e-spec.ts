import {
  request,
  app,
  authTokenAdmin,
  authTokenRegular,
} from '../../test/app.e2e-spec';

describe('Films (e2e)', () => {
  let createdFilmId: string;

  beforeAll(async () => {
    if (!authTokenAdmin || !authTokenRegular) {
      throw new Error(
        'Tokens were not initialized correctly in app.e2e-spec.ts',
      );
    }
  });

  describe('POST /films - Create film', () => {
    it('should create a movie correctly with administrator credentials.', async () => {
      const response = await request(app.getHttpServer())
        .post('/films')
        .set('Authorization', `Bearer ${authTokenAdmin}`)
        .send({
          title: 'Interstellar',
          director: 'Christopher Nolan',
          description:
            "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
          release_date: new Date().toISOString(),
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('title', 'Interstellar');
      expect(response.body).toHaveProperty('director', 'Christopher Nolan');

      createdFilmId = response.body.id;
    });

    it('should reject the creation of a movie without authentication', async () => {
      const response = await request(app.getHttpServer())
        .post('/films')
        .send({
          title: 'Inception',
          director: 'Christopher Nolan',
          description:
            'A thief who enters the dreams of others to steal secrets is given a chance to erase his criminal past.',
          release_date: new Date().toISOString(),
        })
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Unauthorized');
    });

    it('should reject the creation of a movie with invalid data.', async () => {
      const response = await request(app.getHttpServer())
        .post('/films')
        .set('Authorization', `Bearer ${authTokenAdmin}`)
        .send({
          title: '',
          director: '',
          description: '',
          release_date: 'invalid-date',
        })
        .expect(500);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /films - Get films', () => {
    it('should get all movies with pagination', async () => {
      const response = await request(app.getHttpServer())
        .get('/films?page=1&limit=10')
        .expect(200);

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toBeInstanceOf(Array);
    });

    it('Should return an error if no paging parameters are passed', async () => {
      const response = await request(app.getHttpServer())
        .get('/films')
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /films/:id - Obtain a specific film', () => {
    it('should obtain a film for your ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/films/${createdFilmId}`)
        .set('Authorization', `Bearer ${authTokenRegular}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', createdFilmId);
      expect(response.body).toHaveProperty('title', 'Interstellar');
    });

    it('Should return an error if the movie does not exist', async () => {
      const response = await request(app.getHttpServer())
        .get('/films/invalid-id')
        .set('Authorization', `Bearer ${authTokenRegular}`)
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should return an error if the user does not have permissions.', async () => {
      const response = await request(app.getHttpServer())
        .get(`/films/${createdFilmId}`)
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Unauthorized');
    });

    describe('DELETE /films/:id - Delete film', () => {
      it('should delete a movie with administrator credentials.', async () => {
        const response = await request(app.getHttpServer())
          .delete(`/films/${createdFilmId}`)
          .set('Authorization', `Bearer ${authTokenAdmin}`)
          .expect(200);

        expect(response.body).toHaveProperty(
          'message',
          'Film deleted successfully',
        );
      });

      it('should refuse the deletion of a movie without authentication.', async () => {
        const response = await request(app.getHttpServer())
          .delete(`/films/${createdFilmId}`)
          .expect(401);

        expect(response.body).toHaveProperty('message', 'Unauthorized');
      });

      it('should refuse the deletion of a movie with regular user', async () => {
        const response = await request(app.getHttpServer())
          .delete(`/films/${createdFilmId}`)
          .set('Authorization', `Bearer ${authTokenRegular}`)
          .expect(403);

        expect(response.body).toHaveProperty(
          'message',
          'User does not have the necessary roles to access this resource',
        );
      });

      it('Should return an error if the movie does not exist', async () => {
        const response = await request(app.getHttpServer())
          .delete('/films/invalid-id')
          .set('Authorization', `Bearer ${authTokenAdmin}`)
          .expect(400);

        expect(response.body).toHaveProperty('message');
      });

      it('Should return an error if the user does not have permissions.', async () => {
        const response = await request(app.getHttpServer())
          .delete(`/films/${createdFilmId}`)
          .expect(401);

        expect(response.body).toHaveProperty('message', 'Unauthorized');
      });
    });
  });
});
