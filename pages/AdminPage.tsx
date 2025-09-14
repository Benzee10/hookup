import React, { useEffect, useState, useCallback } from 'react';
import { useData } from '../hooks/useData';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import { User, Profile, Payment } from '../types';
import * as api from '../services/api';
import ConfirmationModal from '../components/ConfirmationModal';
import Spinner from '../components/Spinner';

// --- Reusable Modal Component ---
const Modal: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode; title: string }> = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 animate-fade-in" onClick={onClose}>
            <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-2xl relative" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4 pb-4 border-b">
                    <h3 className="text-xl font-bold">{title}</h3>
                    <button onClick={onClose} className="text-2xl font-bold text-slate-500 hover:text-slate-800">&times;</button>
                </div>
                {children}
            </div>
        </div>
    );
};


// --- Admin User Management Component ---
const AdminUserList: React.FC<{ users: User[] }> = ({ users }) => {
    const { grantCredits } = useData();
    const { refreshUser, user: adminUser } = useAuth();
    const { showNotification } = useNotification();
    const [amount, setAmount] = useState<{ [key: string]: number }>({});
    const [processingId, setProcessingId] = useState<string | null>(null);

    const handleCreditChange = (userId: string, value: string) => {
        setAmount(prev => ({ ...prev, [userId]: Number(value) }));
    };

    const handleAddCredits = async (userId: string) => {
        const creditAmount = amount[userId] || 0;
        if (creditAmount <= 0) {
            showNotification("Please enter a positive number of credits.", "error");
            return;
        }
        setProcessingId(userId);
        try {
            await grantCredits(userId, creditAmount, `Admin grant`);
            if (userId === adminUser?.id) {
                await refreshUser();
            }
            showNotification(`Successfully added ${creditAmount} credits.`, "success");
            setAmount(prev => ({ ...prev, [userId]: 0 }));
        } catch (error) {
            showNotification((error as Error).message, "error");
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Manage User Credits</h2>
            <div className="space-y-4">
                {users.map(user => (
                    <div key={user.id} className="p-3 bg-slate-50 rounded-md flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <p className="font-semibold">{user.name} ({user.email})</p>
                            <p className="text-sm text-slate-600">Current Credits: <span className="font-bold">{user.credits}</span></p>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                placeholder="Amount"
                                value={amount[user.id] || ''}
                                onChange={e => handleCreditChange(user.id, e.target.value)}
                                className="w-24 p-2 border rounded-md"
                                disabled={!!processingId}
                            />
                            <button
                                onClick={() => handleAddCredits(user.id)}
                                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:bg-slate-400"
                                disabled={processingId === user.id}
                            >
                                {processingId === user.id ? 'Adding...' : 'Add'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


// --- Admin Payment Request Management Component ---
const AdminPaymentRequests: React.FC<{ payments: Payment[], users: User[] }> = ({ payments, users }) => {
    const { approvePayment, rejectPayment } = useData();
    const { refreshUser, user: adminUser } = useAuth();
    const { showNotification } = useNotification();
    
    const [isProofModalOpen, setIsProofModalOpen] = useState(false);
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [confirmModalState, setConfirmModalState] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {} });
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [proofImageUrl, setProofImageUrl] = useState<string | null>(null);
    const [approvalAmount, setApprovalAmount] = useState('100');
    const [processingId, setProcessingId] = useState<string | null>(null);
    
    const getUserName = (userId: string) => users.find(u => u.id === userId)?.name || 'Unknown User';

    const handleViewProof = async (payment: Payment) => {
        setSelectedPayment(payment);
        setIsProofModalOpen(true);
        setProofImageUrl(null); // Reset while loading
        try {
            const url = await api.getPaymentProofUrl(payment.proofUrl);
            setProofImageUrl(url);
        } catch (error) {
            showNotification("Failed to get proof URL", "error");
            setProofImageUrl(null);
        }
    };

    const handleApproveClick = (payment: Payment) => {
        setSelectedPayment(payment);
        setIsApproveModalOpen(true);
    };

    const handleConfirmApproval = async () => {
        if (!selectedPayment || isNaN(Number(approvalAmount)) || Number(approvalAmount) <= 0) {
            showNotification("Invalid credit amount.", "error");
            return;
        }
        setProcessingId(selectedPayment.id);
        setIsApproveModalOpen(false);
        try {
            await approvePayment(selectedPayment.id, Number(approvalAmount));
            if (selectedPayment.userId === adminUser?.id) {
                await refreshUser();
            }
            showNotification("Payment approved and credits awarded.", "success");
        } catch (error) {
            showNotification((error as Error).message, "error");
        } finally {
            setProcessingId(null);
            setSelectedPayment(null);
        }
    };

    const handleRejectClick = (payment: Payment) => {
        setConfirmModalState({
            isOpen: true,
            title: "Reject Payment",
            message: `Are you sure you want to reject the payment from ${getUserName(payment.userId)}? This action cannot be undone.`,
            onConfirm: () => handleConfirmReject(payment.id),
        });
    };

    const handleConfirmReject = async (paymentId: string) => {
        setProcessingId(paymentId);
        setConfirmModalState({ isOpen: false, title: '', message: '', onConfirm: () => {} });
        try {
            await rejectPayment(paymentId);
            showNotification("Payment has been rejected.", "success");
        } catch (error) {
            showNotification((error as Error).message, "error");
        } finally {
            setProcessingId(null);
        }
    };

    const pendingPayments = payments.filter(p => p.status === 'pending');

    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Pending Payment Requests ({pendingPayments.length})</h2>
                <div className="space-y-4 max-h-[32rem] overflow-y-auto pr-2">
                    {pendingPayments.length > 0 ? pendingPayments.map(payment => (
                        <div key={payment.id} className="p-4 bg-slate-50 rounded-md border border-slate-200">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p><strong>User:</strong> {getUserName(payment.userId)}</p>
                                    <p><strong>Transaction ID:</strong> {payment.transactionId}</p>
                                    <p><strong>Date:</strong> {new Date(payment.timestamp).toLocaleString()}</p>
                                    <p>
                                        <strong>Proof:</strong>{' '}
                                        <button onClick={() => handleViewProof(payment)} className="text-blue-500 underline hover:text-blue-700">
                                            View Proof
                                        </button>
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 mt-2 flex-shrink-0">
                                    <button 
                                        onClick={() => handleApproveClick(payment)} 
                                        disabled={!!processingId}
                                        className="bg-green-500 text-white px-3 py-1 text-sm rounded-md hover:bg-green-600 disabled:bg-slate-400">
                                        Approve
                                    </button>
                                    <button 
                                        onClick={() => handleRejectClick(payment)}
                                        disabled={!!processingId}
                                        className="bg-red-500 text-white px-3 py-1 text-sm rounded-md hover:bg-red-600 disabled:bg-slate-400">
                                        Reject
                                    </button>
                                </div>
                            </div>
                            {processingId === payment.id && (
                                <div className="mt-2 text-sm text-slate-600 animate-pulse">Processing...</div>
                            )}
                        </div>
                    )) : <p className="text-slate-500">No pending requests.</p>}
                </div>
            </div>

            <Modal title="Payment Proof" isOpen={isProofModalOpen} onClose={() => setIsProofModalOpen(false)}>
                <p className="text-slate-600 mb-4">Viewing proof for transaction: {selectedPayment?.transactionId}</p>
                {proofImageUrl ? (
                     <img src={proofImageUrl} alt="Payment Proof" className="rounded-lg w-full" />
                ) : (
                    <div className="flex justify-center items-center h-48">
                      <Spinner />
                    </div>
                )}
            </Modal>
            
            <Modal title="Approve Payment" isOpen={isApproveModalOpen} onClose={() => setIsApproveModalOpen(false)}>
                <div className="space-y-4">
                     <div>
                        <label htmlFor="creditAmount" className="block text-sm font-medium text-gray-700">Credits to Award</label>
                        <input
                            type="number"
                            id="creditAmount"
                            value={approvalAmount}
                            onChange={(e) => setApprovalAmount(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
                        />
                    </div>
                    <div className="flex justify-end gap-3">
                        <button onClick={() => setIsApproveModalOpen(false)} className="bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300">
                            Cancel
                        </button>
                        <button onClick={handleConfirmApproval} className="bg-brand-secondary text-white font-semibold py-2 px-4 rounded-lg hover:bg-emerald-600">
                           Confirm Approval
                        </button>
                    </div>
                </div>
            </Modal>
            <ConfirmationModal
                isOpen={confirmModalState.isOpen}
                onClose={() => setConfirmModalState({ isOpen: false, title: '', message: '', onConfirm: () => {} })}
                onConfirm={confirmModalState.onConfirm}
                title={confirmModalState.title}
                message={confirmModalState.message}
                isDestructive={true}
                confirmText="Yes, Reject"
            />
        </>
    );
};


// --- Admin Profile Management Component ---
const AdminProfileManager: React.FC<{ profiles: Profile[] }> = ({ profiles }) => {
    const { addProfile, updateProfile, deleteProfile } = useData();
    const { showNotification } = useNotification();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
    const [formData, setFormData] = useState<Partial<Omit<Profile, 'id' | 'created_at'>>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [confirmModalState, setConfirmModalState] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {} });

    const openForm = (profile: Profile | null) => {
        setEditingProfile(profile);
        if (profile) {
            const { id, created_at, ...editableData } = profile;
            setFormData(editableData);
        } else {
            setFormData({
                name: '', location: '', age: 25, categories: [], description: '', premiumContact: '', gallery: [], unlockCost: 10
            });
        }
        setIsFormOpen(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'age' || name === 'unlockCost' ? Number(value) : value }));
    };

    const handleArrayChange = (name: 'categories', value: string) => {
        setFormData(prev => ({ ...prev, [name]: value.split(',').map(item => item.trim()).filter(Boolean) }))
    };

    const handleGalleryChange = (index: number, value: string) => {
        setFormData(prev => {
            const newGallery = [...(prev.gallery || [])];
            for (let i = newGallery.length; i <= index; i++) {
                newGallery[i] = '';
            }
            newGallery[index] = value;
            return { ...prev, gallery: newGallery.slice(0, 3) };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const galleryUrls = (formData.gallery || [])
              .map(url => url ? url.trim() : '')
              .filter(Boolean);

            if (galleryUrls.length === 0) {
                showNotification("A Profile Picture URL is required.", "error");
                setIsSaving(false);
                return;
            }
            
            const dataForApi = {
                name: formData.name || '',
                location: formData.location || '',
                age: Number(formData.age) || 0,
                categories: formData.categories || [],
                description: formData.description || '',
                premiumContact: formData.premiumContact || '',
                gallery: galleryUrls,
                unlockCost: Number(formData.unlockCost) || 10,
            };

            // Double check required fields, since form's `required` can be bypassed.
            if (!dataForApi.name || !dataForApi.location || !dataForApi.premiumContact) {
                showNotification("Please fill all required fields: Name, Location, and Premium Contact.", "error");
                setIsSaving(false);
                return;
            }

            if (editingProfile) {
                await updateProfile({ ...editingProfile, ...dataForApi });
                showNotification("Profile updated successfully.", "success");
            } else {
                await addProfile(dataForApi);
                showNotification("New profile added successfully.", "success");
            }
            setIsFormOpen(false);
            setEditingProfile(null);
        } catch (error) {
            const message = error instanceof Error ? error.message : "An unexpected error occurred.";
            showNotification(message, "error");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = (profile: Profile) => {
        setConfirmModalState({
            isOpen: true,
            title: "Delete Profile",
            message: `Are you sure you want to delete the profile for ${profile.name}? This action cannot be undone.`,
            onConfirm: () => handleConfirmDelete(profile.id),
        });
    };
    
    const handleConfirmDelete = async (profileId: string) => {
        setConfirmModalState({ isOpen: false, title: '', message: '', onConfirm: () => {} });
        try {
            await deleteProfile(profileId);
            showNotification("Profile deleted successfully.", "success");
        } catch(error) {
            const message = error instanceof Error ? error.message : "An unexpected error occurred.";
            showNotification(message, "error");
        }
    }


    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Manage Profiles</h2>
                <button onClick={() => openForm(null)} className="bg-brand-primary text-white px-4 py-2 rounded-md hover:bg-indigo-700">Add New Profile</button>
            </div>

            <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingProfile ? 'Edit Profile' : 'Add New Profile'}>
                <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto p-1">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input id="name" name="name" placeholder="e.g., Alice Johnson" value={formData.name || ''} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md" required />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                           <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                           <input id="location" name="location" placeholder="e.g., New York, USA" value={formData.location || ''} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md" required />
                        </div>
                        <div>
                           <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
                           <input id="age" name="age" type="number" placeholder="e.g., 34" value={formData.age || ''} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md" required />
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="categories" className="block text-sm font-medium text-gray-700">Service Categories</label>
                        <input id="categories" name="categories" placeholder="e.g., Web Development, UI/UX Design, React" value={formData.categories?.join(', ') || ''} onChange={(e) => handleArrayChange('categories', e.target.value)} className="mt-1 w-full p-2 border rounded-md" />
                        <p className="text-xs text-slate-500 mt-1">Separate categories with a comma.</p>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Public Description</label>
                        <textarea id="description" name="description" placeholder="A compelling, professional summary of the provider's skills and services..." value={formData.description || ''} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md" rows={4}></textarea>
                    </div>
                    
                    <div className="pt-4 mt-4 border-t">
                        <h4 className="text-md font-semibold text-slate-600 mb-2">Private & Meta Data</h4>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="premiumContact" className="block text-sm font-medium text-gray-700">Premium Contact Info (Hidden)</label>
                                <input id="premiumContact" name="premiumContact" placeholder="e.g., WhatsApp: +1234567890" value={formData.premiumContact || ''} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md" required />
                                <p className="text-xs text-slate-500 mt-1">This is shown to users after unlock. For a clickable icon, use format: `whatsapp: +123456789`</p>
                            </div>

                            <div>
                                <label htmlFor="gallery1" className="block text-sm font-medium text-gray-700">Profile Picture URL (Required)</label>
                                <input id="gallery1" name="gallery1" type="url" placeholder="https://example.com/profile.jpg" value={formData.gallery?.[0] || ''} onChange={(e) => handleGalleryChange(0, e.target.value)} className="mt-1 w-full p-2 border rounded-md" required />
                            </div>
                            <div>
                                <label htmlFor="gallery2" className="block text-sm font-medium text-gray-700">Gallery Image 2 URL (Optional)</label>
                                <input id="gallery2" name="gallery2" type="url" placeholder="https://example.com/image2.jpg" value={formData.gallery?.[1] || ''} onChange={(e) => handleGalleryChange(1, e.target.value)} className="mt-1 w-full p-2 border rounded-md" />
                            </div>
                            <div>
                                <label htmlFor="gallery3" className="block text-sm font-medium text-gray-700">Gallery Image 3 URL (Optional)</label>
                                <input id="gallery3" name="gallery3" type="url" placeholder="https://example.com/image3.jpg" value={formData.gallery?.[2] || ''} onChange={(e) => handleGalleryChange(2, e.target.value)} className="mt-1 w-full p-2 border rounded-md" />
                            </div>

                            <div>
                               <label htmlFor="unlockCost" className="block text-sm font-medium text-gray-700">Unlock Cost (in credits)</label>
                               <input id="unlockCost" name="unlockCost" type="number" placeholder="e.g., 50" value={formData.unlockCost || ''} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md" required />
                            </div>
                        </div>
                    </div>
                    
                    <div className="pt-6">
                        <button type="submit" disabled={isSaving} className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-md hover:bg-green-600 disabled:bg-slate-400">
                            {isSaving ? 'Saving...' : 'Save Profile'}
                        </button>
                    </div>
                </form>
            </Modal>
            
            <ConfirmationModal
                isOpen={confirmModalState.isOpen}
                onClose={() => setConfirmModalState({ isOpen: false, title: '', message: '', onConfirm: () => {} })}
                onConfirm={confirmModalState.onConfirm}
                title={confirmModalState.title}
                message={confirmModalState.message}
                isDestructive={true}
                confirmText="Yes, Delete"
            />

            <div className="space-y-2">
                {profiles.map(profile => (
                    <div key={profile.id} className="p-3 bg-slate-50 rounded-md flex justify-between items-center">
                        <p className="font-semibold">{profile.name}</p>
                        <div className="flex gap-2">
                            <button onClick={() => openForm(profile)} className="bg-blue-500 text-white px-3 py-1 text-sm rounded-md hover:bg-blue-600">Edit</button>
                            <button onClick={() => handleDelete(profile)} className="bg-red-500 text-white px-3 py-1 text-sm rounded-md hover:bg-red-600">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
};


// --- Main Admin Page Component ---
const AdminPage: React.FC = () => {
    const { user } = useAuth();
    const { allUsers, fetchAllUsers, payments, fetchPayments, profiles } = useData();
    const [activeTab, setActiveTab] = useState('users');
    const [isLoading, setIsLoading] = useState(true);

    const loadAdminData = useCallback(async () => {
        setIsLoading(true);
        try {
            await Promise.all([
                fetchAllUsers(),
                fetchPayments()
            ]);
        } catch (error) {
            console.error("Failed to load admin data", error);
        } finally {
            setIsLoading(false);
        }
    }, [fetchAllUsers, fetchPayments]);

    useEffect(() => {
        loadAdminData();
    }, [loadAdminData]);
    
    if (!user) return null;

    return (
        <div className="max-w-6xl mx-auto animate-fade-in">
            <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
            <p className="text-slate-500 mb-8">Manage users, payments, and provider profiles.</p>

            <div className="mb-8 border-b border-slate-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button onClick={() => setActiveTab('users')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'users' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>User Management</button>
                    <button onClick={() => setActiveTab('payments')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'payments' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>Payment Requests</button>
                    <button onClick={() => setActiveTab('profiles')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'profiles' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>Profile Management</button>
                </nav>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Spinner />
                </div>
            ) : (
                <div>
                    {activeTab === 'users' && <AdminUserList users={allUsers} />}
                    {activeTab === 'payments' && <AdminPaymentRequests payments={payments} users={allUsers} />}
                    {activeTab === 'profiles' && <AdminProfileManager profiles={profiles} />}
                </div>
            )}
        </div>
    );
};

export default AdminPage;
