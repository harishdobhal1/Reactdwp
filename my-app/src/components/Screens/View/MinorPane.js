import React, { Component } from 'react';
import generateItems from '../../data/Item';
import './MinorPane.css';
import MajorPane from './MajorPane';
import 'react-toggle/style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBars, faHandPointer } from '@fortawesome/free-solid-svg-icons';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';

class MinorPane extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchQuery: '',
            filteredItems: generateItems,
            itemCount: 0,
            elapsedTime: 0,
            filters: {
                Latest: true,
                Active: true,
                Historical: true,
                Future: true,
                IncludeGreenLines: true,
                IncludeGreyLines: true,
                IncludeLastPackagingDate: true,
                IncludeRange: true
            },
            isTableVisible: false,
            showFilters: true,
            isSearchSelected: false,
            isClearSelected: false,
            isMenuOpen: false,
            menuOptions: ['Option 1', 'Option 2', 'Option 3'],
            supplierName: '',
            itemName: '',
            isSearchIconClicked: false,
            isSearchIconHovered: false,
            isElementsVisible: true,
            currentPage: 1,
            pageSize: 5, // Number of items per page
            rowsPerPage: 5 // Number of rows per page
        };
    }

   

    handleSearchChange = (event) => {
        const searchQuery = event.target.value;
        this.setState({ searchQuery });
    }

    handleFilterToggle = (filter) => {
        this.setState(prevState => ({
            filters: {
                ...prevState.filters,
                [filter]: !prevState.filters[filter]
            }
        }));
    }

    handleSearch = () => {
        const { searchQuery } = this.state;
        const startTime = performance.now();

        const filteredItems = generateItems.filter(item => {
            if (!searchQuery) return true;
            return Object.keys(this.state.filters).every(filter => {
                if (!this.state.filters[filter]) return true;
                const fieldValue = item[filter];
                if (fieldValue !== undefined && fieldValue !== null) {
                    return fieldValue.toString().toLowerCase().includes(searchQuery.toLowerCase());
                }
                return false;
            });
        });

        const endTime = performance.now();
        const elapsedTime = Math.round(endTime - startTime);

        this.setState({
            filteredItems,
            searchQuery,
            elapsedTime,
            isTableVisible: true,
            showFilters: false,
            isSearchSelected: true,
            isClearSelected: false,
            itemCount: filteredItems.length,
            currentPage: 1 // Reset to first page after search
        });
    }

    handleClear = () => {
        this.setState({
            searchQuery: '',
            filteredItems: generateItems,
            isTableVisible: false,
            showFilters: true,
            isSearchSelected: false,
            isClearSelected: true,
            itemCount: 0,
            currentPage: 1 // Reset to first page after clearing search
        });
        this.props.onClearMajorItem();
    }

    toggleMenu = () => {
        this.setState(prevState => ({
            isMenuOpen: !prevState.isMenuOpen
        }));
    }

    handlePageChange = (page) => {
        this.setState({ currentPage: page });
    }

    handleRowsPerPageChange = (event) => {
        this.setState({ rowsPerPage: parseInt(event.target.value), currentPage: 1 });
    }

  
    
    render() {
        const { searchQuery, filteredItems, itemCount, elapsedTime, filters, isTableVisible,
             isSearchSelected, isClearSelected, isMenuOpen, menuOptions, supplierName,
            itemName, isSearchIconClicked, isSearchIconHovered, isElementsVisible, currentPage, rowsPerPage } = this.state;

            console.log(rowsPerPage);

        // Calculate pagination
        const totalPages = Math.ceil(filteredItems.length / rowsPerPage);
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = Math.min(startIndex + rowsPerPage, filteredItems.length);
        const itemsToShow = filteredItems.slice(startIndex, endIndex);
       
        

        return (
            
            <div className="minor-pane-container-view">     
                

                <div className="minor-pane" style={{ overflowY: 'auto', maxHeight: '1000px', width: '85%', display: 'flex', flexDirection: 'column' }}>
                
                    {/* Search Bar */}
                    <div className="search-bar" style={{ flexShrink: 0 }}>
                        {/* Toggle Button */}
                        {/* <Toggle
                            className="toggle-button"
                            checked={isElementsVisible}
                            onChange={() => this.setState(prevState => ({ isElementsVisible: !prevState.isElementsVisible }))}
                            icons={{
                                checked: <FontAwesomeIcon icon={faAngleDown} className="toggle-icon" />,
                                unchecked: <FontAwesomeIcon icon={faAngleDown} className="toggle-icon" />
                            }}
                        /> */}
                       <div className="toggle-button" onClick={() => this.setState(prevState => ({ isElementsVisible: !prevState.isElementsVisible }))}>
    <FontAwesomeIcon icon={isElementsVisible ? faEyeSlash : faEye} className="toggle-icon" style={{ color: 'blue' }} />
     
</div>
                        {/* Search Input */}
                        <input
                            className="search-input"
                            type="text"
                            placeholder="Item Name"
                            value={searchQuery}
                            onChange={this.handleSearchChange}
                        />
                        {/* Search Icon */}
                        <FontAwesomeIcon
                            icon={isSearchIconClicked ? faSearch : (isSearchIconHovered ? faHandPointer : faSearch)}
                            className="search-icon"
                            onMouseEnter={() => this.setState({ isSearchIconHovered: true })}
                            onMouseLeave={() => this.setState({ isSearchIconHovered: false })}
                            onClick={this.handleSearch}
                        />
                        {/* Burger Menu */}
                        <div className="burger-menu" onClick={this.toggleMenu}>
                            <FontAwesomeIcon icon={faBars} className="menu-icon" />
                            {isMenuOpen && (
                                <div className="menu-options-container">
                                    {menuOptions.map((option, index) => (
                                        <div key={index} className="menu-option-box">
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Supplier and Item Inputs */}
                    {isElementsVisible && (
                        <div className="otherfilter">
                             {/* Item Input */}
                             <div className="itemName-bar">
                                <input
                                    className="itemName-input"
                                    type="text"
                                    placeholder="Item Number"
                                    value={itemName}
                                    onChange={this.handleItemNameChange}
                                />
                            </div>

                            {/* Supplier Input */}
                            <div className="supplier-bar">
                                <input
                                    className="supplier-input"
                                    type="text"
                                    placeholder="Supplier Number"
                                    value={supplierName}
                                    onChange={this.handleSupplierNameChange}
                                />
                            </div>
                           
                            {/* Additional Inputs with Spacing */}
                            <div className="additional-inputs">
                                <span className="supplier-label"  >AA</span>
                                <input
                                    className="aaNumber"
                                    type="text"
                                    placeholder="PR Number"
                                    value={itemName}
                                    onChange={this.handleItemNameChange}
                                    
                                />
                                <input
                                    className="Edition"
                                    type="text"
                                    placeholder="PR Edition"
                                    value={itemName}
                                    onChange={this.handleItemNameChange}
                                    
                                  
                                />
                            </div>
                            {/* Packaging Input */}
                            <div className="Packaginging-bar">
                                <input
                                    className="Packaginging-input"
                                    type="text"
                                    placeholder="Packaging Solution PSM ID"
                                    value={itemName}
                                    onChange={this.handleItemNameChange}
                                    style={{ marginRight: '10px' }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Filter Buttons */}
                    {isElementsVisible && (
                        <div className="filter-buttons" style={{ flexShrink: 0 }}>
                            {Object.keys(filters).map(filter => (
                                <div key={filter} className="filter">
                                   <label className="toggle">
                                    <input
                                        type="checkbox"
                                        checked={filters[filter]}
                                        onChange={() => this.handleFilterToggle(filter)}
                                    />
                                    <span className="slider"></span>
                                </label>
                                     <div className="filter-name">
                                        {filter === 'IncludeGreenLines' ? 'Include Green Lines' :
                                            filter === 'IncludeGreyLines' ? 'Include Grey Lines' :
                                                filter === 'IncludeLastPackagingDate' ? 'Include Last Packaging Date' :
                                                    filter === 'IncludeRange' ? 'Include Range' : filter}
                                    </div>
                                   
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Search and Clear Buttons */}
                    {isElementsVisible && (
                        <div className="search-clear-buttons" style={{ flexShrink: 0 }}>
                            <button
                                className={`search-button ${isSearchSelected ? 'green' : ''}`}
                                onClick={this.handleSearch}
                            >
                                Search
                            </button>
                            <button
                                className={`clear-button ${isClearSelected ? 'green' : ''}`}
                                onClick={this.handleClear}
                            >
                                Clear
                            </button>
                        </div>
                    )}

                    {/* Item List Table */}
                    {isTableVisible && (
                        <div className="item-list" style={{ flexGrow: 1, overflowX: 'auto' }}>
                            <div className="table-container">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th className="table-header">Item Name</th>
                                            <th className="table-header">Number</th>
                                            <th className="table-header">Dwp Type</th>
                                            <th className="table-header">No-Ed</th>
                                            <th className="table-header">PR/PSM ID</th>
                                            <th className="table-header">Status Date</th>
                                            <th className="table-header">Supplier</th>
                                            <th className="table-header">From Date</th>
                                            <th className="table-header">To Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {itemsToShow.map((item, index) => (
                                            <tr key={index} className="table-row" onClick={() => this.props.onRowClick(item)}>
                                                <td className="table-cell">{item.field1}</td>
                                                <td className="table-cell">{item.field2}</td>
                                                <td className="table-cell">{item.field3}</td>
                                                <td className="table-cell">{item.field4}</td>
                                                <td className="table-cell">{item.field5}</td>
                                                <td className="table-cell">{item.field6}</td>
                                                <td className="table-cell">{item.field7}</td>
                                                <td className="table-cell">{item.field8}</td>
                                                <td className="table-cell">{item.field9}</td>

                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Pagination */}
                    {isTableVisible && (
                        <div className="pagination" style={{ flexShrink: 0 }}>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button key={i + 1} onClick={() => this.handlePageChange(i + 1)}>{i + 1}</button>
                            ))}
                        </div>
                    )}

                    {/* Rows Per Page Dropdown */}
                    {isTableVisible && (
                        <div className="rows-per-page" style={{ flexShrink: 0 }}>
                            <span>Rows per page:</span>
                            <select value={rowsPerPage} onChange={this.handleRowsPerPageChange}>
                                {[5, 10, 20].map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                    )}


                    {/* Item Count and Elapsed Time */}
                    {isTableVisible && (
                        <div className="search-box" style={{ flexShrink: 0 }}>
                            <div className="item-count-elapsed-time">
                                <div className="elapsed-time">{`Elapsed Time: ${elapsedTime} ms`}</div>
                                <div className="item-count">{`Item Count: ${itemCount}`}</div>
                            </div>
                        </div>
                    )}
                    
                </div>
            </div>
            
        );
    }
}

export default MinorPane;
