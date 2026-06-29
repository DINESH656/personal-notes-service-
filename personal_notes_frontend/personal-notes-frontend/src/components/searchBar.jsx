const SearchBar = ({
    filters,
    setFilters,
    onSearch,
    onReset,
    loading,
}) => {
    return (
        <div className="search-card">
            <h3>SEARCH NOTES</h3>
            <div className="search-bar">
                <input
                    type='text'
                    placeholder="search by title "
                    value={filters.title}
                    onChange={(e) =>
                        setFilters((prev) => ({
                            ...prev,
                            title: e.target.value,
                        }))
                    }
                />
                <input
                    type='text'
                    placeholder="search by keyword"
                    value={filters.keyword}
                    onChange={(e) =>
                        setFilters((prev) => ({
                            ...prev,
                            keyword: e.target.value,
                        }))
                    }
                />
                <select
                    value={filters.sortBy}
                    onChange={(e) =>
                        setFilters((prev) => ({
                            ...prev,
                            sortBy: e.target.value,
                        }))
                    }
                >
                    <option value='newest'>Newest First</option>
                    <option value='oldest'>Oldest First</option>
                    <option value='title_asc'>Title A-Z</option>
                    <option value='title_desc'>Title Z-A</option>
                </select>
                <select value={filters.limit}
                    onChange={(e) =>
                        setFilters((prev) => ({
                            ...prev,
                            limit: Number(e.target.value),
                        }))
                    }
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </select>
                <button
                    className="primary-btn"
                    onClick={onSearch}
                    disabled={loading}
                > {loading ? 'searching...' : 'Search'}
                </button>
                <button
                    className="secondary-btn"
                    onClick={onReset}
                    disabled={loading}
                >
                    RESET
                </button>

            </div>
        </div>
    );
};
export default SearchBar;