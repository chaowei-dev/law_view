import React, { useState, useEffect } from "react";
import bookService from "../../services/bookService";

const CreateBook = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState("");
  const [messageBox, setMessageBox] = useState("");
  const [errorBox, setErrorBox] = useState("");

  // Clear message after 5 seconds
  useEffect(() => {
    let timer;
    if (messageBox !== "") {
      timer = setTimeout(() => {
        setMessageBox("");
      }, 3000);
    }
    return () => clearTimeout(timer); // Clear the timer when the component unmounts or message changes
  }, [messageBox]);

  const handleCreateBook = async (event) => {
    event.preventDefault();
    const bookData = { title, author, year: parseInt(year) };

    try {
      const response = await bookService.addBook(bookData);
      setMessageBox("Book created successfully!");
      console.log(response.data);
    } catch (error) {
      setErrorBox("Failed to create book.");
      console.error(error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8">
          <h2 className="text-center mb-4">Create a New Book</h2>
          <form onSubmit={handleCreateBook}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input
                type="text"
                id="title"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="author" className="form-label">
                Author
              </label>
              <input
                type="text"
                id="author"
                className="form-control"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="year" className="form-label">
                Year
              </label>
              <input
                type="text"
                id="year"
                className="form-control"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary center">
              Create Book
            </button>
          </form>
          {/* Msg Box */}
          {messageBox && (
            <div className="alert alert-success mt-3">{messageBox}</div>
          )}
          {/* Error Box */}
          {errorBox && (
            <div className="alert alert-danger mt-3">{errorBox}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateBook;
