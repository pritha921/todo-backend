const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const Todo = require('./models/todoModel');
const userModel = require('./models/userModel');
const jwt= require('jsonwebtoken');
const path= require('path');
const bcrypt=require('bcrypt')
const secretKey="secretKey";
const dbConfig= require('./config/dbconfig');
const auth= require('./middlewares/auth');
const errors= require('./middlewares/errors');
const unless= require('express-unless')

mongoose.Promise= global.Promise

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use cors middleware
app.use(cors());

app.use(cors({
    origin: 'http://127.0.0.1:5500'
  }));

  app.use("/users", require("./routes/userRoutes"));
  app.use(errors.errorHandler);

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

app.get('/todo/:id', async(req, res) =>{
    try {
        const {id} = req.params;
        const todo = await Todo.findById(id);
        res.status(200).json(todo);
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

app.put('/todo/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const todo = await Todo.findByIdAndUpdate(id, req.body);
        // we cannot find any product in database
        if(!todo){
            return res.status(404).json({message: `cannot find any product with ID ${id}`})
        }
        const updatedTodo = await Todo.findById(id);
        res.status(200).json(updatedTodo);
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//delete a todo
app.delete('/todo/:id', async(req, res) =>{
    try {
        const {id} = req.params;
        const todo = await Todo.findByIdAndDelete(id);
        if(!todo){
            return res.status(404).json({message: `cannot find any product with ID ${id}`})
        }
        res.status(200).json(todo);
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//mark as read 
app.put('/todo/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await Todo.findByIdAndUpdate(id, { completed: true }, { new: true });
        if (!todo) {
            return res.status(404).json({ message: `Cannot find any todo with ID ${id}` });
        }
        res.status(200).json(todo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//------login and signup functionality--------------

// app.get('/todo/login', (req, res)=>{
//     res.render("login")
// })

// app.get('/todo/signup', (req, res)=>{
//     res.render("signup")
// })

// //Register User
// app.post("/signup", async(req, res)=>{
//     const data={
//         name: req.body.username,
//         password: req.body.password
//     }

//     const userData= await Collection.insertMany([data]);
//     console.log(userData);
//     res.render("todo")
// })


// app.post("/auth/login",(req, res)=>
//     {
//         const user={
//             id:1,
//             username:"Pritha",
//             email:"abc@gmail.com"
//         }

//          jwt.sign({ user }, secretKey, { expiresIn: '300s' }, (err, token) => {
//             res.json({
//                token 
//             })
//          })
        
//     }
// )

app.post("/auth/login", async (req, res) => {
    const { userName, password } = req.body;

    try {
       
        const user = await userModel.findOne({ userName });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ message: "Invalid password" });
        }

       
        jwt.sign({ user }, secretKey, { expiresIn: '300s' }, (err, token) => {
            if (err) {
                return res.status(500).json({ message: "Internal server error" });
            }
            res.json({
                token
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});



   

mongoose.
connect('mongodb+srv://prithasen006:Mymongo07@todoapi.cufbbh8.mongodb.net/node-api?retryWrites=true&w=majority',
{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=>{
    console.log("Connected to MongoDB")
    app.listen(3000, ()=>{
        console.log("Node Api app is running on port 3000")
    })
}).catch(()=>{
    console.log("Error")
})

auth.authenticateToken.unless=unless;
app.use(
    auth.authenticateToken.unless({
        path:[
            {
                url: "users/login", methods: ["POST"]
            },
            {
                url: "users/register", methods: ["POST"]
            }
        ]
    })
)