$(function () {
    // Nieoptymalnie - odpytywane wiele razy
    function getBooks() {
        $.ajax({
            url: 'http://127.0.0.1:8000/book/',
            method: 'GET'
        }).done(function (response) {
            setBooks(response);
        });
    }

    getBooks();
    $(document).on('click', '.book-title', function (e) {
        $(e.target).next().next().next().toggle();
    });
    $(document).on('click', '.rmv-btn', function (e) {
        var bookId = $(event.target).prev().data('id');
        removeBook(bookId);
    });
    $(document).on('click', '.edit-btn', function (e) {
        $('.add-btn').text('Edytuj');
        var inputs = $('form input');
        var bookTitle = $(event.target).prev().prev().text();
        $(inputs).eq(0).val(bookTitle);
        var bookAuthor = $(event.target).next().children().eq(3).text().split(':')[1];
        $(inputs).eq(1).val(bookAuthor);
        var bookIsbn = $(event.target).next().children().eq(2).text().split(':')[1];
        $(inputs).eq(2).val(bookIsbn);
        var bookPublisher = $(event.target).next().children().eq(1).text().split(':')[1];
        $(inputs).eq(3).val(bookPublisher);
        var bookGenre = $(event.target).next().children().eq(0).text().split(':')[1];
        $(inputs).eq(4).val(bookGenre);
    });

    function removeBook(id) {
        $.ajax({
            url: `http://127.0.0.1:8000/book/${id}`,
            method: 'DELETE'
        }).done(function (response) {
            getBooks();
        })
    }

    function setBooks(response) {
        $('.books-list').empty();

        var j = 0;
        for (var i = response.length - 1; i >= 0; i--) {

            // Mozna zmienic na prepend wtedy najnowsze ksiazki listowane od gory
            $('.books-list').append(`<li>
        <span class="book-title" data-id='${response[i].id}'>${response[i].title}</span>
        <button class="rmv-btn uk-button uk-button-danger uk-button-small">Usuń</button>
        <button class="edit-btn uk-button uk-button-primary uk-button-small">Edytuj</button>
        <div class="details"></div>
      </li>`);
            var bookDetails = {
                author: response[i].author,
                isbn: response[i].isbn,
                publisher: response[i].publisher,
                genre: response[i].genre
            };
            for (var property in bookDetails) {
                $('.books-list .details').eq(j).append(`<p>${property.toUpperCase()}: ${bookDetails[property]}`);
            }
            j++;
        }
    }

    $('.add-btn').on('click', function (e) {
        e.preventDefault();
        var inputs = $('form input');
        var newBook = {
            "author": $(inputs).eq(1).val(),
            "title": $(inputs).eq(0).val(),
            "isbn": $(inputs).eq(2).val(),
            "publisher": $(inputs).eq(3).val(),
            "genre": $(inputs).eq(4).val()
        };
        if ($(event.target).text() === 'Dodaj') {
            addBook(newBook);
        } else {
            // editBook(id, newBook); // editBook trzeba utworzyc taka funkcje i dodac pobieranie edytowanego id
        }

    });

    // Axios - alternatywnie dla czystego JS-a
    function addBook(newBook) {
        $.ajax({
            url: 'http://127.0.0.1:8000/book/',
            method: 'POST',
            data: newBook,
            dataType: 'json'
        }).done(function (response) {
            getBooks();
            clearInputs();
        })
    }

    function clearInputs() {
        $('form input').val("");
    }
})