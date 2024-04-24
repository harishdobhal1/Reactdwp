import React, { Component } from 'react';
import './ResizablePane.css';

class ResizablePane extends Component {
    constructor(props) {
        super(props);
        this.state = {
            resizing: false,
            startX: 0,
            startWidth: props.initialWidth,
        };
    }

    handleMouseDown = (event) => {
        this.setState({
            resizing: true,
            startX: event.clientX,
        });
        document.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('mouseup', this.handleMouseUp);
    }

    handleMouseMove = (event) => {
        if (this.state.resizing) {
            const newWidth = this.state.startWidth + (event.clientX - this.state.startX);
            this.setState({ startWidth: newWidth });
            this.props.onResize(newWidth);
        }
    }

    handleMouseUp = () => {
        this.setState({ resizing: false });
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);
    }

    render() {
        const { children, className } = this.props;
        const { startWidth } = this.state;

        return (
            <div
                className={`resizable-pane ${className}`}
                style={{ width: startWidth }}
            >
                {children}
                <div
                    className="resize-handle"
                    onMouseDown={this.handleMouseDown}
                />
            </div>
        );
    }
}

export default ResizablePane;
