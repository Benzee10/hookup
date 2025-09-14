import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useData';
import { Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    const { userUnlocks, profiles, userTransactions } = useData();

    const getProfileName = (profileId: string): string => {
        return profiles.find(p => p.id === profileId)?.name || 'Unknown Profile';
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto animate-fade-in">
            <h1 className="text-4xl font-bold mb-8">Welcome, {user.name}!</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center">
                    <div>
                        <p className="text-slate-500 text-sm">Available Credits</p>
                        <p className="text-4xl font-bold text-brand-primary">{user.credits}</p>
                    </div>
                    <Link to="/buy-credits" className="bg-brand-secondary text-white font-semibold py-2 px-4 rounded-lg hover:bg-emerald-600 transition">
                        Buy More Credits
                    </Link>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <p className="text-slate-500 text-sm">Profiles Unlocked</p>
                    <p className="text-4xl font-bold">{userUnlocks.length}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">Unlock History</h2>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {userUnlocks.length > 0 ? userUnlocks.sort((a,b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime()).map(unlock => (
                            <div key={unlock.profileId} className="p-3 bg-slate-50 rounded-md flex justify-between items-center">
                                <Link to={`/profile/${unlock.profileId}`} className="font-semibold text-brand-primary hover:underline">
                                    {getProfileName(unlock.profileId)}
                                </Link>
                                <span className="text-sm text-slate-500">{new Date(unlock.unlockedAt).toLocaleDateString()}</span>
                            </div>
                        )) : <p className="text-slate-500">You haven't unlocked any profiles yet.</p>}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">Credit Transactions</h2>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                         {userTransactions.length > 0 ? userTransactions.map(tx => (
                            <div key={tx.id} className="p-3 bg-slate-50 rounded-md flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{tx.description}</p>
                                    <p className="text-sm text-slate-500">{new Date(tx.timestamp).toLocaleString()}</p>
                                </div>
                                <span className={`font-bold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {tx.amount > 0 ? '+' : ''}{tx.amount}
                                </span>
                            </div>
                         )) : <p className="text-slate-500">No transactions recorded.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;