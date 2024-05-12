import React from "react";
import { Form, Pagination } from "react-bootstrap";

const CasePagination = ({
  totalPages,
  pageNum,
  pageSize,
  caseKeyword,
  navigate,
}) => {
  // Convert pageNum and pageSize from string to number for proper comparisons
  const currentPage = Number(pageNum);
  const itemsPerPage = Number(pageSize);

  const handlePageChange = (newPage) => {
    // Navigate using React Router with correct types and values
    navigate(`/cases/list/${itemsPerPage}/${newPage}/${caseKeyword}`);
  };

  // const renderPaginationItems = () => {
  //   const items = [];
  //   // Calculate pages for display
  //   const startPage = Math.max(1, currentPage - 2);
  //   const endPage = Math.min(totalPages, currentPage + 2);

  //   // Case 1: If there are less than 5 pages
  //   if (startPage > 1) {
  //     items.push(
  //       <Pagination.Item key={1} onClick={() => handlePageChange(1)}>
  //         1
  //       </Pagination.Item>
  //     );
  //     if (startPage > 2) {
  //       items.push(<Pagination.Ellipsis key="ellipsis-start" />);
  //     }
  //   }

  //   // Generate pagination buttons for the current range
  //   for (let i = startPage; i <= endPage; i++) {
  //     items.push(
  //       <Pagination.Item
  //         key={i}
  //         active={i === currentPage}
  //         onClick={() => handlePageChange(i)}
  //       >
  //         {i}
  //       </Pagination.Item>
  //     );
  //   }

  //   // Case 2: If there are more than 5 pages
  //   if (endPage < totalPages) {
  //     if (endPage < totalPages - 1) {
  //       items.push(<Pagination.Ellipsis key="ellipsis-end" />);
  //     }
  //     items.push(
  //       <Pagination.Item
  //         key={totalPages}
  //         onClick={() => handlePageChange(totalPages)}
  //       >
  //         {totalPages}
  //       </Pagination.Item>
  //     );
  //   }

  //   return items;
  // };

  const handlePageInput = (e) => {
    const newPage = e.target.value;
    if (
      newPage === "" ||
      (!isNaN(newPage) && newPage > 0 && newPage <= totalPages)
    ) {
      handlePageChange(Number(newPage) || 1);
    }
  };

  return (
    <Pagination className="justify-content-center align-items-center">
      <Pagination.First
        disabled={currentPage === 1}
        onClick={() => handlePageChange(1)}
      />
      <Pagination.Prev
        disabled={currentPage === 1}
        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
      />

      {/* Flex container for input and total pages */}
      <div className="d-flex align-items-center ml-1 mr-1">
        <Form.Control
          type="number"
          min="1"
          max={totalPages}
          value={currentPage}
          onChange={(e) => handlePageChange(Number(e.target.value))}
          className="text-center"
          style={{ width: "60px" }}
        />
        <span className="mx-1">/ {totalPages}</span>
      </div>

      <Pagination.Next
        disabled={currentPage === totalPages}
        onClick={() =>
          currentPage < totalPages && handlePageChange(currentPage + 1)
        }
      />
      <Pagination.Last
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(totalPages)}
      />
    </Pagination>
  );
};

export default CasePagination;
