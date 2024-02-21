const express=require('express');
const mongoose= require('mongoose');  
const app=express();
const Todo= require('./models/todoModel')

app.use(express.json())

//routes
app.get('/',(req, res)=>{
    res.send("Hello node API")
})

app.get('/todo',async(req, res)=>{
    try {
        const todos= await Todo.find({});
        res.status(200).json(todos)
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.post('/todo',async(req, res)=>{

    try {
        const todo= await Todo.create(req.body)
        res.status(200).json(todo)
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message})
    }
})

//update a todo


mongoose.
connect('mongodb+srv://prithasen006:Mymongo07@todoapi.cufbbh8.mongodb.net/node-api?retryWrites=true&w=majority')
.then(()=>{
    console.log("Connected to MongoDB")
    app.listen(3000, ()=>{
        console.log("Node Api app is running on port 3000")
    })
}).catch(()=>{
    console.log("Error")
})