import React, { Component } from 'react';
import MinorPane from './MinorPane';
import MajorPane from './MajorPane';

class ViewScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedItem: null,
            minorPaneWidth: 300,
            isResizing: false,
            startX: 0
        };
    }

    handleClearSelectedItem = () => {
        this.setState({ selectedItem: null });
    }

    handleRowClick = (item) => {
        this.setState({ selectedItem: item });
    }

    handleMouseDown = (e) => {
        this.setState({
            isResizing: true,
            startX: e.pageX
        });
        document.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('mouseup', this.handleMouseUp);
    }

    handleMouseMove = (e) => {
        if (this.state.isResizing) {
            const newWidth = this.state.minorPaneWidth + e.pageX - this.state.startX;
            this.setState({ minorPaneWidth: newWidth, startX: e.pageX });
        }
    }

    handleMouseUp = () => {
        this.setState({ isResizing: false });
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);
    }

    render() {
        const { selectedItem, minorPaneWidth } = this.state;
        return (
            <div className="view-screen" style={{ paddingTop: '20px', border: '1px solid #ccc', display: 'flex' }}>
                <div className="minor-pane-container" style={{ flex: `0 0 ${minorPaneWidth}px`, paddingRight: '5px', borderRight: '1px solid #ccc', position: 'relative' }}>
                    <div className="resize-handle" style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '5px', cursor: 'col-resize' }} onMouseDown={this.handleMouseDown}></div>
                    <MinorPane onRowClick={this.handleRowClick} onClear={this.handleClearSelectedItem} />
                </div>
                <div className="gap" style={{ width: '10px', backgroundColor: '#f0f0f0', borderRight: '1px solid #ccc' }} />
                <div className="major-pane-container" style={{ flex: 1, paddingLeft: '5px' }}>
                    <MajorPane selectedItem={selectedItem} />
                </div>
            </div>
        );
    }
}

export default ViewScreen;
