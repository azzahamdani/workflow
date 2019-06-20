const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * @swagger
 * definitions:
 *   workflow:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *       name:
 *         type: string
 *       description:
 *         type: integer
 *       enabled:
 *         type: string
 *       workflowcategories:
 *         type: array
 *         items:
 *           type: string
 *       workflowvariants:
 *         type: object
 *         properties:
 *           type: string
 *       required:
 *         - name
 *         - enabled
 *         - workflowcategories
 */
const WorkFlowSchema = new Schema({
    name:{
        type: String, 
        required: true,
    },
    description : String,
    enabled: {
        type: Number, //1, 2, 3, 4, 5 // Add On validator for being between 1 and 5 ans test it
        required: true
    },
    //relationships
    workflowcategories:{
        type: [Schema.Types.ObjectId],
        ref: 'workflowcategory',
        validate: {
            validator: (workflowcategories) => workflowcategories.length >= 1 ,
            message: 'a workflow must have at least one workflowcategory'
        },
    },
    workflowvariant: [
       { type: Schema.Types.ObjectId, 
        ref:'workflow'}
    ]
});

WorkFlowSchema.index({name: 'text'});

const WorkFlow = mongoose.model('workflow', WorkFlowSchema);

module.exports = WorkFlow;

