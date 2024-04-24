import React, { Component } from 'react';
import generateItems from '../../data/Item';
import './MinorPane.css';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBars, faHandPointer, faAngleDown } from '@fortawesome/free-solid-svg-icons';

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
            pageSize: 5 // Number of items per page
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
    }

    toggleMenu = () => {
        this.setState(prevState => ({
            isMenuOpen: !prevState.isMenuOpen
        }));
    }

    handlePageChange = (page) => {
        this.setState({ currentPage: page });
    }

    render() {
        const { searchQuery, filteredItems, itemCount, elapsedTime, filters, isTableVisible,
            showFilters, isSearchSelected, isClearSelected, isMenuOpen, menuOptions, supplierName,
            itemName, isSearchIconClicked, isSearchIconHovered, isElementsVisible, currentPage, pageSize } = this.state;

        // Calculate pagination
        const totalPages = Math.ceil(filteredItems.length / pageSize);
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize, filteredItems.length);
        const itemsToShow = filteredItems.slice(startIndex, endIndex);

        return (
            <div className="minor-pane">

                <div className="search-bar">

                    <Toggle
                        className="toggle-button"
                        checked={isElementsVisible}
                        onChange={() => this.setState(prevState => ({ isElementsVisible: !prevState.isElementsVisible }))}
                        icons={{
                            checked: <FontAwesomeIcon icon={faAngleDown} className="toggle-icon" />,
                            unchecked: <FontAwesomeIcon icon={faAngleDown} className="toggle-icon" />
                        }}
                    />

                    <input
                        className="search-input"
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={this.handleSearchChange}
                    />
                    <FontAwesomeIcon
                        icon={isSearchIconClicked ? faSearch : (isSearchIconHovered ? faHandPointer : faSearch)}
                        className="search-icon"
                        onMouseEnter={() => this.setState({ isSearchIconHovered: true })}
                        onMouseLeave={() => this.setState({ isSearchIconHovered: false })}
                        onClick={this.handleSearch}
                    />

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

                {isElementsVisible && (
                    <div className="filter-buttons">
                        {Object.keys(filters).map(filter => (
                            <div key={filter} className="filter">
                                <div className="filter-name">
                                    {filter === 'IncludeGreenLines' ? 'Include Green Lines' :
                                        filter === 'IncludeGreyLines' ? 'Include Grey Lines' :
                                            filter === 'IncludeLastPackagingDate' ? 'Include Last Packaging Date' :
                                                filter === 'IncludeRange' ? 'Include Range' : filter}
                                </div>
                                <Toggle
                                    className="toggle-button"
                                    checked={filters[filter]}
                                    onChange={() => this.handleFilterToggle(filter)}
                                    icons={false}
                                />
                            </div>
                        ))}
                    </div>
                )}
                {isElementsVisible && (
                    <div className="search-clear-buttons">
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

                {isTableVisible && (
                    <div className="item-list">
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className="table-header">Item Name</th>
                                        <th className="table-header">Number</th>
                                        <th className="table-header">Dwp Type</th>
                                        <th className="table-header">No-Ed</th>
                                        <th className="table-header">Status</th>
                                        <th className="table-header">Supplier</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itemsToShow.map((item, index) => (
                                        <tr key={index} className="table-row" onClick={() => this.props.onRowClick(item)}>
                                            <td className="table-cell"><div className="row-content">{item.field1}</div></td>
                                            <td className="table-cell"><div className="row-content">{item.field2}</div></td>
                                            <td className="table-cell"><div className="row-content">{item.field8}</div></td>
                                            <td className="table-cell"><div className="row-content">{item.field4}</div></td>
                                            <td className="table-cell"><div className="row-content">{item.field5}</div></td>
                                            <td className="table-cell"><div className="row-content">{item.field6}</div></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {isTableVisible && filteredItems.length > 0 && (
                    <div className="pagination">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button key={i + 1} onClick={() => this.handlePageChange(i + 1)}>{i + 1}</button>
                        ))}
                    </div>
                )}

                {isTableVisible && (
                    <div className="search-box">
                        <div className="item-count-elapsed-time">
                            <div className="elapsed-time">{`Elapsed Time: ${elapsedTime} ms`}</div>
                            <div className="item-count">{`Item Count: ${itemCount}`}</div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default MinorPane;
