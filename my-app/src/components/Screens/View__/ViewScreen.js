// ViewScreen.js
import React, { Component } from 'react';
import MinorPane from './MinorPane';
import MajorPane from './MajorPane';
import Split from 'react-split'

class ViewScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedItem: null,
            minorPaneWidth: 300,
            majorPaneWidth: null
        };
    }
    // Inside ViewScreen class
     handleClearSelectedItem = () => {
    this.setState({ selectedItem: null });
}


    handleRowClick = (item) => {
        this.setState({ selectedItem: item });
    }
    handleResize = (event, direction, ref) => {
        
        const newWidth = ref.style.width;
        this.setState({ minorPaneWidth: newWidth });
    }
    onResizeEnd = (sizes) => {
        this.setState({ minorPaneWidth: sizes[0], majorPaneWidth: sizes[1] });
    }

    render() {
        
        const { selectedItem, minorPaneWidth } = this.state;
        const { isFloatingPaneOpen } = this.props;
        return (
           <div className="view-screen" style={{ paddingTop: '20px', border: '1px solid #ccc' }}> {/* Add border to the view-screen container */}
             <div className="pane-container" style={{ display: 'flex', backgroundColor: '#f0f0f0' }}> {/* Add background color */}
                 
             <div className="minor-pane-container" style={{ flex: 1, paddingRight: '5px' }}> {/* Add padding to the right */}
                     
                <MinorPane onRowClick={this.handleRowClick} onClear={this.handleClearSelectedItem} />

                </div>
                <div className="gap" style={{ width: '10px', backgroundColor: '#f0f0f0' }} /> {/* Add a div for the gap with background color */}
                   
                <div className="major-pane-container" style={{ flex: 3, paddingLeft: '5px' }}>  
                    <MajorPane selectedItem={this.state.selectedItem} />
                </div>
                </div>
            </div>
        );
    }
}

export default ViewScreen;
