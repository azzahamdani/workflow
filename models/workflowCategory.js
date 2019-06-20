const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
* @swagger
* definitions:
*   workflowcategory:
*       type: object
*       properties:
*       id:
*           type: string
*       name:
*           type: string
*       description:
*           type: string
*       enabled:
*           type: integer
*       createdAt:
*           type: string
*       updatedAt:
*           type: string
*       parentCategory:
*           type: object
*           properties: 
*               id:
*                   type: string
*           required:
*               - name
*               - enabled
*/
const WorkFlowCategorySchema = new Schema({
    name:{
        type: String, 
        required: true
    },
    description : String,
    createdAt : { 
        type: Date, 
        default: new Date()
    },
    updatedAt: { 
        type: Date, 
        default: new Date()
    },
    enabled: {
        type: Number, //1, 2, 3, 4, 5 // Add On validator for being between 1 and 5 ans test it
        required: true
    },
    //TODO relationships
    // workflows: [{
    //     type: Schema.Types.ObjectId,
    //     ref: 'workflow'
    // }],
    parentCategory: {
        type : Schema.Types.ObjectId,
        ref: 'workflowcategory'
    }
});

const WorkFlowCategory = mongoose.model('workflowcategory', WorkFlowCategorySchema);

module.exports = WorkFlowCategory;
