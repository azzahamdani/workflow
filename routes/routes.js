const WorkFlowController = require('../controllers/workflows_controller');
const WorkFlowCategoryController = require('../controllers/workflow_category_controller');

module.exports = (app) => {

    // for testing express app
    app.get('/api', WorkFlowController.greeting);

    
    app.post('/api/workflows', WorkFlowController.create);

    
    app.get('/api/workflows', WorkFlowController.read);

    // PUT for editing an existing workflow
    app.put('/api/workflows/:id', WorkFlowController.edit);

    // DELETE for deleting an existing workflow
    app.delete('/api/workflows/:id', WorkFlowController.delete);

    app.post('/api/workflowcategories', WorkFlowCategoryController.create);

    // GET for getting all workflowscategory
    app.get('/api/workflowcategories', WorkFlowCategoryController.read);

    // PUT for editing an existing workflowcategory 
    app.put('/api/workflowcategories/:id', WorkFlowCategoryController.edit);

    // DELETE for deleting an existing workflowcategory
    app.delete('/api/workflowcategories/:id', WorkFlowCategoryController.delete);
}