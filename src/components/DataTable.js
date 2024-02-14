import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

const DataTable = ({ setSelectedRows, selectedRows, data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    setLoading(true);
    const filtered = data.filter(row => {
        return Object.values(row).some(value =>
        
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
      
    setFilteredData(filtered);
    setLoading(false);
  }, [data, searchTerm]);

  const clearSelected = ()=>{
    setSelectedRows([])
  }

  const handleCheckboxChange = (rowId) => {
    if (selectedRows.includes(rowId)) {
      setSelectedRows(selectedRows.filter((id) => id !== rowId));
    } else {
      setSelectedRows([...selectedRows, rowId]);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDownloadExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'data.xlsx');
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  const sortedData = filteredData.sort((a, b) => {
    if (sortColumn) {
      const columnA = a[sortColumn];
      const columnB = b[sortColumn];
      if (columnA < columnB) return sortOrder === 'asc' ? -1 : 1;
      if (columnA > columnB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    }
    return 0;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  const pageCount = Math.ceil(sortedData.length / itemsPerPage);

  return (
    <div className="DataTableContainer">
      <div className="DataTableHeader">
        <select value={itemsPerPage} onChange={(e) => handleItemsPerPageChange(parseInt(e.target.value))}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <div>
          {selectedRows.length > 0 && <button onClick={clearSelected} className="clearButton">
            Clear
          </button>}
          <button onClick={handleDownloadExcel} className="DownloadButton">
            Download Excel
          </button>
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="SearchInput"
          />
        </div>
      </div>
      <table className="DataTable">
        <thead>
          <tr>
            <th></th>
            <th onClick={() => handleSort('id')}>ID</th>
            <th onClick={() => handleSort('title')}>Title</th>
            <th onClick={() => handleSort('description')}>Description</th>
            <th onClick={() => handleSort('price')}>Price</th>
            <th onClick={() => handleSort('rating')}>Rating</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6">Loading...</td>
            </tr>
          ) : (
            currentItems.map((row) => (
              <tr key={row.id} className="DataRow" >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(row.id)}
                    onChange={() => handleCheckboxChange(row.id)}
                    className="Checkbox"
                  />
                </td>
                <td>{row.id}</td>
                <td>{row.title}</td>
                <td>{row.description}</td>
                <td>${row.price}</td>
                <td>{row.rating}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="PaginationButton"
        >
          Previous
        </button>
        {Array.from({ length: pageCount }).map((_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`PaginationButton ${currentPage === index + 1 ? 'active' : ''}`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === pageCount}
          className="PaginationButton"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DataTable;
