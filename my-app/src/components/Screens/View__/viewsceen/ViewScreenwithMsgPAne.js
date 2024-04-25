import React, { Component } from 'react';
import MinorPane from './MinorPane';
import MajorPane from './MajorPane';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleLeft, faThumbtack } from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';

class ViewScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedItem: null,
            minorPaneWidth: 300,
            isResizing: false,
            startX: 0,
            isMinorPanePinned: false,
            isMinorPaneHidden: false,
            isFloatingPanePinned: false,
            isFloatingPaneHidden: false,
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
        if (this.state.isMinorPanePinned) return;
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

    handleMinorPanePinToggle = () => {
        this.setState(prevState => ({ isMinorPanePinned: !prevState.isMinorPanePinned }));
    }

    handleFloatingPanePinToggle = () => {
        this.setState(prevState => ({ isFloatingPanePinned: !prevState.isFloatingPanePinned }));
    }

    handleToggleMinorPane = () => {
        this.setState(prevState => ({ isMinorPaneHidden: !prevState.isMinorPaneHidden }));
    }

    handleToggleFloatingPane = () => {
        this.setState(prevState => ({ isFloatingPaneHidden: !prevState.isFloatingPaneHidden }));
    }



    render() {
        const { selectedItem, minorPaneWidth, isMinorPanePinned, isMinorPaneHidden, isFloatingPanePinned, isFloatingPaneHidden} = this.state;
        return (
            <div className="view-screen" style={{ paddingTop: '20px', border: '1px solid #ccc', display: 'flex' }}>
                <div className="minor-pane-container" style={{ flex: `0 0 ${isMinorPaneHidden ? '0' : minorPaneWidth}px`, paddingRight: '5px', borderRight: '1px solid #ccc', overflow: 'hidden', position: 'relative', transition: 'flex-basis 0.5s ease' }}>
                    <div style={{ textAlign: 'center', paddingTop: '5px', position: 'relative' }}>
                        <div onClick={this.handleToggleMinorPane} style={{ position: 'absolute', left: '-8px', top: '50%', transform: 'translateY(-50%)', zIndex: 1, cursor: 'pointer', fontSize: '12px', visibility: 'visible', transition: 'visibility 0.5s ease' }}>
                            <FontAwesomeIcon icon={faAngleDoubleLeft} style={{ fontSize: '12px', color: '#000' }} />
                        </div>
                        {!isMinorPaneHidden &&
                            <>
                                <h5 style={{ marginTop: '-10px', transition: 'margin-top 0.5s ease' }}>Search</h5>
                                <FontAwesomeIcon
                                    icon={faThumbtack}
                                    style={{
                                        position: 'absolute',
                                        right: 0,
                                        top: '35%', /* Adjusted position */
                                        transform: 'translateY(-50%)',
                                        transition: 'right 0.5s ease',
                                        cursor: 'pointer',
                                        color: isMinorPanePinned ? '#000' : '#ccc',
                                        transform: isMinorPanePinned ? 'rotate(0deg)' : 'rotate(-45deg)'
                                    }}
                                    onClick={this.handleMinorPanePinToggle}
                                />
                            </>
                        }
                    </div>
                    {!isMinorPanePinned &&
                        <div className="resize-handle" style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '5px', cursor: 'col-resize' }} onMouseDown={this.handleMouseDown}></div>
                    }
                    {!isMinorPaneHidden && <MinorPane onRowClick={this.handleRowClick} onClear={this.handleClearSelectedItem} />}
                </div>
                <div className="gap" style={{ width: '10px', backgroundColor: '#f0f0f0', borderRight: '1px solid #ccc' }} />
                <div className="major-pane-container" style={{ flex: 1, paddingLeft: '5px' }}>
                    <div style={{ textAlign: 'center', paddingTop: '5px' }}>
                        <h5 style={{ marginTop: '-10px' }}>Detail</h5>
                    </div>
                    <MajorPane selectedItem={selectedItem} />
                </div>
               
                {!isFloatingPaneHidden &&
                    <div className="floating-pane-container" style={{ width: '300px', border: '1px solid #ccc',margintop:'30px' ,marginLeft: '10px', transition: 'width 2s ease' }}>
                        <div style={{ textAlign: 'center', padding: '10px' }}>
                            <FontAwesomeIcon
                                icon={faThumbtack}
                                style={{
                                    float: 'left',
                                    cursor: 'pointer',
                                    color: isFloatingPanePinned ? '#000' : '#ccc',
                                    transform: isFloatingPanePinned ? 'rotate(0deg)' : 'rotate(-45deg)'
                                }}
                                onClick={this.handleFloatingPanePinToggle}
                              
                            />
    
                            <h5>Floating Pane</h5>
                        </div>
                    </div>
                }




               
                
                <div style={{ position: 'absolute', top: '17%', right: '30px', transform: 'translateY(-50%)', zIndex: 1, cursor: 'pointer', fontSize: '12px' }} onClick={this.handleToggleFloatingPane}>
                    <FontAwesomeIcon icon={faAngleDoubleLeft} style={{ fontSize: '12px', color: '#000' }} />
                </div>
            </div>
        );
    }
}

export default ViewScreen;
