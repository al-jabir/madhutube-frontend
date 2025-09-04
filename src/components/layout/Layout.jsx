import React, { useState, useEffect } from 'react';
import Header from './Header.jsx';
import Sidebar from './Sidebar.jsx';

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 1024);
            if (window.innerWidth >= 1024) {
                setSidebarOpen(true); // Auto-open sidebar on desktop
            } else {
                setSidebarOpen(false); // Auto-close on mobile
            }
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-youtube-dark">
            <Header onMenuToggle={toggleSidebar} />
            <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

            {/* Overlay for mobile */}
            {sidebarOpen && isMobile && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden transition-opacity duration-300"
                    onClick={closeSidebar}
                />
            )}

            {/* Main content */}
            <main
                className={`pt-16 transition-all duration-300 min-h-screen ${sidebarOpen && !isMobile ? 'lg:ml-64' : 'ml-0'
                    }`}
            >
                <div className="fade-in">
                    {children}
                </div>
            </main>

            {/* Back to top button */}
            <button
                className="fixed bottom-6 right-6 bg-youtube-red hover:bg-youtube-hover text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-40"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                aria-label="Back to top"
            >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
            </button>
        </div>
    );
};

export default Layout;