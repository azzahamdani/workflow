const WorkFlow = require('../models/workflow');
const WorkFlowCategory = require('../models/workflowCategory');

// Query builder 
const buildQuery =(criteria)=>{

    const query ={};

    if(criteria.name){
        query.name= criteria.name
    }

    if(criteria.enabled){
        query.enabled = {
            $gte: criteria.enabled.min,
            $lte: criteria.enabled.max
        };
    };

    if(criteria.wfcids){
        query.workflowcategories = {
            $all: criteria.wfcids,
        };
    };

    return query;
};

module.exports = {
    // to test app
    greeting(req, res){
        res.send({hi: 'there'});
    },

    create(req, res, next){
        const workflowProps= req.body.wfprops;
        const workflowcathegoryId = req.body.wfcId

        // 0 - create the workflow from props
        const workFlow = new WorkFlow(workflowProps);

        // 1- find the category underwhich you will set your workflow
        WorkFlowCategory.findById({_id: workflowcathegoryId })
        .then((workflowcategory)=>{
            
            workFlow.workflowcategories.push(workflowcategory);
            // 2- persist the workflow into workflow categories db
            // workflowcategory.workflows.push(workflow);
            // 3- persist the two in db
            //return Promise.all([workFlow.save(), workflowcategory.save()])
            return workFlow.save()
        })
        .then(() => workFlow.save())
        .then(()=> res.send(workFlow))
        .catch(next);
    },

    readall(req, res, next){
        WorkFlow.find({})
        .then((workflows)=> res.send(workflows))
        .catch(next);
    },

    read(req, res, next){
        const workflowCriteria = req.body // { name : "workflow1", wfcids : [id1..idn], enabled : { min : 1, max: 5} }
        WorkFlow.find(buildQuery(workflowCriteria))
        .then(result => res.send(result))
        .catch(next);
    },

    edit(req, res, next){
        const workflowId = req.params.id;
        const workflowProps = req.body;

        WorkFlow.findByIdAndUpdate({_id: workflowId }, workflowProps,{useFindAndModify: false})
        .then(()=>WorkFlow.findById({_id: workflowId }))
        .then(workflow => res.send(workflow))
        .catch(next);
    },

    delete(req, res, next){
        const workflowId = req.params.id;
        // TODO : look at all categories with parent category this one ans set parent category to null 

        WorkFlow.updateMany({workflowvariant: workflowId}, {$set: {workflowvariant: null}},{multi: true})
        .then(() => WorkFlow.findByIdAndDelete({_id: workflowId },{useFindAndModify: false}))
        .then((wfc) => {
            res.status(204).send(wfc)
        })
        .catch(next);
    }
}