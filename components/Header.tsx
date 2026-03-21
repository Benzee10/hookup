
import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
    return (
        <header className="bg-premium-bg/80 backdrop-blur-md sticky top-0 z-50 border-b border-premium-ink/5">
            <div className="container mx-auto px-6 py-6 flex justify-between items-center">
                <Link to="/" className="text-[10px] font-bold text-premium-muted uppercase tracking-[0.5em] hover:text-premium-ink transition-all">
                    Premium Connect
                </Link>
                <Link to="/vip" className="text-[10px] font-bold text-premium-muted uppercase tracking-[0.5em] hover:text-premium-ink transition-all">
                    VIP
                </Link>
            </div>
        </header>
    );
};

export default Header;
