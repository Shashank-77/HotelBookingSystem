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
let un1 = "";
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
    script: 'script.js',
    name: un,
  })
);

app.get('/first1', (req, res) =>
  res.render('first1', {
    style: 'signup.css',
    script: 'script.js',
    name: un,
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
      return res.status(400).send("Unable to save to database");
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
      return res.status(400).send("Failed to Excecute Query");
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
      return res.status(400).send("Failed to Excecute Query");
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
      return res.status(400).send("Failed to Excecute Query");
    });
  // console.log(hotelname);
});
//sorting function
function dateToNum(d) {
  // Convert date "26/06/2016" to 20160626
  d = d.split("/"); return Number(d[2] + d[1] + d[0]);
}

// after this implementation of booking a room for a hotel needs to come here
app.post("/payment", (req, res) => {
  // var myData = new User(req.body);
  console.log(req.body);
  let type = -1;
  if (req.body.Class == "Economy") type = 0;
  else if (req.body.Class == "Family") type = 1;
  else type = 2;
  let arr = []; console.log(type);
  let arr1 = [];
  let f = 1;
  let nights = 0;
  var fd = new Date(req.body.from);
  var date = fd.getDate();
  var month = fd.getMonth() + 1;
  var year = fd.getFullYear();
  var fstr = date + "/" + month + "/" + year;

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
          arr1 = arr[i].datesbooked; f = 1;
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
              nights++;
              arr1.push(fstr);
              // result.Rooms[type].arrayofrooms.arr[i].datesbooked.push(fstr);
              if (fstr == lstr) break;
              fd.setDate(fd.getDate() + 1);
              date = fd.getDate();
              month = fd.getMonth() + 1;
              year = fd.getFullYear();
              fstr = date + "/" + month + "/" + year;
            }

            arr1.sort(function (a, b) {
              return dateToNum(a) - dateToNum(b);
            });
            console.log(result.Rooms[type].arrayofrooms[i]);
            var myData = new Hotel(result);
            console.log(myData);
            un1 = ""; //username of manager of hotel
            Hotel.findOneAndRemove({ name: hn }, function (err, docs) {
              if (err) console.log(err)
              else {
                un1 = docs.username;
                console.log("Removed User : ", docs);
              }
            });
            console.log("HIIIIII", un1, "HIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII")
            myData.save()
              .then(item => {
                //For user history
                User.findOne({ 'username': un }).lean().
                  then(function (result) {
                    if (result) {
                      result.history.push({
                        'from': req.body.from,
                        'till': req.body.till,
                        'hotelname': hn,
                        'room_type': req.body.Class,
                        'Paid': item.Rooms[type].base,
                      })
                      console.log(result);
                      //Create User
                      var myData1 = new User(result);
                      //Remove User
                      User.findOneAndRemove({ username: un }, function (err, docs) {
                        if (err) console.log(err)
                        else console.log("Removed User : ", docs);
                      });
                      //Insert User
                      myData1.save().then(item => { }).catch(err => {
                        return res.status(400).send("Unable to save to database");
                      });
                      res.render('payment', {
                        u: result,
                        content: item,
                        type: req.body.Class,
                        cost: item.Rooms[type].base,
                        nights: nights
                      })
                      return;
                    }
                    else console.log("HI");
                  }).catch(function () {
                    return res.status(400).send("Failed to Excecute Query");
                  });
                // For Manager history
                User.findOne({ 'username': un1 }).lean().
                  then(function (result) {
                    console.log(un1, "BYEE");
                    if (result) {
                      result.history.push({
                        'from': req.body.from,
                        'till': req.body.till,
                        'username': un,
                        'room_type': req.body.Class,
                        'Paid': item.Rooms[type].base,
                      })
                      console.log(result);
                      //Create User
                      var myData1 = new User(result);
                      //Remove User
                      User.findOneAndRemove({ username: un1 }, function (err, docs) {
                        if (err) console.log(err)
                        else console.log("Removed User : ", docs);
                      });
                      //Insert User
                      myData1.save().then(item => { }).catch(err => {
                        return res.status(400).send("Unable to save to database");
                      });
                      // res.render('payment', {
                      //   u: result,
                      //   content: item,
                      //   type: req.body.Class,
                      //   cost: item.Rooms[type].base,
                      //   nights: nights
                      // })
                    }
                    else console.log("HI");
                  }).catch(function () {
                    return res.status(400).send("Failed to Excecute Query");
                  });
              })
              .catch(err => {
                return res.status(400).send("Unable to save to database");
              });
            break;
          }
        }
        if (f == 0) {
          res.redirect(`/room_book?id=${hn}`);
          return;
        }
      }
      else {

      }
    }).
    catch(function () {
      return res.status(400).send("Failed to Excecute Query");
    });
});

//Payment Implementation comes here

//Customer history
app.get('/customer_history', (req, res) => {
  User.findOne({ 'username': un }).lean().
    then(function (result) {
      if (result) {
        res.render('customer_history', {
          content: result.history,
        })
      }
    }).
    catch(function () {
      return res.status(400).send("Failed to Excecute Query");
    });
}
);

//customer update
app.get('/customer_update', (req, res) => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = String(today.getFullYear());

  today = [yyyy, mm, dd];
  console.log(today);

  User.findOne({ 'username': un }).lean().
    then(function (result) {
      if (result) {
        resultant = [];
        result.history.forEach(function (item) {
          start = item.from.split('-'); let f = 0;
          for (let i = 0; i < 3; i++) {
            if (today[i] > start[i]) f = 1;
            else if (today[i] < start[i]) break;
          }
          if (today[0] == start[0] && today[1] == start[1] && today[2] == start[2]) f = 1;
          if (!f) resultant.push(item);
        })
        resultant.forEach(function (item) {
          item.hotelname1 = item.hotelname.split(' ').join('+');
        })
        console.log(resultant, "HII");
        res.render('customer_update', {
          content: resultant,
        })
        return;
      }
    }).
    catch(function () {
      return res.status(400).send("Failed to Excecute Query");
    });
}
);
//update_room
app.post("/update_room", (req, res) => {
  let k;


  let hotelname = req.url.split("=")[1];
  hotelname = hotelname.replace(/\+/g, " ");
  hn = hotelname;
  from = req.body.from;
  till = req.body.till;

  if (req.body.room_type == "Economy") room_type = 0;
  else if (req.body.room_type == "Family") room_type = 1;
  else room_type = 2;

  Paid = req.body.Paid;



  // deleting in hotel
  var fd = new Date(req.body.from);
  var date = fd.getDate();
  var month = fd.getMonth() + 1;
  var year = fd.getFullYear();
  var fstr = date + "/" + month + "/" + year;

  var ld = new Date(req.body.till);
  date = ld.getDate();
  month = ld.getMonth() + 1;
  year = ld.getFullYear();
  var lstr = date + "/" + month + "/" + year;
  console.log(fstr, lstr);
  console.log("WE ARE HERE");
  Hotel.findOne({ 'name': hn }).lean().
    then(function (result) {
      if (result) {
        console.log(k, "YOOO")
        console.log("ENTRY", fstr, "BOI"); let f1 = 1;
        result.Rooms[room_type].arrayofrooms.forEach(function (item) {
          if (f1 == 0) return;
          console.log(item.datesbooked[0], fstr); let f = 1;
          while (1) {
            if (!item.datesbooked.includes(fstr)) {
              f = 0; break;
            }
            if (fstr == lstr) break;
            fd.setDate(fd.getDate() + 1);
            date = fd.getDate();
            month = fd.getMonth() + 1;
            year = fd.getFullYear();
            fstr = date + "/" + month + "/" + year;
          }
          if (f) {
            console.log("NOW");
            fd = new Date(from);
            date = fd.getDate();
            month = fd.getMonth() + 1;
            year = fd.getFullYear();
            fstr = date + "/" + month + "/" + year;
            console.log(fstr, "HERE");
            let flag = 0;
            for (let i = 0; i < item.datesbooked.length; i++) {
              console.log(item.datesbooked[i], fstr);
              if (item.datesbooked[i] == fstr) flag = 1;
              if (flag) {
                console.log("H");
                item.datesbooked.splice(i, 1); i--;
                if (fstr == lstr) break;
                fd.setDate(fd.getDate() + 1);
                date = fd.getDate();
                month = fd.getMonth() + 1;
                year = fd.getFullYear();
                fstr = date + "/" + month + "/" + year;
              }
            }
          }
          if (f) f1 = 0;
        })
        console.log("EXIT");
        //Create Hotel
        var myData1 = new Hotel(result);
        //Remove Hotel
        Hotel.findOneAndRemove({ name: hn }, function (err, docs) {
          if (err) console.log(err)
          else console.log("Removed User : ", docs);
        });
        //Insert Hotel
        myData1.save().then(item => { }).catch(err => {
          return res.status(400).send("Unable to save to database");
        });

      }
    })


  //deleted in customer history
  console.log(req.body);
  User.findOne({ 'username': un }).lean().
    then(function (result) {
      if (result) {
        console.log(result, "HELLO")
        let f = 1;
        result.history.forEach(function (item, index, object) {
          console.log(item.from, from);
          console.log(item.till, till);
          console.log(item.hotelname, hn);
          console.log(item.room_type, room_type);
          console.log(item.Paid, Paid);
          if (item.from == from && item.till == till && hn == item.hotelname &&
            item.room_type == req.body.room_type && item.Paid == Paid && f) {
            console.log("ITSME");
            object.splice(index, 1); f = 0;
          }
        })
        console.log(result, "BYEE");
        //Create User
        var myData1 = new User(result);
        //Remove User
        User.findOneAndRemove({ username: un }, function (err, docs) {
          if (err) console.log(err)
          else console.log("Removed User : ", docs);
        });
        //Insert User
        myData1.save().then(item => { }).catch(err => {
          return res.status(400).send("Unable to save to database");
        });
      }
      // else console.log("HI");
    })
  console.log(un1, k, "CCCCCCCCC")
  //manager history deleted 
  User.findOne({ 'username': un1 }).lean().
    then(function (result) {
      if (result) {
        console.log(result, "HELLO3")
        let f = 1;
        result.history.forEach(function (item, index, object) {
          console.log(item.from, from);
          console.log(item.till, till);
          console.log(item.username, un);
          console.log(item.room_type, room_type);
          console.log(item.Paid, Paid);
          if (item.from == from && item.till == till && un == item.username &&
            item.room_type == req.body.room_type && item.Paid == Paid && f) {
            console.log("ITSME3");
            object.splice(index, 1); f = 0;
          }
        })
        console.log(result, "BYEE3");
        //Create User
        var myData1 = new User(result);
        //Remove User
        User.findOneAndRemove({ username: un1 }, function (err, docs) {
          if (err) console.log(err)
          else console.log("Removed User : ", docs);
        });
        //Insert User
        myData1.save().then(item => { }).catch(err => {
          console.log("WHY");
          return res.status(400).send("Unable to save to database");
        });
      }
      // else console.log("HI");
    })




  Hotel.findOne({ 'name': hotelname }).lean().then(function (result) {
    if (result) {
      // console.log(result);
      res.render('room_book', {
        style: 'room_book.css',
        script: 'script.js',
        title: 'Registration form',
        content: result,
      })
      return;
    }
  })
});


// Manager side Begins

// Get the hotel create form
app.get('/create_hotel', (req, res) =>
  res.render('create_hotel', {

  })
);

// Once clicked submit in hotel creation form/Update form come back to first page of manager
// and store created page details
app.post("/first1", (req, res) => {
  // var myData = new Hotel(req.body);
  var h = {
    username: un,
    name: req.body.name,
    description: req.body.description,
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
        base: req.body.base3,
        Feature: req.body.Features3,
        numofrooms: req.body.num3,
        arrayofrooms: []
      }
    ],
    images: req.body.images,
    Guarantees: req.body.Guarantees,
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
  //First remove if such a record exists and then replace
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
        title: 'Registration form',
        name: un,
      })
    })
    .catch(err => {
      return res.status(400).send("Unable to save to database");
    });
});

// Get the hotel update form
app.get('/update_hotel', (req, res) => {
  Hotel.findOne({ 'username': un }).lean().
    then(function (result) {
      if (result) {
        console.log(result);
        res.render('update_hotel', {
          style: 'room_book.css',
          script: 'script.js',
          title: 'Registration form',
          content: result,
        })
      }
      else {
        res.redirect('/first1');
      }
    }).
    catch(function () {
      return res.status(400).send("Failed to Excecute Query");
    });
});

//History page

app.get('/hotel_history', (req, res) => {
  User.findOne({ 'username': un }).lean().
    then(function (result) {
      if (result) {
        res.render('hotel_history', {
          content: result.history,
        })
      }
    }).
    catch(function () {
      return res.status(400).send("Failed to Excecute Query");
    });
}
);




app.use(express.static(path.join(__dirname, 'public')));

// Members API Routes
app.use('/api/members', require('./routes/api/members'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
