
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const CreditChip: React.FC<{ credits: number }> = ({ credits }) => (
    <div className="flex items-center space-x-2 bg-brand-secondary text-white text-sm font-bold px-3 py-1 rounded-full shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.533 6.956a.75.75 0 01.932-.533c.3.09.533.364.533.679v1.624c.345-.05.696-.075 1.05-.075 1.933 0 3.5 1.567 3.5 3.5s-1.567 3.5-3.5 3.5c-1.28 0-2.42-.686-3.055-1.722a.75.75 0 011.238-.853A2.001 2.001 0 0011.05 15c1.104 0 2-.896 2-2s-.896-2-2-2h-1.05v1.285a.75.75 0 01-1.5 0V8.875a.75.75 0 01.533-.72z" />
        </svg>
        <span>{credits} {credits === 1 ? 'Credit' : 'Credits'}</span>
    </div>
);


const Header: React.FC = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
        navigate('/');
    };
    
    const closeMenu = () => setIsMenuOpen(false);

    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `text-slate-600 hover:text-brand-primary transition-colors ${isActive ? 'font-bold text-brand-primary' : ''}`;
    
    const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
        `block py-2 px-3 rounded-md text-base font-medium ${isActive ? 'bg-indigo-50 text-brand-primary' : 'text-slate-600 hover:bg-slate-100 hover:text-brand-primary'}`;


    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" onClick={closeMenu} className="text-2xl font-bold text-brand-primary">
                    CrediMarket
                </Link>
                
                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center space-x-6">
                    <NavLink to="/" className={navLinkClass}>Home</NavLink>
                    {user && <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>}
                    {isAdmin && <NavLink to="/admin" className={navLinkClass}>Admin Panel</NavLink>}
                </nav>

                {/* Desktop User Actions */}
                <div className="hidden md:flex items-center space-x-4">
                    {user ? (
                        <>
                            <CreditChip credits={user.credits} />
                            <button
                                onClick={handleLogout}
                                className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold py-2 px-4 rounded-lg transition-colors"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-slate-600 hover:text-brand-primary font-medium transition-colors">
                                Log In
                            </Link>
                            <Link
                                to="/signup"
                                className="bg-brand-primary hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button & Credit Chip */}
                <div className="md:hidden flex items-center">
                    {user && <CreditChip credits={user.credits} />}
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="ml-4 p-2 rounded-md text-slate-600 hover:text-brand-primary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-primary">
                        <span className="sr-only">Open main menu</span>
                        {isMenuOpen ? (
                             <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden animate-fade-in border-t border-slate-200">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                         <NavLink to="/" className={mobileNavLinkClass} onClick={closeMenu}>Home</NavLink>
                        {user && <NavLink to="/dashboard" className={mobileNavLinkClass} onClick={closeMenu}>Dashboard</NavLink>}
                        {isAdmin && <NavLink to="/admin" className={mobileNavLinkClass} onClick={closeMenu}>Admin Panel</NavLink>}
                    </div>
                    <div className="pt-4 pb-3 border-t border-slate-200">
                         <div className="px-5">
                            {user ? (
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left block bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold py-2 px-3 rounded-lg transition-colors"
                                >
                                    Logout
                                </button>
                            ) : (
                                <div className="space-y-2">
                                    <Link 
                                        to="/login"
                                        onClick={closeMenu}
                                        className="block w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium py-2 px-4 rounded-lg transition-colors"
                                    >
                                        Log In
                                    </Link>
                                    <Link
                                        to="/signup"
                                        onClick={closeMenu}
                                        className="block w-full text-center bg-brand-primary hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
