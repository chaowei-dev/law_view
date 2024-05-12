import React, { useState, useEffect } from "react";
import keywordService from "../../services/keywordService";
import { Container, Modal, Form, Button, Dropdown } from "react-bootstrap";

const KeywordView = () => {
  const [keywordList, setKeywordList] = useState([]);
  const [editingShow, setEditingShow] = useState(false);
  const [currentKeyword, setCurrentKeyword] = useState(null); // To track which keyword is being edited
  // const [deletingConfirmShow, setDeletingConfirmShow] = useState(false);
  const [errorBox, setErrorBox] = useState("");
  const [messageBox, setMessageBox] = useState("");
  const [newKeyword, setNewKeyword] = useState("");
  const [createShow, setCreateShow] = useState(false);

  // Fetch keywords on component mount
  useEffect(() => {
    fetchKeywords();
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
  const fetchKeywords = () => {
    keywordService
      .getKeywords()
      .then((response) => {
        setKeywordList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching keywords:", error);
      });
  };

  // Delete keyword
  const deleteKeyword = (id) => {
    keywordService
      .deleteKeyword(id)
      .then((response) => {
        setMessageBox(response.data.message);
        fetchKeywords();
      })
      .catch((error) => {
        setErrorBox(error.response.data.error);
      });
  };

  // Edit keyword
  const handleEditSubmit = () => {
    keywordService
      .updateKeyword(currentKeyword.id, { keyword: currentKeyword.keyword })
      .then(() => {
        setEditingShow(false);
        fetchKeywords();
        setMessageBox("Keyword updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating keyword:", error);
        setErrorBox("Failed to update keyword.");
      });
  };

  // Create keyword
  const handleCreateSubmit = () => {
    keywordService
      .createKeyword({ keyword: newKeyword })
      .then(() => {
        setCreateShow(false);
        fetchKeywords();
        setMessageBox("Keyword created successfully!");
      })
      .catch((error) => {
        console.error("Error creating keyword:", error);
        setErrorBox("Failed to create keyword.");
      });
  };

  return (
    <Container className="mt-3">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Keywords</h2>
        <Button onClick={() => setCreateShow(true)}>Create Keyword</Button>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Keyword</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {keywordList.map((keyword) => (
            <tr key={keyword._id}>
              <td>{keyword.keyword}</td>
              <td>
                {/* <button
                  className="btn btn-primary"
                  onClick={() => {
                    setEditingShow(true);
                    setCurrentKeyword(keyword);
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    deleteKeyword(keyword.id);
                  }}
                >
                  Delete
                </button> */}
                <Dropdown>
                  <Dropdown.Toggle
                    variant="secondary"
                    size="sm"
                    id="dropdown-basic"
                  >
                    Actions
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() => {
                        setEditingShow(true);
                        setCurrentKeyword(keyword);
                      }}
                    >
                      Edit Keyword
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => {
                        deleteKeyword(keyword.id);
                      }}
                    >
                      Delete Keyword
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Edit Modal */}
      {editingShow && currentKeyword && (
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={editingShow}
          onHide={() => setEditingShow(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Edit Keyword
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Keyword</Form.Label>
                <Form.Control
                  type="text"
                  value={currentKeyword.keyword}
                  onChange={(e) =>
                    setCurrentKeyword({
                      ...currentKeyword,
                      keyword: e.target.value,
                    })
                  }
                  placeholder="Enter keyword"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setEditingShow(false)}>
              Close
            </Button>
            <Button onClick={handleEditSubmit}>Save</Button>
          </Modal.Footer>
        </Modal>
      )}
      {/* Create Modal */}
      {createShow && (
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={createShow}
          onHide={() => setCreateShow(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Create Keyword
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Keyword</Form.Label>
                <Form.Control
                  type="text"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  placeholder="Enter keyword"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setCreateShow(false)}>
              Close
            </Button>
            <Button onClick={handleCreateSubmit}>Create</Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default KeywordView;
