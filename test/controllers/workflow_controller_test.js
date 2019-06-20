const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose')
const app = require('../../app');
const WorkFlow = mongoose.model('workflow');
const WorkFlowCategory = mongoose.model('workflowcategory');

describe('WorkFlows Controllers', () => {


    it('Post to /api/workflows creates a new workflow: passing a category is mandatory', (done) => {
        // create a WorkFlowCathegory 
        const workFlowCathegory = new WorkFlowCategory({ name: "wfc-1", enabled: 1 })
        workFlowCathegory.save()
            .then((workflowcategory) => {
                request(app)
                    .post('/api/workflows')
                    .send({
                        wfprops: { name: "workflow1", enabled: 3 },
                        wfcId: workflowcategory._id.toString()
                    })
                    .end(() => {
                        WorkFlow.findOne({ name: 'workflow1' })
                            .then(workflow => {
                                assert(workflow)
                                done();
                            })

                    });
            })
    });


    it('GET to /api/woekflows gets workflows records with criteria (name, [workflowId] , enabled) ', (done) => {
        const workFlowCategory1 = new WorkFlowCategory({ name: "wfc-1", enabled: 1 });
        const workFlowCategory2 = new WorkFlowCategory({ name: "wfc-2", enabled: 2 });
        const workFlowCategory3 = new WorkFlowCategory({ name: "wfc-3", enabled: 3 });

        const workFlow1 = new WorkFlow({ name: "workflow1", enabled: 3 });
        const workFlow2 = new WorkFlow({ name: "workflow1", enabled: 2 });
        const workFlow3 = new WorkFlow({ name: "workflow3", enabled: 4 });

        workFlow1.workflowcategories.push(workFlowCategory1);
        workFlow1.workflowcategories.push(workFlowCategory2);
        workFlow1.workflowcategories.push(workFlowCategory3);

        workFlow2.workflowcategories.push(workFlowCategory1);
        workFlow2.workflowcategories.push(workFlowCategory2);

        workFlow3.workflowcategories.push(workFlowCategory2);
        workFlow3.workflowcategories.push(workFlowCategory3);

        Promise.all([workFlow1.save(), workFlow2.save(), workFlow3.save()])
            .then(() => {
                request(app)
                    .get('/api/workflows')
                    .send({
                        name: "workflow1",
                        wfcids: [
                            workFlowCategory1._id.toString(),
                            workFlowCategory2._id.toString(),
                            workFlowCategory3._id.toString()
                        ],
                        enabled: { min: 3, max: 4 }
                    })
                    .then((workflows) => {
                        assert(workflows.body.length === 1);
                        done();
                    });
            });
    });

    it('PUT to /api/workflows/id ', (done) => {
        //1- add a workflow to our empty database
        const workFlowCategory4 = new WorkFlowCategory({ name: 'wfc-4', enabled: 1 });
        const workFlow4 = new WorkFlow({ name: 'workflow4', enabled: 3 });
        workFlow4.workflowcategories.push(workFlowCategory4);

        workFlow4.save().then(() => {
            //2- update that workflow with a put request
            request(app)
                .put(`/api/workflows/${workFlow4._id}`)
                .send({ enabled: 2 })
                .end(() => {
                    // 3 -find the updated version and verify the update ( )
                    WorkFlow.findOne({ name: 'workflow4' })
                        .then(wf => {
                            assert(wf.enabled === 2);
                            done();
                        })
                });
        });
    });

    it('DELETE to /api/workflows/id can delete a workflow and its references as workflowvariant ', (done) => {

        const workFlowCategory5 = new WorkFlowCategory({ name: "wfc-5", enabled: 1 });
        const workFlowCategory6 = new WorkFlowCategory({ name: "wfc-6", enabled: 2 });
        const workFlowCategory7 = new WorkFlowCategory({ name: "wfc-7", enabled: 3 });

        const workFlow5 = new WorkFlow({ name: 'workflow5', enabled: 1 });
        const workFlow6 = new WorkFlow({ name: 'workflow6', enabled: 2, workflowvariant: workFlow5._id });
        const workFlow7 = new WorkFlow({ name: 'workflow7', enabled: 3, workflowvariant: workFlow5._id });

        workFlow5.workflowcategories.push(workFlowCategory5);
        workFlow6.workflowcategories.push(workFlowCategory6);
        workFlow7.workflowcategories.push(workFlowCategory7);

        Promise.all([workFlow5.save(), workFlow6.save(), workFlow7.save()])
            .then(() => {
                // WorkFlow.find({})
                // .then((workflows)=>{
                //     console.log(workflows)
                //     done();
                // })
                request(app)
                    .delete(`/api/workflows/${workFlow5._id}`)
                    .end(() => {

                        WorkFlow.findOne({ name: 'workflow5' })
                            // assert workflowcategory doesn't exist anymore 
                            .then((wfc) => assert(wfc === null))
                            .then(() => {
                                WorkFlow.find()
                                    // assert workflowcategory doesn't exist anymore 
                                    .then((workflows) => {
                                        workflows.forEach(wfc => {
                                            //assert(wfc.workflowvariant===null|| wfc.workflowvariant)
                                            if (wfc.workflowvariant!=null){
                                               assert(wfc.workflowvariant.length===0);
                                            }
                                        })
                                        done();
                                    });
                            });
                    });
            });
    });


});