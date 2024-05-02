// ./src/components/book/Books.js
import React, { useState, useEffect } from "react";
import bookService from "../../services/bookService";
import authService from "../../services/authService";
import EditBook from "./EditBook";
import { Dropdown, Modal, Button } from "react-bootstrap";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [editingShow, setEditingShow] = useState(false);
  const [currentBook, setCurrentBook] = useState(null); // To track which book is being edited
  const [deletingConfirmShow, setDeletingConfirmShow] = useState(false);
  const [messageBox, setMessageBox] = useState("");
  const [errorBox, setErrorBox] = useState("");

  const userRole = authService.getUserRole();

  // Fetch books on component mount
  useEffect(() => {
    fetchBooks();
  }, []);

  // Clear message after 3 seconds
  useEffect(() => {
    let messageTimer, errorTimer;

    // Clear messageBox after 3 seconds if it's not empty
    if (messageBox !== "") {
      messageTimer = setTimeout(() => {
        setMessageBox("");
      }, 3000);
    }

    // Clear errorBox after 3 seconds if it's not empty
    if (errorBox !== "") {
      errorTimer = setTimeout(() => {
        setErrorBox("");
      }, 3000);
    }

    // Cleanup function to clear timers when the component unmounts or the variables change
    return () => {
      clearTimeout(messageTimer);
      clearTimeout(errorTimer);
    };
  }, [messageBox, errorBox]); // Depend on both messageBox and errorBox

  // FETCHING
  const fetchBooks = () => {
    bookService
      .getAllBooks()
      .then((response) => {
        setBooks(response.data);
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
      });
  };

  // DELETION
  const handleDeleteClick = (book) => {
    setCurrentBook(book);
    setDeletingConfirmShow(true);
  };
  const handleCancelDelete = () => {
    setDeletingConfirmShow(false);
  };
  const handleConfirmDelete = () => {
    if (currentBook) {
      bookService
        .deleteBook(currentBook.id)
        .then(() => {
          setBooks(books.filter((book) => book.id !== currentBook.id));
          setDeletingConfirmShow(false);
          setCurrentBook(null);
          setMessageBox(`"${currentBook.title}" deleted successfully.`);
        })
        .catch((error) => {
          console.error("Error deleting book:", error);
          setErrorBox(`Error deleting "${currentBook.title}".`);
        });
    }
  };

  // EDITING
  const handleEditClick = (book) => {
    setCurrentBook(book);
    setEditingShow(true);
  };

  return (
    <div className="container mt-3">
      <h2>Books List</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Year</th>
            {userRole === "super-user" && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.year}</td>
              {userRole === "super-user" && (
                <td>
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="secondary"
                      size="sm"
                      id="dropdown-basic"
                    >
                      Actions
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => handleEditClick(book)}>
                        Edit
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleDeleteClick(book)}>
                        Delete
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {/* Editing Window */}
      {editingShow && currentBook && (
        <EditBook
          show={editingShow}
          onHide={() => setEditingShow(false)}
          book={currentBook}
          onSave={fetchBooks} // Passing fetchBooks as onSave to refresh the list
          setMessageBox={setMessageBox}
          setErrorBox={setErrorBox}
        />
      )}
      {/* Deleting Window */}
      {deletingConfirmShow && currentBook && (
        <Modal show={deletingConfirmShow} onHide={handleCancelDelete} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>{`Delete "${currentBook.title}"?`}</Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={handleCancelDelete}>
              Cancel
            </Button>
            <Button variant="outline-danger" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {/* Message Box */}
      {messageBox && (
        <div className="alert alert-success" role="alert">
          {messageBox}
        </div>
      )}
      {/* Error Box */}
      {errorBox && (
        <div className="alert alert-danger" role="alert">
          {errorBox}
        </div>
      )}
    </div>
  );
};

export default Books;
