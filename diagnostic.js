console.log("=== DIAGNOSTIC LAPZO CREDENTIALS ===");
console.log("Expected username:", "'lapzodemo'");
console.log("Expected password:", "'lapzo12345'");

// Test direct comparison
const testUser = "lapzodemo";
const testPass = "lapzo12345";

console.log("Test username:", testUser);
console.log("Test password:", testPass);

const VALID_CREDENTIALS = {
    username: 'lapzodemo',
    password: 'lapzo12345'
};

console.log("Stored username:", VALID_CREDENTIALS.username);
console.log("Stored password:", VALID_CREDENTIALS.password);

console.log("Username match:", testUser === VALID_CREDENTIALS.username);
console.log("Password match:", testPass === VALID_CREDENTIALS.password);
console.log("Both match:", testUser === VALID_CREDENTIALS.username && testPass === VALID_CREDENTIALS.password);

// Check for hidden characters
console.log("Username length:", VALID_CREDENTIALS.username.length);
console.log("Password length:", VALID_CREDENTIALS.password.length);
console.log("Username charCodes:", Array.from(VALID_CREDENTIALS.username).map(c => c.charCodeAt(0)));
console.log("Password charCodes:", Array.from(VALID_CREDENTIALS.password).map(c => c.charCodeAt(0)));
