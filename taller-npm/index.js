// Importamos la biblioteca Faker
const { faker } = require('@faker-js/faker'); 
console.log(faker.person.fullName());
console.log(faker.internet.email());
console.log(faker.location.streetAddress());