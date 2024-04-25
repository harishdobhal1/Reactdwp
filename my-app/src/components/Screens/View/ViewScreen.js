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
            minorPaneWidth: 500,
            isResizing: false,
            startX: 0,
            isMinorPanePinned: false,
            isMinorPaneHidden: false,
            isFloatingPanePinned: false,
            isFloatingPaneHidden: false,
            isUserInfoOpen:false,
            minWidth: 300,
            maxWidth: 600,
            isHoveringSide: false, // Track if mouse is hovering over the side of minor-pane-container
            isHoveringFloatingPane: false//track the osue hovering for floating pane
        };
        
    }

    handleClearSelectedItem = () => {
        this.setState({ selectedItem: null });
    }
    handleClearMajorItem = () => {
        this.setState({ selectedItem: null });
    }

    handleRowClick = (item) => {
        this.setState({ selectedItem: item });
    }

    handleMouseDown = (e) => {
        // if (this.state.isMinorPanePinned) return;
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
        const { isFloatingPaneOpen, isFloatingPaneHidden } = this.props;

        // If the floating pane is open, close it and hide the pane
        if (isFloatingPaneOpen) {
            this.props.toggleFloatingPane(); // Toggle the floating pane state 
            this.setState({ isFloatingPaneHidden: false }); // show  the floating pane
        } else {
            // If the floating pane is closed but hidden, open it and show the pane
            if (isFloatingPaneHidden) {
                this.setState({ isFloatingPaneOpen: false }); // Show the floating pane
            }
            // Toggle the floating pane state to open it
            this.props.toggleFloatingPane();
        }
    }


   

    handleMouseEnterSide = () => {
        if (!this.state.isMinorPanePinned) {
            this.setState({ isMinorPaneHidden: false, isHoveringSide: true });
        }
    }

    handleMouseLeaveSide = () => {
        if (!this.state.isMinorPanePinned) {
            this.setState({ isMinorPaneHidden: true, isHoveringSide: false });
        }
    }

    handleMouseEnterMinorPane = () => {
        this.setState({ isHoveringSide: false });
    }

    handleMouseLeaveMinorPane = () => {
        if (!this.state.isMinorPanePinned && !this.state.isHoveringSide) {
            this.setState({ isMinorPaneHidden: true });
        }
    }

    render() {
        const { selectedItem, minorPaneWidth, isMinorPanePinned, isMinorPaneHidden, isFloatingPanePinned, isFloatingPaneHidden,isHoveringFloatingPane } = this.state;
        const { isFloatingPaneOpen } = this.props;
        console.log('not',isFloatingPaneOpen);
        console.log('angle',isFloatingPaneHidden);
       

   

        return (


            
            <div className="view-screen" style={{ paddingTop: '20px', border: '1px solid #ccc', display: 'flex' }}>
                
                <div
                    className="minor-pane-container"
                    style={{
                        flex: `0 0 ${isMinorPaneHidden ? '0' : minorPaneWidth}px`,
                        paddingRight: '5px',
                        borderRight: '1px solid #ccc',
                        overflow: 'hidden',
                        position: 'relative',
                        transition: 'flex-basis 0.5s ease'
                    }}
                    onMouseEnter={this.handleMouseEnterSide}
                    onMouseLeave={this.handleMouseLeaveSide}
                >
                    <div
                        style={{
                            textAlign: 'center',
                            paddingTop: '5px',
                            position: 'relative'
                        }}
                    >
                        <div
                            onClick={this.handleToggleMinorPane}
                            style={{
                                position: 'absolute',
                                left: '-8px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                zIndex: 1,
                                cursor: 'pointer',
                                fontSize: '12px',
                                visibility: 'visible',
                                transition: 'visibility 0.5s ease'
                            }}
                        >
                            <FontAwesomeIcon icon={faAngleDoubleLeft} style={{ fontSize: '12px', color: '#000' }} />
                        </div>
                        {!isMinorPaneHidden &&
                            <>
                                <h7 style={{ marginTop: '-10px', transition: 'margin-top 0.5s ease',color:'grey' }}>Search</h7>
                                <FontAwesomeIcon
                                    icon={faThumbtack}
                                    style={{
                                        position: 'absolute',
                                        right: 0,
                                        top: '35%',
                                        transition: 'right 0.5s ease',
                                        cursor: 'pointer',
                                        color: isMinorPanePinned ? '#000' : '#ccc',
                                        transform: `translateY(-50%) ${isMinorPanePinned ? 'rotate(0deg)' : 'rotate(-45deg)'}`//modified by RAMU
                                    }}
                                    onClick={this.handleMinorPanePinToggle}
                                />
                            </>
                        }
                    </div>
                    {isMinorPanePinned &&
                        <div
                            className="resize-handle"
                            style={{
                                position: 'absolute',
                                right: 0,
                                top: 0,
                                bottom: 0,
                                width: '5px',
                                cursor: 'col-resize'
                                
                            }}
                            onMouseDown={this.handleMouseDown}
                        ></div>
                    }
                    {!isMinorPaneHidden &&
                        <MinorPane
                            onRowClick={this.handleRowClick}
                            onClearMajorItem={this.handleClearMajorItem}
                            onMouseEnter={this.handleMouseEnterMinorPane}
                            onMouseLeave={this.handleMouseLeaveMinorPane}
                        />
                    }
                </div>
                <div className="gap" style={{ width: '10px', backgroundColor: '#f0f0f0', borderRight: '1px solid #ccc' }} />
                <div className="major-pane-container" style={{ flex: 1, paddingLeft: '5px' }}>
                    <div style={{ textAlign: 'center', paddingTop: '5px' }}>
                        <h7 style={{ marginTop: '-10px' }}>Detail</h7>
                    </div>
                    <MajorPane selectedItem={selectedItem} />
                </div>

               

                {isFloatingPaneOpen && 
                    <div
                        className="floating-pane-container"
                        style={{
                            width: '300px',
                            border: '1px solid #ccc',
                            marginLeft: '10px',
                            transition: 'width 2.5s ease out'
                        }}
                        onMouseEnter={this.handleMouseEnterFloatingPane}
                        onMouseLeave={this.handleMouseLeaveFloatingPane}
                    >
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



                               
                <div style={{ position: 'absolute', top: '17%', right: '10px', transform: 'translateY(-50%)', zIndex: 1, cursor: 'pointer', fontSize: '12px'  }} onClick={this.handleToggleFloatingPane}>
                    <FontAwesomeIcon icon={faAngleDoubleLeft} style={{ fontSize: '12px', color: '#000' }} />
                </div>
            </div>
        );
    }
}

export default ViewScreen;
