// MajorPane.js
import React, { Component } from 'react';
import './MajorPane.css'; // Import CSS file for styling

class MajorPane extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: {
                item: false,
                DWP: false,
                ConsumerPackages: false,
                isPanelOpen: false
            }
        };
    }
    togglePanel = () => {
        this.setState(prevState => ({
            isPanelOpen: !prevState.isPanelOpen
        }));
    }

    toggleCollapse = (subsection) => {
        this.setState(prevState => ({
            collapsed: {
                ...prevState.collapsed,
                [subsection]: !prevState.collapsed[subsection]
            }
        }));
    }

    renderSubsectionFields = (fields) => {
        const rows = [];
        for (let i = 0; i < fields.length; i += 3) {
            const rowFields = fields.slice(i, i + 3);
            const row = (
                <div key={i} className="row">
                    {rowFields.map((field, index) => (
                        <div key={index} className="field">
                            <p>{field.name}: {field.value}</p>
                        </div>
                    ))}
                </div>
            );
            rows.push(row);
        }
        return rows;
    }
    
    render() {
        const { selectedItem } = this.props;
        const { collapsed,isPanelOpen} = this.state;
        

        return (
            <div className="major-pane">
                 <div>
            {/* Your existing component JSX */}
            <div className={`side-panel ${isPanelOpen ? 'open' : ''}`}>
                {/* Content of the side panel */}
            </div>
        </div>
                <div className={`subsection-pane ${collapsed.item ? 'collapsed' : ''}`}>
                    <h2 className="subsection-header" onClick={() => this.toggleCollapse('item')}>
                        Item
                        <span className={`arrow ${collapsed.item ? 'collapsed' : ''}`}>&#9660;</span>
                    </h2>
                    {!collapsed.item && (
                        <div className="subsection-content">
                            {selectedItem && (
                                <div className="fields-container">
                                     <table className="table">
                                            <tbody>
                                                {this.renderSubsectionFields([
                                                    { name: 'Field 1', value: selectedItem.field1 },
                                                    { name: 'Field 2', value: selectedItem.field2 },
                                                    { name: 'Field 3', value: selectedItem.field3 },
                                                    { name: 'Field 4', value: selectedItem.field4 },
                                                    { name: 'Field 5', value: selectedItem.field4 },
                                                    { name: 'Field 6', value: selectedItem.field4 },
                                                   
                                                    // Add more fields as needed
                                                ])}
                                            </tbody>
                                        </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div className={`subsection-pane ${collapsed.supplier ? 'collapsed' : ''}`}>
                    <h2 className="subsection-header" onClick={() => this.toggleCollapse('DWP')}>
                        DWP
                        <span className={`arrow ${collapsed.item ? 'collapsed' : ''}`}>&#9660;</span>
                    </h2>
                    {!collapsed.supplier && (
                        <div className="subsection-content">
                            {selectedItem && (
                                <div className="fields-container">
                                     <table className="table">
                                            <tbody>
                                    {this.renderSubsectionFields([
                                          { name: 'field14 ', value: selectedItem.field14 },
                                          { name: 'field10 ', value: selectedItem.field10 },
                                          { name: 'field11 ', value: selectedItem.field11 },
                                          { name: 'field13 ', value: selectedItem.field13 },
                                          { name: 'field15 ', value: selectedItem.field15 },
                                          { name: 'field24 ', value: selectedItem.field24 },
                                        // selectedItem.field14,
                                        // selectedItem.field10,
                                        // selectedItem.field11,
                                        // selectedItem.field12,
                                        // selectedItem.field13,
                                        // selectedItem.field14,
                                        // selectedItem.field15,
                                        // selectedItem.field16,
                                        // selectedItem.field24
                                        // Add more fields as needed
                                    ])}
                                     </tbody>
                                        </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div className={`subsection-pane ${collapsed.actual ? 'collapsed' : ''}`}>
                    <h2 className="subsection-header" onClick={() => this.toggleCollapse('ConsumerPackages')}>
                    Consumer Packages
                    <span className={`arrow ${collapsed.item ? 'collapsed' : ''}`}>&#9660;</span>
                    </h2>
                    {!collapsed.actual && (
                        <div className="subsection-content">
                            {selectedItem && (
                                <div className="fields-container">
                                    <table className="table">
                                            <tbody> 
                                    {this.renderSubsectionFields([
                                        { name: 'field17 ', value: selectedItem.field14 },
                                        { name: 'field18 ', value: selectedItem.field10 },
                                        { name: 'field19 ', value: selectedItem.field11 },
                                        { name: 'field20 ', value: selectedItem.field13 },
                                        { name: 'field21 ', value: selectedItem.field15 },
                                        { name: 'field22 ', value: selectedItem.field24 },
                                        // selectedItem.field17,
                                        // selectedItem.field18,
                                        // selectedItem.field19,
                                        // selectedItem.field20,
                                        // selectedItem.field21,
                                        // selectedItem.field22,
                                        // selectedItem.field23,
                                        // selectedItem.field24,
                                        // selectedItem.field25
                                        // Add more fields as needed
                                    ])}
                                     </tbody>
                                        </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                {/* Add more subsections similarly */}
            </div>
        );
    }
}

export default MajorPane;
