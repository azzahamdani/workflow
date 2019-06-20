const WorkFlowCategory = require('../models/workflowCategory');

module.exports = {

    create(req, res, next){
        const workflowcategoryprops = req.body;
        WorkFlowCategory.create(workflowcategoryprops)
        .then(workflowcategory=>{
            res.send(workflowcategory);
        })
        .catch(next);
    },

    read(req, res, next){
        WorkFlowCategory.find()
        .then((workflowcategories)=> res.send(workflowcategories))
        .catch(next);
    },

    edit(req, res, next){
        const workflowCategoryId = req.params.id;
        const workflowCategoryProps = req.body;
        workflowCategoryProps.updatedAt = new Date();

        WorkFlowCategory.findByIdAndUpdate({_id: workflowCategoryId }, workflowCategoryProps,{useFindAndModify: false})
        .then(()=>WorkFlowCategory.findById({_id: workflowCategoryId }))
        .then(workflowcategory => res.send(workflowcategory))
        .catch(next);

    },

    delete(req, res, next){
        const workflowCategoryId = req.params.id;
        // TODO : look at all categories with parent category this one ans set parent category to null 

        WorkFlowCategory.updateMany({parentCategory: workflowCategoryId}, {$set: {parentCategory: null}},{multi: true})
        .then(() => WorkFlowCategory.findByIdAndDelete({_id: workflowCategoryId },{useFindAndModify: false}))
        .then((wfc) => {
            res.status(204).send(wfc)
        })
        .catch(next);
 
    }


}