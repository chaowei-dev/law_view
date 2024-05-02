// ./src/components/book/EditBook.js
import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import bookService from "../../services/bookService";

const EditBook = ({
  onHide,
  show,
  book,
  onSave,
  setMessageBox,
  setErrorBox,
}) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState("");

  useEffect(() => {
    if (book) {
      setTitle(book.title);
      setAuthor(book.author);
      setYear(book.year);
    }
  }, [book]);

  const handleSubmit = () => {
    bookService
      .updateBook(book.id, { title, author, year: parseInt(year, 10) })
      .then(() => {
        onHide(); // Close the modal
        onSave(); // Call onSave to refresh the books list in parent component
        setMessageBox("Book updated successfully!!");
      })
      .catch((error) => {
        console.error("Error updating book:", error);
        setErrorBox("Error updating book.");
      });
  };

  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={show}
      onHide={onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {book ? "Edit Book" : "Add New Book"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter book title"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Author</Form.Label>
            <Form.Control
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Enter author's name"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Year</Form.Label>
            <Form.Control
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Enter publication year"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="outline-primary" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditBook;
