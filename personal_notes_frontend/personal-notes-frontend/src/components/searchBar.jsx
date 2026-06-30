const SearchBar = ({
    filters,
    setFilters,
    onSearch,
    onReset,
    loading,
}) => {
    return (
        <div className="search-card">
            <div className="search-header">
                <div>
                    <h3>🔍 Search Notes</h3>
                    <p>Quickly find notes using title, keywords, sorting and filters.</p>
                </div>
            </div>

            <div className="search-bar">

                <div className="form-group">
                    <label>Title</label>
                    <input
                        type="text"
                        placeholder="Search by title"
                        value={filters.title}
                        onChange={(e) =>
                            setFilters((prev) => ({
                                ...prev,
                                title: e.target.value,
                            }))
                        }
                    />
                </div>

                <div className="form-group">
                    <label>Keyword</label>
                    <input
                        type="text"
                        placeholder="Search by keyword"
                        value={filters.keyword}
                        onChange={(e) =>
                            setFilters((prev) => ({
                                ...prev,
                                keyword: e.target.value,
                            }))
                        }
                    />
                </div>

                <div className="form-group">
                    <label>Sort By</label>

                    <select
                        value={filters.sortBy}
                        onChange={(e) =>
                            setFilters((prev) => ({
                                ...prev,
                                sortBy: e.target.value,
                            }))
                        }
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="title_asc">Title A-Z</option>
                        <option value="title_desc">Title Z-A</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Rows</label>

                    <select
                        value={filters.limit}
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
                </div>
            </div>

            <div className="search-actions">

                <button
                    className="secondary-btn"
                    onClick={onReset}
                    disabled={loading}
                >
                    ↺ Reset
                </button>

                <button
                    className="primary-btn"
                    onClick={onSearch}
                    disabled={loading}
                >
                    {loading ? "Searching..." : "🔍 Search"}
                </button>

            </div>
        </div>
    );
};
export default SearchBar;