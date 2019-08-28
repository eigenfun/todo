var passwordHash = require('password-hash')
var hashedPassword = passwordHash.generate('todo');
console.log(hashedPassword);
