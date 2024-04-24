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
            startX: 0,
            isPinned: false,
            minWidth: 200,
            maxWidth: 600
        };
    }

    handleClearSelectedItem = () => {
        this.setState({ selectedItem: null });
    }

    handleRowClick = (item) => {
        this.setState({ selectedItem: item });
    }

    handleMouseDown = (e) => {
        if (this.state.isPinned) return;
        this.setState({
            isResizing: true,
            startX: e.pageX
        });
        document.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('mouseup', this.handleMouseUp);
    }

    handleMouseMove = (e) => {
        if (this.state.isResizing) {
            let newWidth = this.state.minorPaneWidth + e.pageX - this.state.startX;
            newWidth = Math.min(Math.max(newWidth, this.state.minWidth), this.state.maxWidth);
            this.setState({ minorPaneWidth: newWidth, startX: e.pageX });
        }
    }

    handleMouseUp = () => {
        this.setState({ isResizing: false });
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);
    }

    handlePinToggle = () => {
        this.setState(prevState => ({ isPinned: !prevState.isPinned }));
    }

    render() {
        const { selectedItem, minorPaneWidth, isPinned } = this.state;
        return (
            <div className="view-screen" style={{ paddingTop: '20px', border: '1px solid #ccc', display: 'flex' }}>
                <div className="minor-pane-container" style={{ flex: `0 0 ${minorPaneWidth}px`, paddingRight: '5px', borderRight: '1px solid #ccc', position: 'relative' }}>
                    <div style={{ textAlign: 'center', paddingTop: '5px', position: 'relative' }}>
                        <h5 style={{ marginTop: '-10px' }}>Search</h5>
                        <button onClick={this.handlePinToggle} style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}>
                            {isPinned ? 'Unpin' : 'Pin'}
                        </button>
                    </div>
                    {!isPinned &&
                        <div className="resize-handle" style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '5px', cursor: 'col-resize' }} onMouseDown={this.handleMouseDown}></div>
                    }
                    <MinorPane onRowClick={this.handleRowClick} onClear={this.handleClearSelectedItem} />
                </div>
                <div className="gap" style={{ width: '10px', backgroundColor: '#f0f0f0', borderRight: '1px solid #ccc' }} />
                <div className="major-pane-container" style={{ flex: 1, paddingLeft: '5px' }}>
                    <div style={{ textAlign: 'center', paddingTop: '5px' }}>
                        <h5 style={{ marginTop: '-10px' }}>Detail</h5>
                    </div>
                    <MajorPane selectedItem={selectedItem} />
                </div>
            </div>
        );
    }
}

export default ViewScreen;
