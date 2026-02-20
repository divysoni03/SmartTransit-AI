import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Bus, Menu, X, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/useStore';

export const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { isAuthenticated, user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
                ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm'
                : 'bg-transparent'
                }`}
        >
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
                        <Bus className="h-6 w-6 text-primary" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
                        SmartTransit<span className="text-primary tracking-normal">.AI</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    <a href="#problem" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">The Challenge</a>
                    <a href="#solution" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">How it Works</a>
                    <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">Features</a>
                    <a href="#preview" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">Demo</a>
                    <Link to="/history" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">History</Link>
                    <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
                    
                    {isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 pl-2 pr-3 py-1.5 rounded-full">
                                <div className="bg-primary/10 text-primary p-1 rounded-full">
                                    <User className="h-3.5 w-3.5" />
                                </div>
                                {user?.name.split(' ')[0]}
                            </div>
                            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <Link to="/login">
                            <Button variant="ghost" className="hidden lg:flex">Sign In</Button>
                        </Link>
                    )}
                    
                    <Link to="/optimize">
                        <Button>Start Planning</Button>
                    </Link>
                </nav>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-slate-600 dark:text-slate-300"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 overflow-hidden"
                    >
                        <div className="flex flex-col px-6 py-4 gap-4">
                            <a href="#problem" className="text-sm font-medium text-slate-600" onClick={() => setMobileMenuOpen(false)}>The Challenge</a>
                            <a href="#solution" className="text-sm font-medium text-slate-600" onClick={() => setMobileMenuOpen(false)}>How it Works</a>
                            <a href="#features" className="text-sm font-medium text-slate-600" onClick={() => setMobileMenuOpen(false)}>Features</a>
                            <a href="#preview" className="text-sm font-medium text-slate-600" onClick={() => setMobileMenuOpen(false)}>Demo</a>
                            <Link to="/history" className="text-sm font-medium text-slate-600" onClick={() => setMobileMenuOpen(false)}>History</Link>
                            <hr className="border-slate-100 dark:border-slate-800" />
                            {isAuthenticated ? (
                                <>
                                    <div className="flex items-center gap-2 py-2 px-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                        <User className="h-4 w-4 text-slate-500" />
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{user?.name}</span>
                                    </div>
                                    <Button variant="outline" className="w-full justify-center text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-red-900/50 dark:hover:bg-red-900/20" onClick={() => { handleLogout(); setMobileMenuOpen(false); }}>
                                        <LogOut className="h-4 w-4 mr-2" /> Sign Out
                                    </Button>
                                </>
                            ) : (
                                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                                    <Button variant="outline" className="w-full justify-center">Sign In</Button>
                                </Link>
                            )}
                            <Link to="/optimize" onClick={() => setMobileMenuOpen(false)}>
                                <Button className="w-full justify-center">Start Planning</Button>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};
