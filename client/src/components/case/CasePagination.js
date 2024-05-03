import React from "react";
import { Pagination } from "react-bootstrap";

const CasePagination = ({
  totalPages,
  currentPage,
  setCurrentPage,
}) => {
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Function to generate pagination items
  // Case 1: 1 2 3 4 5 ... 20
  // Case 2: 1 ... 10 11 12 13 14 ... 20
  // Case 3: 1 ... 16 17 18 19 20
  const renderPaginationItems = () => {
    const items = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
      items.push(
        <Pagination.Item key={1} onClick={() => handlePageChange(1)}>
          {1}
        </Pagination.Item>
      );

      if (startPage > 2) {
        items.push(<Pagination.Ellipsis key="ellipsis-start" />);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<Pagination.Ellipsis key="ellipsis-end" />);
      }

      items.push(
        <Pagination.Item
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }

    return items;
  };

  return (
    <>
      <Pagination>
        {/* <Pagination.First disabled={currentPage === 1} onClick={() => handlePageChange(1)} /> */}
        <Pagination.Prev
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        />
        {renderPaginationItems()}
        <Pagination.Next
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        />
        {/* <Pagination.Last disabled={currentPage === totalPages} onClick={() => handlePageChange(totalPages)} /> */}
      </Pagination>
    </>
  );
};

export default CasePagination;
