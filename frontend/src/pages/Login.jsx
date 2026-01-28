import React from 'react';
import LoginForm from '../components/auth/LoginForm';

const Login = () => {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="scanline"></div>
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full filter blur-[120px] opacity-30"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-500/5 rounded-full filter blur-[120px] opacity-30"></div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
                <div className="flex justify-center mb-8">
                    <div className="w-20 h-20 bg-primary-600 rounded-[2rem] flex items-center justify-center shadow-glow shadow-primary-500/40 rotate-12 hover:rotate-0 transition-all duration-700 group">
                        <span className="text-white font-black text-5xl font-display italic group-hover:scale-110 transition-transform">e</span>
                    </div>
                </div>
                <h1 className="text-center text-5xl font-black tracking-tighter text-white mb-4 font-display">
                    eForm<span className="text-primary-500 italic">X</span>
                </h1>
                <p className="text-center text-slate-500 font-mono text-[10px] uppercase tracking-[0.3em] font-black mb-12 max-w-xs mx-auto">
                    Cognitive Data Infrastructure
                </p>
            </div>

            <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
                <div className="glass-card tech-border !p-8 sm:!p-12">
                    <LoginForm />
                </div>
            </div>

            <div className="mt-12 text-center relative z-10">
                <p className="text-[10px] font-bold text-slate-700 uppercase tracking-widest font-mono">
                    System Version 2.0.4-Stable
                </p>
            </div>
        </div>
    );
};

export default Login;

