import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ViewScreen from './components/Screens/View/ViewScreen';
import Screen1 from './components/Screens/Actual/Actual';
import Screen2 from './components/Screens/Report/Report';
import Screen3 from './components/Screens/Required/Required';
import Screen4 from './components/Screens/Actual/Actual';
import Screen5 from './components/Screens/Report/Report';
import Screen6 from './components/Screens/Required/Required';
import './styles/App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faAngleDoubleLeft, faThumbtack } from '@fortawesome/free-solid-svg-icons';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedMenuItem: 'view', // Initialize selected menu item
            isUserInfoOpen:false,
            isNotificationOpen: false,           
            isFloatingPaneOpen:false,
            
        };
    }
    
    toggleFloatingPane = () => {
        this.setState(prevState => ({ isFloatingPaneOpen: !prevState.isFloatingPaneOpen }));
    }

   
    handleMenuItemClick = (menuItem) => {
        this.setState({ selectedMenuItem: menuItem }); // Update selected menu item
    };

    handleNotificationToggle = () => {
        this.setState(prevState => ({ isNotificationOpen: !prevState.isNotificationOpen }));
   }

   handleUserInfoToggle = () => {
    this.setState(prevState => ({ isUserInfoOpen: !prevState.isUserInfoOpen }));
}

    render() {
        const { selectedMenuItem, isUserInfoOpen, isNotificationOpen } = this.state;
        const { isFloatingPaneOpen } = this.state;

        return (
            <Router>
                <div className="app">
                    <div className="header"></div>
                    <div className="menu">
                        <div className="menu-items">
                        <img src={require('./logo.png')} alt="" style={{ width: '90px', height: '40px',paddingTop:'5px' }}  />
                            <Link to="/view" className="menu-item" onClick={() => this.handleMenuItemClick('view')}>
                                <span style={{ fontSize: '12px' }}>View</span>
                                <div className={`menu-item-line ${selectedMenuItem === 'view' ? 'selected' : ''}`} style={{ backgroundColor: selectedMenuItem === 'view' ? 'blue' : 'white' }}></div>
                            </Link>
                            <Link to="/screen1" className="menu-item" onClick={() => this.handleMenuItemClick('screen1')}>
                                <span style={{ fontSize: '12px' }}>Required</span>
                                <div className={`menu-item-line ${selectedMenuItem === 'screen1' ? 'selected' : ''}`} style={{ backgroundColor: selectedMenuItem === 'screen1' ? 'blue' : 'white' }}></div>
                            </Link>
                            <Link to="/screen2" className="menu-item" onClick={() => this.handleMenuItemClick('screen2')}>
                                <span style={{ fontSize: '12px' }}>Actual</span>
                                <div className={`menu-item-line ${selectedMenuItem === 'screen2' ? 'selected' : ''}`} style={{ backgroundColor: selectedMenuItem === 'screen2' ? 'blue' : 'white' }}></div>
                             </Link>
                            <Link to="/screen3" className="menu-item" onClick={() => this.handleMenuItemClick('screen3')}>
                                <span style={{ fontSize: '12px' }}>Item Material</span>
                                <div className={`menu-item-line ${selectedMenuItem === 'screen3' ? 'selected' : ''}`} style={{ backgroundColor: selectedMenuItem === 'screen3' ? 'blue' : 'white' }}></div>
                            </Link>
                            <Link to="/screen4" className="menu-item" onClick={() => this.handleMenuItemClick('screen4')}>
                                <span style={{ fontSize: '12px' }}>Report</span>
                                <div className={`menu-item-line ${selectedMenuItem === 'screen4' ? 'selected' : ''}`} style={{ backgroundColor: selectedMenuItem === 'screen4' ? 'blue' : 'white' }}></div>
                            </Link>
                            <Link to="/screen5" className="menu-item" onClick={() => this.handleMenuItemClick('screen5')}>
                                <span style={{ fontSize: '12px' }}>Aggregation</span>
                                <div className={`menu-item-line ${selectedMenuItem === 'screen5' ? 'selected' : ''}`} style={{ backgroundColor: selectedMenuItem === 'screen5' ? 'blue' : 'white' }}></div>
                             </Link>
                            <Link to="/screen6" className="menu-item" onClick={() => this.handleMenuItemClick('screen6')}>
                                <span style={{ fontSize: '12px' }}>DWP Parameter</span>
                                <div className={`menu-item-line ${selectedMenuItem === 'screen6' ? 'selected' : ''}`} style={{ backgroundColor: selectedMenuItem === 'screen6' ? 'blue' : 'white' }}></div>
                            </Link>
                        </div>
                        <div className="menu-end-items">
                        <div className="notification-icon" onClick={this.toggleFloatingPane}>
                            <FontAwesomeIcon icon={faBell} style={{ fontSize: '24px' }} />
                        </div>

                        <div className="user-info">
                            <div className="user-icon" onClick={this.handleUserInfoToggle}>
                                <FontAwesomeIcon icon={faUser}  style={{ fontSize: '24px' }}/>
                            </div>
                            {isUserInfoOpen &&
                                <div className="user-info-dialog">
                                    <div className="header">User Information</div>
                                    <p>Name: John Doe</p>
                                    <p>Employee ID: 12345</p>
                                    <button onClick={this.handleLogout}>Logout</button>
                                </div>
                            }
                        </div>
                        </div>
                      
                    </div>
                    <Routes>
                        <Route path="/view" element={<ViewScreen isFloatingPaneOpen={isFloatingPaneOpen} toggleFloatingPane={this.toggleFloatingPane}/>} />
                        <Route path="/screen1" element={<Screen1 />} />
                        <Route path="/screen2" element={<Screen2 />} />
                        <Route path="/screen3" element={<Screen3 />} />
                        <Route path="/screen4" element={<Screen4 />} />
                        <Route path="/screen5" element={<Screen5 />} />
                        <Route path="/screen6" element={<Screen6 />} />
                    </Routes>
                </div>
            </Router>
        );
    }
}

export default App;
