import React from "react";

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) pages.push(i);

  return (
    <div className="pagination">
      <button className="page-btn" onClick={() => onPageChange(Math.max(1, currentPage - 1))}>
        Prev
      </button>

      {pages.map((p) => (
        <button
          key={p}
          className="page-btn"
          style={{ fontWeight: p === currentPage ? "700" : "400" }}
          onClick={() => onPageChange(p)}
        >
          {p}
        </button>
      ))}

      <button className="page-btn" onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}>
        Next
      </button>
    </div>
  );
}

export default Pagination;
