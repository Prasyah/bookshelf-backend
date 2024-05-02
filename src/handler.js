const { nanoid } = require('nanoid');
const books = require('./books');

const saveBookHandler = (request, h) => {

    const { 
        name, 
        year, 
        author, 
        summary, 
        publisher, 
        pageCount, 
        readPage, 
        reading 
    } = request.payload;

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = false;

    const newBook = {
        id,
        name, 
        year, 
        author, 
        summary, 
        publisher, 
        pageCount, 
        readPage,
        finished, 
        reading,
        insertedAt,
        updatedAt
    }

    if( pageCount === readPage ){
        newBook.finished = true;
    } else {
        newBook.finished = false;
    }

    books.push(newBook);

    const isSuccessID = books.filter((book) => book.id === id).length > 0;
    const hasBookName = newBook.name !== undefined;
    const readPageBigger = newBook.readPage <= newBook.pageCount;

    if (isSuccessID) {
        if(hasBookName){
            if(readPageBigger){
                const response = h.response({
                    status: 'success',
                    message: 'Buku berhasil ditambahkan',
                    data: {
                        bookId: id,
                    },
                });
                response.code(201);
                return response;
            }
            
            const response = h.response({
                status: 'fail',
                message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
            });
            response.code(400);
            return response;
        }

        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal untuk ditambahkan',
    });
    response.code(500);
    return response;

};

getAllBooksHandler = (request, h) => {
    const simplifiedBooks = books.slice(0, 1).map(book => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher
    }));

    const response = h.response({
        status: 'success',
        data: {
            books: simplifiedBooks
        }
    });
    response.code(200);
    return response;
};

const getBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const book = books.filter((n) => n.id === id)[0];

    if(book !== undefined) {
        return {
            status: 'success',
            data: {
                book,
            },
        };
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};

const editBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const { 
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;
    const updatedAt = new Date().toISOString();

    const index = books.findIndex((book) => book.id === id);
    const hasBookName = books[index].name !== undefined;
    const readPageBigger = books[index].readPage < books[index].pageCount;

    if( pageCount === readPage ){
        books[index].finished = true;
    } else {
        books[index].finished = false;
    }

    if (index !== -1) {
        if( hasBookName){
            if(readPageBigger){
                books[index] = {
                    ...books[index],
                    name,
                    year,
                    author,
                    summary,
                    publisher,
                    pageCount,
                    readPage,
                    reading,
                };

                const response = h.response({
                    status: 'success',
                    message: 'Buku berhasil diperbarui',
                });
                response.code(200);
                return response;
            } else {

                const response = h.response({
                    status: 'fail',
                    message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
                });
                response.code(400); // Ubah status code menjadi 400
                return response;
            }
        } else {

            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. Mohon isi nama buku',
            });
            response.code(400);
            return response;
        }
    } else {

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku, ID tidak ditemukan',
    });
    response.code(404);
    return response;
    }
};

const deleteBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus'
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

module.exports = {
    saveBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler
};
