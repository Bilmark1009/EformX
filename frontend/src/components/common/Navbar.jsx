import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="sticky top-0 z-50 glass border-b border-slate-800/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <Link to="/dashboard" className="flex items-center space-x-3 group">
                            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 group-hover:scale-105 transition-all duration-300 relative overflow-hidden">
                                <span className="text-white font-bold text-2xl font-display italic z-10">e</span>
                                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                                <div className="scanline"></div>
                            </div>
                            <span className="text-2xl font-bold font-display tracking-tight text-white">
                                eForm<span className="text-primary-500">X</span>
                            </span>
                        </Link>

                        <div className="hidden sm:ml-12 sm:flex sm:space-x-10">
                            {[
                                { name: 'Dashboard', path: '/dashboard' },
                                { name: 'Responses', path: '/responses' },
                                { name: 'Profile', path: '/profile' }
                            ].map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`relative inline-flex items-center px-1 pt-1 text-sm font-bold tracking-wider uppercase transition-colors duration-300 ${isActive(link.path) ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                                        }`}
                                >
                                    {link.name}
                                    {isActive(link.path) && (
                                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 shadow-[0_0_10px_#0ea5e9]"></span>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-xs font-bold font-mono tracking-tighter text-primary-500 uppercase flex items-center">
                                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-1.5 animate-pulse"></span>
                                Online
                            </span>
                            <span className="text-sm font-bold text-white">{user?.name}</span>
                        </div>
                        <button
                            onClick={logout}
                            className="btn-secondary !py-2 !px-5 text-xs font-bold tracking-widest uppercase hover:text-rose-400 hover:border-rose-900 transition-all"
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

