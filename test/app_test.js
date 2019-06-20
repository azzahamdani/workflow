const assert = require('assert');
const request = require('supertest');
const app = require('../app');

describe('express app ', ()=>{
    it('handeling a get request to /api',(done)=>{
        request(app)
        .get('/api')
        .end((error, response)=>{
            assert(response.body.hi==='there');
            done();
        });
    });
});