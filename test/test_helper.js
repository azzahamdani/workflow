const mongoose = require('mongoose');

before(done => {
    mongoose.connect('mongodb://localhost/workflow_test', { useNewUrlParser: true, useCreateIndex: true });
    mongoose.connection
        .once('open', () => done())
        .on('error', error => {
            console.warn('Warning', error);
        });
});

beforeEach(done => {
    const { workflows, workflowcategories } = mongoose.connection.collections;
    // workflows.drop()
    // .then(()=>{
    //     return workflowcategories.drop()
    // })
    // .then(()=>done())
    // .catch(()=>done())
    
    // workflowcategories.drop(()=>{
    //     workflows.drop(()=>{
    //         done();
    //     })
    // })

    workflowcategories.drop()
    .then(()=>{
        return workflows.drop()
    })
    .then(()=>done())
    .catch(()=>done())

});
