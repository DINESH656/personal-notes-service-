const Pagination = ({
    pagination,
    filters,
    setFilters,
}) => {
    if (pagination.totalPages <= 1) return null;
    const changePage = (page) => {
        setFilters((prev) => ({
            ...prev,
            page,
        }));
    };
    return (
        <div className='pagination'>
            <button className="secondary-btn"
                disabled={!pagination.haspreviousPage}
                onClick={() => changePage(filters.page - 1)}
            >
                ← Previous
            </button>
            <span className="page-info">
                Page <strong> {pagination.page} </strong> of{' '}
                <strong> {pagination.totalPages} </strong>
            </span>
            <button
                className="secondary-btn"
                disabled={!pagination.hasNextPage}
                onClick={() => changePage(filters.page + 1)}
            >
                Next →
            </button>
        </div>
    );

};
export default Pagination;