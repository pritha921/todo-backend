

// auth.authenticateToken.unless= unless;
// app.use(
//     auth.authenticateToken.unless({
//         path:[
//             {
//                                 url: "users/login", methods: ["POST"]
//                             },
//                             {
//                                 url: "users/register", methods: ["POST"]
//                             },
//         ],
//     })
// );


// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const app = express();
// const Todo = require('./models/todoModel');
// const userModel = require('./models/userModel');
// const jwt = require('jsonwebtoken');
// const path = require('path');
// const bcrypt = require('bcrypt')
// const secretKey = "secretKey";
// // const dbConfig= require('./config/dbconfig');
// const auth = require("./middlewares/auth")
// const errors = require('./middlewares/errors');

// mongoose.Promise = global.Promise

// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

// // Use cors middleware
// app.use(cors());

// app.use(cors({
//   origin: 'http://127.0.0.1:5500'
// }));

// app.use("/users", require("./routes/userRoutes"));
// app.use(errors.errorHandler);


// app.use((req, res, next) => {
//   const excludedPaths = [
//     "/users/login",
//     "/users/register"
//   ];
//   if (excludedPaths.includes(req.path) && req.method === "POST") {
//     return next();
//   }
//   auth.authenticateToken(req, res, next);
// });

// //routes
// app.get('/', (req, res) => {
//   res.send("Hello node API")
// })

// app.get('/todo', async (req, res) => {
//   try {
//     const todos = await Todo.find({});
//     res.status(200).json(todos)

//   } catch (error) {
//     res.status(500).json({ message: error.message })
//   }
// })

// app.get('/todo/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const todo = await Todo.findById(id);
//     res.status(200).json(todo);
//   } catch (error) {
//     res.status(500).json({ message: error.message })
//   }
// })

// app.post('/todo', async (req, res) => {

//   try {
//     const todo = await Todo.create(req.body)
//     res.status(200).json(todo)
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).json({ message: error.message })
//   }
// })

// //update a todo

// app.put('/todo/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const todo = await Todo.findByIdAndUpdate(id, req.body);
//     if (!todo) {
//       return res.status(404).json({ message: `cannot find any product with ID ${id}` })
//     }
//     const updatedTodo = await Todo.findById(id);
//     res.status(200).json(updatedTodo);

//   } catch (error) {
//     res.status(500).json({ message: error.message })
//   }
// })

// //delete a todo
// app.delete('/todo/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const todo = await Todo.findByIdAndDelete(id);
//     if (!todo) {
//       return res.status(404).json({ message: `cannot find any product with ID ${id}` })
//     }
//     res.status(200).json(todo);

//   } catch (error) {
//     res.status(500).json({ message: error.message })
//   }
// })

// //mark as read 
// app.put('/todo/:id/mark-as-read', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const todo = await Todo.findByIdAndUpdate(id, { completed: true }, { new: true });
//     if (!todo) {
//       return res.status(404).json({ message: `Cannot find any todo with ID ${id}` });
//     }
//     res.status(200).json(todo);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// mongoose
//   .connect('mongodb+srv://prithasen006:Mymongo07@todoapi.cufbbh8.mongodb.net/node-api?retryWrites=true&w=majority')
//   .then(() => {
//     console.log("Connected to MongoDB")
//     app.listen(3000, () => {
//       console.log("Node Api app is running on port 3000")
//     })
//   }).catch(() => {
//     console.log("Error")
//   })


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const Todo = require('./models/todoModel');
const userModel = require('./models/userModel');
const jwt = require('jsonwebtoken');
const path = require('path');
const bcrypt = require('bcrypt')
const secretKey = "secretKey";
const auth = require("./middlewares/auth")
const errors = require('./middlewares/errors');

mongoose.Promise = global.Promise

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use cors middleware
app.use(cors());

app.use(cors({
  origin: 'http://127.0.0.1:5500'
}));

app.use("/users", require("./routes/userRoutes"));
app.use(errors.errorHandler);


app.use((req, res, next) => {
  const excludedPaths = [
    "/users/login",
    "/users/register"
  ];
  if (excludedPaths.includes(req.path) && req.method === "POST") {
    return next();
  }
  auth.authenticateToken(req, res, next);
});

//routes
app.get('/', (req, res) => {
  res.send("Hello node API")
})

// Get todos for the current user
app.get('/todo', auth.authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from authenticated user
    const todos = await Todo.find({ user: userId });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

app.get('/todo/:id', auth.authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findById(id);
    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.post('/todo', auth.authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from authenticated user
    const todo = await Todo.create({ ...req.body, user: userId });
    res.status(200).json(todo)
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message })
  }
})

//update a todo
app.put('/todo/:id', auth.authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // Get user ID from authenticated user
    const todo = await Todo.findByIdAndUpdate({ _id: id, user: userId }, req.body, { new: true });
    if (!todo) {
      return res.status(404).json({ message: `cannot find any product with ID ${id}` })
    }
    res.status(200).json(todo);

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

//delete a todo
app.delete('/todo/:id', auth.authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // Get user ID from authenticated user
    const todo = await Todo.findOneAndDelete({ _id: id, user: userId });
    if (!todo) {
      return res.status(404).json({ message: `cannot find any product with ID ${id}` })
    }
    res.status(200).json(todo);

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

//mark as read 
app.put('/todo/:id/mark-as-read', auth.authenticateToken, async (req, res) => {
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

mongoose
  .connect('mongodb+srv://prithasen006:Mymongo07@todoapi.cufbbh8.mongodb.net/node-api?retryWrites=true&w=majority')
  .then(() => {
    console.log("Connected to MongoDB")
    app.listen(3000, () => {
      console.log("Node Api app is running on port 3000")
    })
  }).catch(() => {
    console.log("Error")
  })

