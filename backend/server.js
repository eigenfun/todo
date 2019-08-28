const express = require('express');
var cors = require('cors')
const {query, insert, update, delete_doc} = require('./db/mongoclient');
var bodyParser = require('body-parser');
var passwordHash = require('password-hash');
let jwt = require('jsonwebtoken')


const app = express();
const port = 4000;
const JWT_SECRET = "GEHEIM";

app.use(cors())

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.use(function(req, res, next) {
  console.log(req.path)
  if (req.path === '/api/login') 
    return next()

  var bearerHeader = req.headers["authorization"]
  if(typeof bearerHeader === 'undefined') {
    res.sendStatus(403)
  }

  const bearer = bearerHeader.split(" ")
  const bearerToken = bearer[1]
  console.log("token: " + bearerToken)

  jwt.verify(bearerToken, JWT_SECRET, (err, token) => {
    req.token = token
    console.log(req.token)

    if (err) {
      return res.sendStatus(403)
    } else {
      req.authed = true
      return next() 
    } 
  })
})


app.post('/api/login', async (req, res, next) => {
  const { username, password } = req.body;
  query('users', {email: username})
  .then((users) => {
    let u = users[0];
    let hash = u.password_hash;
    let match = passwordHash.verify(password, hash)
    if (match) {
      var token = jwt.sign(
        { username: username }, JWT_SECRET)
      res.status(200).json({login: true, token: token});
    } else {
      res.status(200).json({login: 'failed'});
    }
  })
  .catch((error) => {
    res.status(500).json({ message: 'Serer error: MongoDB Query' });
  });
});

app.get('/check', (request, response) => {
  response.status(200).json({status: 'ok', token: request.token});
});

app.get('/api/tasks', (request, response) => {
  console.log(request.authed)
  if (!request.token)
      response.status(401).json({status: 'Login required'});
  query('tasks')
    .then((tasks) => {
      response.status(200).json(tasks);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.post('/api/tasks', (request, response) => {
  let doc = request.body
  console.log(doc)
  insert('tasks', doc)
    .then((task) => {
      response.status(200).json(task);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.put('/api/tasks/:id', (request, response) => {
  let id = request.params.id
  let state = request.body

  console.log(id)

  if (state.status === 'done') {
    update('tasks', id, state)
      .then((status) => {
        response.status(200).json(status);
      })
      .catch((error) => {
        response.status(500).json({ error });
      });
  }

  if (state.status === 'delete') {
    delete_doc('tasks', id, state)
    .then((status) => {
      response.status(200).json(status);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
  }

});


app.listen(port, () => console.log(`App listening on port ${port}!`));
