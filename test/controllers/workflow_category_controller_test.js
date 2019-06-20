const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose')
const app = require('../../app');
const WorkFlowCategory = mongoose.model('workflowcategory');

describe('WorkFlowCategory Controllers', ()=>{

    it('POST to /api/workflowcategories creates a new workflowcategory',(done)=>{
        request(app)
        .post('/api/workflowcategories')
        .send({name:'workflowcategory1', enabled: 1})
        .end(()=>{
            WorkFlowCategory.findOne({name: 'workflowcategory1'})
            .then(workflowcategory =>{
                assert(workflowcategory);
                done();
            });

        })
    });

    it('PUT to /api/workflowcategories/id edits an existing workflowcategorie enabled property', done=>{
        //1- add a workflowcategorie to our empty database
        const wfc1 = new WorkFlowCategory({name: 'workflowcategory1', enabled: 1})
        
        wfc1.save().then(()=> {
            //2- update that workflowcategorie with a put request
            request(app)
            .put(`/api/workflowcategories/${wfc1._id}`)
            .send({enabled: 2})
            .end(()=>{
                // 3 -find the updated version and verify the update ( )
                WorkFlowCategory.findOne({ name: 'workflowcategory1'})
                .then(wfc =>{
                    assert(wfc.enabled === 2);
                    done();
                })
            });
        });
        
    });

    it('GET to /api/workflowcategories get all the existing wortkcategories', done => {
        //1- add three workflowcategories to our empty database
        const wfc1 = new WorkFlowCategory({ name: 'workflowcategory1', enabled: 1 });
        const wfc2 = new WorkFlowCategory({ name: 'workflowcategory2', enabled: 2 });
        const wfc3 = new WorkFlowCategory({ name: 'workflowcategory3', enabled: 2 });

        Promise.all([wfc1.save(), wfc2.save(), wfc3.save()])
            .then(() => {
                //2- get all workflowcategories with get request 
                request(app)
                    .get('/api/workflowcategories')
                    .then((workcategories) => {
                        //3- assert there is only three since we only persisted three
                        assert(workcategories.body.length === 3);
                        done();
                    });
            });

    });

    it('DELETE to /api/workflowcategories/id can delete a workcategory and its references as parentcategory ', (done) => {
        const wfc1 = new WorkFlowCategory({ name: 'workflowcategory1', enabled: 1 });
        const wfc2 = new WorkFlowCategory({ name: 'workflowcategory2', enabled: 2, parentCategory: wfc1._id });
        const wfc3 = new WorkFlowCategory({ name: 'workflowcategory3', enabled: 3, parentCategory: wfc1._id });

        Promise.all([wfc1.save(), wfc2.save(), wfc3.save()])
            .then(() => {
                request(app)
                    .delete(`/api/workflowcategories/${wfc1._id}`)
                    .end(() => {
                        
                        WorkFlowCategory.findOne({ name: 'workflowcategory1' })
                            // assert workflowcategory doesn't exist anymore 
                            .then((wfc) => assert(wfc === null))
                            .then(() => {
                                WorkFlowCategory.find()
                                // assert workflowcategory doesn't exist anymore 
                                .then((workflowcategories)=>{
                                    workflowcategories.forEach(wfc=>{
                                        assert(wfc.parentCategory === null)
                                    })
                                    done();
                                })
                            })
                    });
            })
    })
    
});
