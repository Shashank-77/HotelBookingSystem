const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const db = require('./model/db'); // mongodb instance
const app = express();
const User = require('./model/user');


// Handlebars Middleware
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Homepage Route
//Get Login Page
app.get('/', (req, res) =>
  res.render('index', {
    style: 'login_style.css',
    script: 'script.js',
    title: 'Registration form'
  })
);

// Get SignUp Page
app.get('/signup', (req, res) =>
  res.render('signup', {
    style: 'style.css',
    script: 'script.js'
  })
);
//Get first Page
app.get('/first', (req, res) =>
  res.render('first', {
    style: 'style.css',
    script: 'script.js'
  })
);
//Come to Index Page after completing signup inorder to login(Signup on submit will come to / Method)
app.post("/", (req, res) => {
  var myData = new User(req.body);
  console.log(req.body.name);
  myData.save()
    .then(item => {
      // res.send("Name saved to database" + req.body.name);
      res.render('index', {
        style: 'style.css',
        script: 'script.js',
        title: 'Registration form'
      })
    })
    .catch(err => {
      res.status(400).send("Unable to save to database");
    });
});

//Come to first page on Login(login on submit will come to /first method)
app.post("/first", (req, res) => {
  var myData = new User(req.body);
  console.log(req.body.username);
  User.findOne({ 'username': req.body.username, 'password': req.body.password }).
    then(function (result) {
      if (result) {
        res.render('first', {
          style: '',
          script: '',
          title: 'Registration form'
        })
      }
      else {
        res.redirect('/');
      }
      console.log(result);
    }).
    catch(function () {
      res.status(400).send("Failed to Excecute Query");
    });
});


app.use(express.static(path.join(__dirname, 'public')));

// Members API Routes
app.use('/api/members', require('./routes/api/members'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
