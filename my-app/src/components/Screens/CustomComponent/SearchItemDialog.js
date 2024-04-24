import React, { Component } from 'react';
import generateItems from '../../data/Item';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBars, faHandPointer, faAngleDown, faBook } from '@fortawesome/free-solid-svg-icons';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';

// Modal dialog component
class SearchItemDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchTerm: '',
            searchResults: []
        };
    }

    handleSearchTermChange = (event) => {
        this.setState({ searchTerm: event.target.value });
    }

    searchItems = () => {
        const { searchTerm } = this.state;
        // Implement search logic based on the searchTerm
        // Update searchResults state accordingly
    }

    handleItemClick = (item) => {
        // Reflect the selected item in the search text
        this.props.onItemSelected(item);
    }

    render() {
        const { searchTerm, searchResults } = this.state;

        return (
            <div className="modal-dialog">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={this.handleSearchTermChange}
                    placeholder="Search items..."
                />
                <button onClick={this.searchItems}>Search</button>
                <ul>
                    {searchResults.map((item, index) => (
                        <li key={index} onClick={() => this.handleItemClick(item)}>{item}</li>
                    ))}
                </ul>
            </div>
        );
    }
}


export default SearchItemDialog;
