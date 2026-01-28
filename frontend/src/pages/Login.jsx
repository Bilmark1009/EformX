import React from 'react';
import LoginForm from '../components/auth/LoginForm';

const Login = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100/50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-cyan/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-400 rounded-3xl flex items-center justify-center shadow-2xl shadow-primary-500/40 rotate-12 hover:rotate-0 transition-transform duration-500">
                        <span className="text-white font-bold text-4xl font-display italic">e</span>
                    </div>
                </div>
                <h1 className="text-center text-4xl font-extrabold font-display bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent mb-3">
                    eFormX
                </h1>
                <p className="text-center text-slate-500 font-medium tracking-tight mb-10 max-w-xs mx-auto">
                    The next generation of high-fidelity data collection.
                </p>
            </div>

            <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
                <div className="glass-card !p-8 sm:!p-10 border-white/40 shadow-2xl">
                    <LoginForm />
                </div>
            </div>
        </div>
    );
};

export default Login;
