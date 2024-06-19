# Book Journal

Book Journal is a web application that allows users to keep track of books they have read, write reviews, and rate the books. Users can register, log in, add books, edit book details, and delete books.

Login Page
![image](https://github.com/deepanshu2001/book-journal/assets/44342782/539d59b7-403f-44e2-964f-a0ac182452d8)
Registration Page
![image](https://github.com/deepanshu2001/book-journal/assets/44342782/49080f15-8db6-479f-9492-0e37dab11aae)
User Page
![image](https://github.com/deepanshu2001/book-journal/assets/44342782/4f13acbf-b22e-4985-9b94-4cb7617268b6)

Add Book Page
![image](https://github.com/deepanshu2001/book-journal/assets/44342782/99909a4b-ceb7-4c1d-a9da-2aba4901fd29)

## Features

- User registration and login and logout
- Add, edit, and delete books
- Write reviews and rate books
- Search and sort books by title, author, or rating
- User-specific book journal

## Technologies Used

- Node.js
- Express.js
- PostgreSQL
- EJS (Embedded JavaScript Templates)
- Bootstrap
- bcrypt (for password hashing)
- express-session (for session management)

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- PostgreSQL

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/book-journal.git
cd book-journal
Install the dependencies:
bash
Copy code
npm install
Set up PostgreSQL:
Create a database named book:
sql
Copy code
CREATE DATABASE book;
Create the required tables:
sql
Copy code
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    isbn_id BIGINT NOT NULL,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    review TEXT,
    rating INTEGER,
    image TEXT,
    email VARCHAR(100) REFERENCES users(email)
);

CREATE TABLE IF NOT EXISTS user_books (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) REFERENCES users(email) ON DELETE CASCADE,
    book_id BIGINT REFERENCES books(isbn_id) ON DELETE CASCADE
);
Configure the database connection in your code. Update the db configuration in index.js:
javascript
Copy code
const db = new pg.Client({
    user: 'postgres',
    host: 'localhost',
    database: 'book',
    password: 'your_password',
    port: 5432
});
db.connect();
Run the application:
bash
Copy code
node index.js
Open your browser and go to http://localhost:3000.
Usage
Register a new user account.
Log in with your account.
Add books by clicking the "Add Book" button.
Edit or delete existing books.
Search for books and sort the list by title, author, or rating.
