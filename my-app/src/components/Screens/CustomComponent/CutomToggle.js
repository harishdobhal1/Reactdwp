import React from 'react';
import ReactToggle from 'react-toggle';
import './CustomToggle.css'; // Import your custom styles

const CustomToggle = ({ ...props }) => {
  return <ReactToggle {...props} />;
};

export default CustomToggle;
