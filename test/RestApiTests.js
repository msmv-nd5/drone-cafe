const supertest = require('supertest');
const expect = require('chai').expect;

describe('REST API', () => {
    let server;
    before((done) => {
        require('../app');
        setTimeout(() => {
            server = supertest.agent('http://localhost:3000');
            done();
        }, 1000);
    });

    describe('создание пользователя', () => {

        it('POST /api/v1/users должен вернуть код 200 и объект пользователя', done => {
            server
                .post('/api/v1/users')
                .type('form')
                .send({
                    'name': 'Test',
                    'email': 'test1@test.ru',
                    'credit': 100
                })
                .set('charset', /UTF-8/)
                .expect(200)
                .end((err, response) => {
                    expect(response.body.ops[0].name).to.equal('Test');
                    expect(response.body.ops[0].email).to.equal('test1@test.ru');
                    expect(response.body.ops[0].credit).to.equal('100');
                    done();
                });
        });
    });

    describe('поиск пользователя', () => {
        it('GET /api/v1/users/test1@test.ru должен вернуть код 200 и объект пользователя', done => {
            server
                .get('/api/v1/users/test1@test.ru')
                .expect(200)
                .end((err, response) => {
                    expect(response.body[0].name).to.equal('Test');
                    expect(response.body[0].email).to.equal('test1@test.ru');
                    expect(response.body[0].credit).to.equal('100');
                    done();
                });
        });
    });

    describe('получение списка блюд', () => {
        it('GET /api/v1/menu/ должен вернуть код 200', done => {
            server
                .get('/api/v1/menu')
                .expect(200)
                .end((err, response) => {
                    done();
                });
        });
    });

    describe('получение списка блюд для пользователя', () => {
        it('GET /api/v1/orders/test1@test.ru должен вернуть код 200', done => {
            server
                .get('/api/v1/orders/test1@test.ru')
                .expect(200)
                .end((err, response) => {
                    done();
                });
        });
    });

});
