import React from 'react';
import Navbar from './Navbar';

const DashboardLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans cursor-default">
            <Navbar />
            <main className="dashboard-container">
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;
