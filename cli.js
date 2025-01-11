const axios = require('axios');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const api = axios.create({
    baseURL: 'http://localhost:3000/api'
});

const authApi = axios.create({
    baseURL: 'http://localhost:3000/auth'
});

let token = '';

const login = () => {
    rl.question('Username: ', (username) => {
        rl.question('Password: ', (password) => {
            authApi.post('/login', { username, password })
                .then(response => {
                    token = response.data.token;
                    api.defaults.headers.common['x-access-token'] = token;
                    console.log('Logged in successfully');
                    menu();
                })
                .catch(error => {
                    console.error('Login failed:', error.message);
                    login();
                });
        });
    });
};

const menu = () => {
    console.log('\n1. List books\n2. Add book\n3. Update book\n4. Delete book\n5. Exit');
    rl.question('Choose an option: ', (option) => {
        switch (option) {
            case '1':
                listBooks();
                break;
            case '2':
                addBook();
                break;
            case '3':
                updateBook();
                break;
            case '4':
                deleteBook();
                break;
            case '5':
                rl.close();
                break;
            default:
                console.log('Invalid option');
                menu();
                break;
        }
    });
};

const listBooks = () => {
    api.get('/books')
        .then(response => {
            console.log(response.data);
            menu();
        })
        .catch(error => {
            console.error('Failed to fetch books:', error.message);
            menu();
        });
};

const addBook = () => {
    rl.question('Title: ', (title) => {
        rl.question('Author: ', (author) => {
            rl.question('Year: ', (year) => {
                rl.question('Status: ', (status) => {
                    api.post('/books', { title, author, year, status })
                        .then(() => {
                            console.log('Book added successfully');
                            menu();
                        })
                        .catch(error => {
                            console.error('Failed to add book:', error.message);
                            menu();
                        });
                });
            });
        });
    });
};

const updateBook = () => {
    rl.question('Book ID: ', (id) => {
        rl.question('Title: ', (title) => {
            rl.question('Author: ', (author) => {
                rl.question('Year: ', (year) => {
                    rl.question('Status: ', (status) => {
                        api.put(`/books/${id}`, { title, author, year, status })
                            .then(() => {
                                console.log('Book updated successfully');
                                menu();
                            })
                            .catch(error => {
                                console.error('Failed to update book:', error.message);
                                menu();
                            });
                    });
                });
            });
        });
    });
};

const deleteBook = () => {
    rl.question('Book ID: ', (id) => {
        api.delete(`/books/${id}`)
            .then(() => {
                console.log('Book deleted successfully');
                menu();
            })
            .catch(error => {
                console.error('Failed to delete book:', error.message);
                menu();
            });
    });
};

login();
