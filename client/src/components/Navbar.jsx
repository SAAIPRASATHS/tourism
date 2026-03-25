import React from 'react';
import { NavLink } from 'react-router-dom';
import { MapPin, Search, Menu, Map } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = ({ tripCount = 0, onOpenTrip, onToggleSidebar }) => {
    return (
        <nav className="navbar">
            <div className="container">
                <div className="nav-content">
                    <button className="icon-btn" onClick={onToggleSidebar} style={{ marginRight: '1rem' }}>
                        <Menu size={24} />
                    </button>
                    <div className="logo">
                        <NavLink to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                            <motion.div
                                whileHover={{ rotate: 10 }}
                                className="logo-icon"
                            >
                                <MapPin size={28} />
                            </motion.div>
                            <span className="brand-name">
                                Tre<span className="highlight">go</span>
                            </span>
                        </NavLink>
                    </div>

                    <div className="nav-links">
                        <NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink>
                        <NavLink to="/trip-planner" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Map size={16} /> Trip Planner
                            </div>
                        </NavLink>
                    </div>

                    <div className="nav-actions">
                        <button className="icon-btn">
                            <Search size={20} />
                        </button>
                        <button className="primary-btn trip-btn" onClick={onOpenTrip}>
                            Plan Trip
                            {tripCount > 0 && (
                                <span className="trip-badge-count">{tripCount}</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
