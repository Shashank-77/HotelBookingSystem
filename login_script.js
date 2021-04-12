const account1 = {
    id: 'cust1',
    owner: 'Jonas Schmedtmann',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    password: 1111,
};

const account2 = {
    id: 'cust2',
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    password: 2222,
};

const account3 = {
    id: 'cust3',
    owner: 'Steven Thomas Williams',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    password: 3333,
};

const account4 = {
    id : 'cust4', 
    owner: 'Sarah Smith',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    password: 4444,
};

const account_test = {
    id : 'cust5', 
    owner: 'A D M I N',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    password: 'admin',
};
  
const accounts = [account1, account2, account3, account4, account_test];

const createUsernames = function (accs) {
    accs.forEach(function (acc) {
      acc.username = acc.owner
        .toLowerCase()
        .split(' ')
        .map(name => name[0])
        .join('');
    });
  };
  createUsernames(accounts);

inputLoginUsername = document.getElementById("username");
inputLoginPassword = document.getElementById("password");
console.log(inputLoginUsername.value)
console.log(inputLoginPassword.value)

let currentAccount;
function myValidate() {
    currentAccount = accounts.find(
        acc => acc.username === inputLoginUsername.value
    );
    if (currentAccount?.password === inputLoginPassword.value) {
        // Display UI and message
        var id = currentAccount?.id;
        // Clear input fields
        inputLoginUsername.value = inputLoginPassword.value = '';
        inputLoginPassword.blur();
        // Update UI
        //window.open("main.html?id="+id);
        location.href = "main.html?id="+id;
    }
    else{
        inputLoginUsername.value="";
        inputLoginPassword.value="";
        alert("Login Failed, enter the correct details");
        inputLoginUsername.focus();
    }
    
}

function createPage(){
    window.open("create.html")
    //location.href="create.html";
}