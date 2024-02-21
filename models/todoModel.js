const mongoose= require('mongoose');
const todoSchema = mongoose.Schema(
    {
        taskText:{
            type: String,
            required: [true,"Please enter a task"]
        },
        completed:{
            type: Boolean,
        }
    },
    {
        timestamps:true,
    }
)

const todo= mongoose.model('todo',todoSchema)

module.exports= todo;
