// generateBooksCSV.js
import fs from 'node:fs';
import { faker } from '@faker-js/faker';

const NUM_BOOKS = 10000; // Number of books
const fileName = 'books_large.csv';

// CSV header
const header = 'Title,Author,Genre,PublishedYear,ISBN\n';

// Helper to escape quotes in CSV
const escapeCSV = (value) => `"${value.replace(/"/g, '""')}"`;

const genres = [
  'Fiction',
  'Non-Fiction',
  'Mystery',
  'Science Fiction',
  'Fantasy',
  'Romance',
  'Thriller',
  'Biography',
  'History',
  'Children',
];

let csvContent = header;

for (let i = 0; i < NUM_BOOKS; i++) {
  const title = escapeCSV(faker.lorem.words({ min: 2, max: 5 }));
  const author = escapeCSV(`${faker.person.firstName()} ${faker.person.lastName()}`);
  const genre = genres[faker.number.int({ min: 0, max: genres.length - 1 })];
  const year = faker.number.int({ min: 1950, max: 2025 });
  const isbn = faker.string.uuid();

  csvContent += `${title},${author},${genre},${year},${isbn}\n`;
}

// Write to file
fs.writeFileSync(fileName, csvContent);

console.log(`Generated ${NUM_BOOKS} books in ${fileName}`);
