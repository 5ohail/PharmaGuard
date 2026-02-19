import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl glass-card rounded-2xl px-8 py-4 flex justify-between items-center z-50">
        <h1 className="font-black tracking-tighter text-xl">PHARMA<span className="text-blue-600">GUARD</span></h1>
        <div className="flex gap-8 text-xs font-bold uppercase tracking-widest">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <Link to="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link>
            <Link to="/library" className="hover:text-blue-600 transition-colors">Library</Link>
            <Link to="/logs" className="hover:text-blue-600 transition-colors">Logs</Link>
            <Link to="/security" className="hover:text-blue-600 transition-colors">Security</Link>
        </div>
    </nav>
);

export default Navbar;