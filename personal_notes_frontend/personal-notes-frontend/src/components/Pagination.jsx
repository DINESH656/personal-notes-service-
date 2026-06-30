import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Pagination = ({ pagination, filters, setFilters }) => {
  if (pagination.totalPages <= 1) return null;

  const changePage = (page) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  return (
    <div className="pagination">
      <button
        className="secondary-btn"
        disabled={!pagination.hasPreviousPage}
        onClick={() => changePage(filters.page - 1)}
      >
        <FiChevronLeft />
        Previous
      </button>

      <span className="page-info">
        Page <strong>{pagination.page}</strong> of{" "}
        <strong>{pagination.totalPages}</strong>
      </span>

      <button
        className="secondary-btn"
        disabled={!pagination.hasNextPage}
        onClick={() => changePage(filters.page + 1)}
      >
        Next
        <FiChevronRight />
      </button>
    </div>
  );
};

export default Pagination;
