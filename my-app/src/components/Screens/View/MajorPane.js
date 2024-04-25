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
            },
        height: '500px'    
         
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
                                <div className="fields-container" >
                                    <table className="table">
                                        <tbody>
                                            {this.renderSubsectionFields([
                                                { name: 'Number', value: selectedItem.field2 },
                                                { name: 'Type', value: selectedItem.field3 },
                                                { name: 'Name', value: selectedItem.field1 },
                                                { name: 'PRU', value: selectedItem.field5 },
                                                { name: 'HFB', value: selectedItem.field10},
                                                { name: 'PA', value: selectedItem.field11 },
                                                { name: 'Category', value: selectedItem.field12 },
                                                { name: 'Segment', value: selectedItem.field13 },
                                                { name: 'Meterware', value: selectedItem.field14 },
                                                { name: 'UTG', value: selectedItem.field15 },
                                                { name: 'Status', value: selectedItem.field16 },
                                                { name: 'PartCentric', value: selectedItem.field17 },
                                                // Add more fields as needed
                                            ])}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                
                <div className={`subsection-pane ${collapsed.DWP ? 'collapsed' : ''}`} >
                    <h2 className="subsection-header" onClick={() => this.toggleCollapse('DWP')}>
                        DWP
                        <span className={`arrow ${collapsed.DWP ? 'collapsed' : ''}`}>&#9660;</span>
                    </h2>
                    {!collapsed.DWP && (
                        <div className="subsection-content">
                            {selectedItem && (
                                <div className="fields-container">
                                    <table className="table">
                                        <tbody>
                                            {this.renderSubsectionFields([
                                                { name: 'Type', value: selectedItem.field18 },
                                                { name: 'Number', value: selectedItem.field19 },
                                                { name: 'Edition', value: selectedItem.field20 },
                                                { name: 'Status', value: selectedItem.field21 },
                                                { name: 'Status Date', value: selectedItem.field6 },
                                                { name: 'Issuer', value: selectedItem.field22 },
                                                // Add more fields as needed
                                            ])}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {!collapsed.DWP && (
                        <div className="subsection-content">
                            {selectedItem && (
                                <div className="fields-container">
                                    <table className="table">
                                        <tbody>
                                            {this.renderSubsectionFields([
                                                { name: 'Packaging Requirement:', value: selectedItem.field5 },
                                                { name: 'Comments:', value: selectedItem.field23} 
                                                // Add more fields as needed
                                            ])}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {!collapsed.DWP && (
                        <div className="subsection-content">
                            {selectedItem && (
                                <div className="fields-container">
                                    <table className="table">
                                        <tbody>
                                            {this.renderSubsectionFields([
                                                { name: 'Fulfillment Flow', value: selectedItem.field24 },
                                                { name: 'MDU', value: selectedItem.field25 },
                                                { name: 'Picking Indication', value: selectedItem.field33 },
                                                { name: 'MDQ', value: selectedItem.field34 },
                                                { name: 'Shelf Life', value: selectedItem.field26 },
                                                { name: 'Day Before FIFO', value: selectedItem.field27 },
                                                { name: 'Fire Class', value: selectedItem.field28 },
                                                { name: 'Suitable for Day filling', value: selectedItem.field29 },
                                                { name: 'Sales Solution', value: selectedItem.field30 },
                                                { name: 'Supply Chain Net Volume (dm3)', value: selectedItem.field31 },
                                                { name: 'Supply Chain Gross Volume (dm3)', value: selectedItem.field32 },
                                                
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
