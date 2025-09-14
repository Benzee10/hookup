
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useData';
import { useNotification } from '../hooks/useNotification';

const BuyCreditsPage: React.FC = () => {
    const { user } = useAuth();
    const { addPaymentRequest } = useData();
    const { showNotification } = useNotification();
    const [transactionId, setTransactionId] = useState('');
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setProofFile(e.target.files[0]);
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !proofFile || !transactionId) {
            showNotification('Please fill all fields and upload a proof of payment.', 'error');
            return;
        }
        setIsSubmitting(true);
        try {
            await addPaymentRequest(user.id, transactionId, proofFile);
            showNotification('Your payment proof has been submitted! Credits will be added after admin review.', 'success');
            setTransactionId('');
            setProofFile(null);
            // Reset file input visually
            const fileInput = document.getElementById('proof') as HTMLInputElement;
            if(fileInput) fileInput.value = '';
        } catch (error) {
            showNotification((error as Error).message, 'error');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="max-w-4xl mx-auto animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold mb-4">Buy Credits</h1>
                <p className="text-slate-600 mb-6">Follow the instructions below to make a payment. Once complete, submit your proof of payment using the form.</p>
                <div className="space-y-4 text-slate-700 p-4 border rounded-md bg-slate-50">
                    <h3 className="font-semibold text-lg">Bank Transfer Details</h3>
                    <p><strong>Bank Name:</strong> Global Digital Bank</p>
                    <p><strong>Account Number:</strong> 123-456-7890</p>
                    <p><strong>Account Name:</strong> CrediMarket Inc.</p>
                    <p><strong>Reference:</strong> Your email address</p>
                </div>
                <div className="mt-4 text-sm text-slate-500">
                    <p><strong>Note:</strong> Credits are added manually by an admin after payment verification. This may take up to 24 hours.</p>
                </div>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6">Submit Payment Proof</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <label htmlFor="transactionId" className="block text-sm font-medium text-gray-700">Transaction ID / Reference Number</label>
                        <input
                            type="text"
                            id="transactionId"
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
                        />
                    </div>
                    <div>
                        <label htmlFor="proof" className="block text-sm font-medium text-gray-700">Payment Screenshot/Proof</label>
                        <input
                            type="file"
                            id="proof"
                            onChange={handleFileChange}
                            accept="image/png, image/jpeg, image/gif"
                            required
                            className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-brand-primary hover:file:bg-indigo-100"
                        />
                         {proofFile && <p className="text-xs text-slate-500 mt-1">{proofFile.name}</p>}
                    </div>
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-brand-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition disabled:bg-slate-400"
                    >
                       {isSubmitting ? 'Submitting...' : 'Submit Proof'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BuyCreditsPage;