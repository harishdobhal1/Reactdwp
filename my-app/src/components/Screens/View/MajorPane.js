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
        const fieldsContainer = (
            <div className="fields-container">
                {fields.map((field, index) => (
                    <div key={index} className="field">
                        <p><span className="field-name">{field.name}:</span> <span className="field-value">{field.value}</span></p>
                    </div>
                ))}
            </div>
        );
        rows.push(fieldsContainer);
        return rows;
    }
    render() {
        const { selectedItem } = this.props;
        const { collapsed, isPanelOpen } = this.state;
    
        // Check if no item is selected
        if (!selectedItem) {
            return (
                <div className="major-pane">
                    <div>No item selected</div>
                </div>
            );
        }
    
        return (
            <div className="major-pane">
                <div className={`side-panel ${isPanelOpen ? 'open' : ''}`}>
                    {/* Content of the side panel */}
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
                                                { name: 'Number', value: selectedItem.field1 },
                                                { name: 'Type', value: selectedItem.field2 },
                                                { name: 'Name', value: selectedItem.field3 },
                                                { name: 'PRU', value: selectedItem.field4 },
                                                { name: 'HFB', value: selectedItem.field5 },
                                                { name: 'PA', value: selectedItem.field6 },
                                                { name: 'Category', value: selectedItem.field4 },
                                                { name: 'Segment', value: selectedItem.field5 },
                                                { name: 'Meterware', value: selectedItem.field6 },
                                                { name: 'UTG', value: selectedItem.field4 },
                                                { name: 'Status', value: selectedItem.field5 },
                                                { name: 'PArtCentric', value: selectedItem.field6 },
                                                // Add more fields as needed
                                            ])}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div className={`subsection-pane ${collapsed.DWP ? 'collapsed' : ''}`} style={{ height: 'fit-content' }}>
                    <h2 className="subsection-header" onClick={() => this.toggleCollapse('DWP')}>
                        Supplier
                        <span className={`arrow ${collapsed.DWP ? 'collapsed' : ''}`}>&#9660;</span>
                    </h2>
                    {!collapsed.DWP && (
                        <div className="subsection-content">
                            {selectedItem && (
                                <div className="fields-container">
                                    <table className="table">
                                        <tbody>
                                            {this.renderSubsectionFields([
                                                { name: 'Number', value: selectedItem.field1 },
                                                { name: 'Name', value: selectedItem.field2 },
                                                { name: 'Purchasing Service Office', value: selectedItem.field3 },
                                                { name: 'Supply Area', value: selectedItem.field4 },
                                                { name: 'Main Category', value: selectedItem.field5 },
                                                { name: 'Production Engineer', value: selectedItem.field6 },
                                                // Add more fields as needed
                                            ])}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div className={`subsection-pane ${collapsed.ConsumerPackages ? 'collapsed' : ''}`}>
                    <h2 className="subsection-header" onClick={() => this.toggleCollapse('ConsumerPackages')}>
                        DWP
                        <span className={`arrow ${collapsed.ConsumerPackages ? 'collapsed' : ''}`}>&#9660;</span>
                    </h2>
                    {!collapsed.ConsumerPackages && (
                        <div className="subsection-content">
                            {selectedItem && (
                                <div className="fields-container">
                                    <table className="table">
                                        <tbody>
                                            {this.renderSubsectionFields([
                                                { name: 'Type', value: selectedItem.field1 },
                                                { name: 'Number', value: selectedItem.field2 },
                                                { name: 'Edition', value: selectedItem.field3 },
                                                { name: 'Status', value: selectedItem.field4 },
                                                { name: 'Issuer', value: selectedItem.field5 },
                                                { name: 'Status Date', value: selectedItem.field6 },
                                                { name: 'Latest update', value: selectedItem.field4 },
                                                { name: 'Inspection Date', value: selectedItem.field5 },
                                                { name: 'From Date', value: selectedItem.field6 },
                                                { name: 'Inspection Date', value: selectedItem.field5 },
                                                { name: 'To Date', value: selectedItem.field6 },
                                                { name: 'LAst packaging Date', value: selectedItem.field6 },
                                                // Add more fields as needed
                                            ])}
                                        </tbody>
                                    </table>
                                    <span style={{ border: '1px solid #ccc', padding: '5px', borderRadius: '5px', backgroundColor: '#f0f0f0', boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.1)' }}>Packaging Requirement: AA-117525-9-LEN - Pillow - Packaging</span>
                                    <table className="table">
                                        <tbody>
                                            {this.renderSubsectionFields([
                                                { name: 'Fulfillment Flow', value: selectedItem.field1 },
                                                { name: 'MDU', value: selectedItem.field2 },
                                                { name: 'Picking Indication', value: selectedItem.field3 },
                                                { name: 'MDQ', value: selectedItem.field4 },
                                                { name: 'Shelf Life', value: selectedItem.field5 },
                                                { name: 'Day Before FIFO', value: selectedItem.field6 },
                                                { name: 'Fire Class', value: selectedItem.field4 },
                                                { name: 'Suitable for Day filling', value: selectedItem.field5 },
                                                { name: 'Sales Solution', value: selectedItem.field6 },
                                                { name: 'Supply Chain Net Volume (dm3)', value: selectedItem.field5 },
                                                { name: 'Supply Chain Gross Volume (dm3)', value: selectedItem.field6 },
                                               
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
