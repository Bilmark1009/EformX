import React from 'react';
import Navbar from './Navbar';

const DashboardLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans cursor-default relative overflow-x-hidden">
            <div className="scanline opacity-[0.03]"></div>
            <Navbar />
            <main className="dashboard-container relative z-10">
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;

