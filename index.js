const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const db = require('./model/db'); // mongodb instance
const app = express();
const User = require('./model/user');
const Hotel = require('./model/hotel');
const hotel = require('./model/hotel');
const { runInNewContext } = require('vm');

//a variable to identify which hotel belongs to which manager based on username
let un = "";
let hn = "";

// Handlebars Middleware
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Homepage Route
//Get Login Page(The First Page for anyone)
app.get('/', (req, res) =>
  res.render('index', {
    style: 'login_style.css',
    script: 'script.js',
    title: 'Registration form'
  })
);

// Get SignUp Page(The page for signing up)
app.get('/signup', (req, res) =>
  res.render('signup', {
    style: 'signup.css',
    script: 'script.js'
  })
);

// For going back to home page from hotel page we need this for an anchor tag in hotels_list
app.get('/first', (req, res) =>
  res.render('first', {
    style: 'signup.css',
    script: 'script.js'
  })
);

//Come to Index Page after completing signup inorder to login(Signup on submit will come to / Method)
app.post("/", (req, res) => {
  var myData = new User(req.body);
  console.log(req.body);
  myData.save()
    .then(item => {
      // res.send("Name saved to database" + req.body.name);
      res.render('index', {
        style: 'login_style.css',
        script: 'script.js',
        title: 'Registration form'
      })
    })
    .catch(err => {
      res.status(400).send("Unable to save to database");
    });
});

//Come to first page on Login(login on submit will come to /first method)
// First page of either manger or customer accordingly
app.post("/first", (req, res) => {
  // var myData = new User(req.body);
  console.log(req.body.username);
  User.findOne({ 'username': req.body.username, 'password': req.body.password }).
    then(function (result) {
      if (result) {
        un = result.username;
        if (result.role == 1) {
          res.render('first', {
            style: 'style_main.css',
            script: '',
            title: 'Registration form',
            name: result.Firstname
          })
        }
        else {
          res.render('first1', {
            style: 'style_main.css',
            script: '',
            title: 'Registration form',
            name: result.Firstname
          })
        }
      }
      else {
        res.redirect('/');
      }
      // console.log(result);
    }).
    catch(function () {
      res.status(400).send("Failed to Excecute Query");
    });
});

//Customer side Implementation 

//Get hotelss list (The Make a Booking Page)
app.get('/booking', function (req, res) {
  let html = [];
  Hotel.find({}).lean().
    then(function (result) {
      if (result) {
        html = result;
        console.log(html, "HI");
        result.forEach(function (item) {
          item.name1 = item.name.split(' ').join('+');
        })
        res.render('hotel_list', {
          style: 'list.css',
          content: result,
          script: 'script.js'
        })
      }
    }).
    catch(function () {
      res.status(400).send("Failed to Excecute Query");
    });
});

//A get request which is used as a post
// Once into Hotels list page if clicked on a a particular hotel it should go to that hotels page
// thats what this request is for 
app.get("/room_book", (req, res) => {
  let hotelname = req.url.split("=")[1];
  hotelname = hotelname.replace(/\+/g, " ");
  hn = hotelname;
  Hotel.findOne({ 'name': hotelname }).lean().
    then(function (result) {
      if (result) {
        console.log(result);
        res.render('room_book', {
          style: 'room_book.css',
          script: 'script.js',
          title: 'Registration form',
          content: result,
        })
      }
      else {
        res.redirect('/bookings');
      }
      // console.log(result);
    }).
    catch(function () {
      res.status(400).send("Failed to Excecute Query");
    });
  // console.log(hotelname);
});

// after this implementation of booking a romm for a hotel needs to come here
app.post("/payment", (req, res) => {
  // var myData = new User(req.body);
  console.log(req.body);
  let type = -1;
  if (req.body.Class == "Economy") type = 0;
  else if (req.body.Class == "Family") type = 1;
  else type = 2;
  let arr = []; console.log(type);
  let arr1 = [];
  var temp = new Date(req.body.from);

  var fd = new Date(req.body.from);
  var date = fd.getDate();
  var month = fd.getMonth() + 1;
  var year = fd.getFullYear();
  var fstr = date + "/" + month + "/" + year;

  // console.log(fd);
  // fd.setDate(fd.getDate() + 1);
  // console.log(fd);

  var ld = new Date(req.body.till);
  var date = ld.getDate();
  var month = ld.getMonth() + 1;
  var year = ld.getFullYear();
  var lstr = date + "/" + month + "/" + year;



  Hotel.findOne({ 'name': hn }).lean().
    then(function (result) {
      if (result) {
        arr = result.Rooms[type].arrayofrooms;
        for (let i = 0; i < arr.length; i++) {
          arr1 = arr[i].datesbooked; let f = 1;
          while (1) {
            if (arr1.includes(fstr)) {
              f = 0; break;
            }
            if (fstr == lstr) break;
            fd.setDate(fd.getDate() + 1);
            date = fd.getDate();
            month = fd.getMonth() + 1;
            year = fd.getFullYear();
            fstr = date + "/" + month + "/" + year;
          }
          if (f == 1) {
            fd = new Date(req.body.from);
            date = fd.getDate();
            month = fd.getMonth() + 1;
            year = fd.getFullYear();
            fstr = date + "/" + month + "/" + year;
            console.log(f, fstr, lstr);
            while (1) {
              arr1.push(fstr);
              // result.Rooms[type].arrayofrooms.arr[i].datesbooked.push(fstr);
              if (fstr == lstr) break;
              fd.setDate(fd.getDate() + 1);
              date = fd.getDate();
              month = fd.getMonth() + 1;
              year = fd.getFullYear();
              fstr = date + "/" + month + "/" + year;
            }
            console.log(result.Rooms[type].arrayofrooms[i]);
            var myData = new Hotel(result);
            console.log(myData);
            Hotel.findOneAndRemove({ name: hn },
              function (err, docs) {
                if (err) {
                  console.log(err)
                }
                else {
                  console.log("Removed User : ", docs);
                }
              });
            myData.save()
              .then(item => {
                // res.send("Name saved to database" + req.body.name);
                res.render('payment', {

                })
              })
              .catch(err => {
                res.status(400).send("Unable to save to database");
              });
            break;
          }
        }
      }
      else {
        res.redirect('/booking');
      }
      // console.log(result);
    }).
    catch(function () {
      res.status(400).send("Failed to Excecute Query");
    });
  console.log(arr1);

  // res.render('payment', {

  // })

});

//Customer history 
app.get('/customer_history', (req, res) =>
  res.render('customer_history', {

  })
);

// Manager side Begins

// Get the hotel create form
app.get('/create_hotel', (req, res) =>
  res.render('create_hotel', {

  })
);

// Once clicked submit in hotel creation form come back to first page of manager
// and store created page details
app.post("/first1", (req, res) => {
  // var myData = new Hotel(req.body);
  var h = {
    username: un,
    name: req.body.name,
    Address: req.body.Address,
    Contacts: req.body.Contacts,
    Rooms: [
      {
        base: req.body.base1,
        Feature: req.body.Features1,
        numofrooms: req.body.num1,
        arrayofrooms: []
      },
      {
        base: req.body.base2,
        Feature: req.body.Features2,
        numofrooms: req.body.num2,
        arrayofrooms: []
      },
      {
        base: req.body.base2,
        Feature: req.body.Features2,
        numofrooms: req.body.num3,
        arrayofrooms: []
      }
    ]
  };
  for (let i = 0; i < h.Rooms[0].numofrooms; i++) {
    h.Rooms[0].arrayofrooms.push({ datesbooked: [] })
  }
  for (let i = 0; i < h.Rooms[1].numofrooms; i++) {
    h.Rooms[1].arrayofrooms.push({ datesbooked: [] })
  }
  for (let i = 0; i < h.Rooms[2].numofrooms; i++) {
    h.Rooms[2].arrayofrooms.push({ datesbooked: [] })
  }
  var myData = new Hotel(h);
  // console.log(req.body);console.log(myData);console.log(h);
  //First remove if suach a record exists and then replace
  Hotel.findOneAndRemove({ username: un },
    function (err, docs) {
      if (err) {
        console.log(err)
      }
      else {
        console.log("Removed User : ", docs);
      }
    });
  //replacing/creating first time
  myData.save()
    .then(item => {
      // res.send("Name saved to database" + req.body.name);
      res.render('first1', {
        style: 'login_style.css',
        script: 'script.js',
        title: 'Registration form'
      })
    })
    .catch(err => {
      res.status(400).send("Unable to save to database");
    });
});

//History page

app.get('/hotel_history', (req, res) =>
  res.render('hotel_history', {

  })
);


app.use(express.static(path.join(__dirname, 'public')));

// Members API Routes
app.use('/api/members', require('./routes/api/members'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
