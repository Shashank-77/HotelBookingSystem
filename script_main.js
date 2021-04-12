const account1 = {
    id: 'cust1',
    owner: 'Jonas Schmedtmann',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    pin: 1111,
  };
  
  const account2 = {
    id: 'cust2',
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
  };
  
  const account3 = {
    id: 'cust3',
    owner: 'Steven Thomas Williams',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
  };
  
  const account4 = {
    id : 'cust4', 
    owner: 'Sarah Smith',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
  };
  
  const account_test = {
    id : 'cust5', 
    owner: 'A D M I N',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 'admin',
  };
  
  const accounts = [account1, account2, account3, account4, account_test];

var id = location.href.split("=")[1];
console.log(id);

welcomeArea = document.getElementById("welcome");
detailsTable = document.getElementById("details");
pointsValue = document.getElementById("points-value");
bookingHistory = document.getElementById("booking-histpry");
makeBooking = document.getElementById("make-booking");
updateProfile = document.getElementById("update-profile");
logoutButton = document.getElementById("logout");


var currentAccount;
currentAccount = accounts.find(
    acc => acc.id === id
);
welcomeArea.innerHTML = "Welcome " + currentAccount.owner;

function LogOut(){
    welcomeArea.innerHTML = "Logged out successfully";
    detailsTable.innerHTML = "";
    logoutButton.style.display = "none";
    time = 5;
    var x = setInterval(function() {
        detailsTable.innerHTML = "Redirecting to login page in : " + time + " s ";
        time -= 1;
        if(time < 0){
            clearInterval(x);
            location.href="index.html";
        }
    }, 1000);
}
