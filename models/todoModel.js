const mongoose = require('mongoose');
const todoSchema = mongoose.Schema(
    {

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Reference to the userModel
            // required: true
        },
        taskText: {
            type: String,
            required: [true, "Please enter a task"]
        },
        completed: {
            type: Boolean,
        }

    },

    {
        timestamps: true,
    }

)

const todo = mongoose.model('todo', todoSchema)

module.exports = todo;
