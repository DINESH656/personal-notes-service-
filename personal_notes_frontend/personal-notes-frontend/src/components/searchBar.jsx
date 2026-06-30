import { FiRefreshCcw, FiSearch, FiSliders } from "react-icons/fi";

const SearchBar = ({
  filters,
  setFilters,
  onSearch,
  onReset,
  loading,
  tags = [],
}) => {
  return (
    <div className="search-card">
      <div className="search-header">
        <div>
          <h3>
            <FiSliders />
            Search and Filters
          </h3>
          <p>Find notes by title, keyword, category, tag, and sort order.</p>
        </div>
      </div>

      <div className="search-bar">
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            placeholder="Search by title"
            value={filters.title}
            onChange={(event) =>
              setFilters((prev) => ({
                ...prev,
                title: event.target.value,
              }))
            }
          />
        </div>

        <div className="form-group">
          <label>Keyword</label>
          <input
            type="text"
            placeholder="Search note content"
            value={filters.keyword}
            onChange={(event) =>
              setFilters((prev) => ({
                ...prev,
                keyword: event.target.value,
              }))
            }
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <input
            type="text"
            placeholder="Filter category"
            value={filters.category}
            onChange={(event) =>
              setFilters((prev) => ({
                ...prev,
                category: event.target.value,
              }))
            }
          />
        </div>

        <div className="form-group">
          <label>Tag</label>
          <select
            value={filters.tag}
            onChange={(event) =>
              setFilters((prev) => ({
                ...prev,
                tag: event.target.value,
              }))
            }
          >
            <option value="">All tags</option>
            {tags.map((tag) => (
              <option key={tag.tag_id} value={tag.tag_id}>
                {tag.tag_name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Sort By</label>
          <select
            value={filters.sortBy}
            onChange={(event) =>
              setFilters((prev) => ({
                ...prev,
                sortBy: event.target.value,
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
            onChange={(event) =>
              setFilters((prev) => ({
                ...prev,
                limit: Number(event.target.value),
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
        <button className="secondary-btn" onClick={onReset} disabled={loading}>
          <FiRefreshCcw />
          Reset
        </button>

        <button className="primary-btn" onClick={onSearch} disabled={loading}>
          <FiSearch />
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
