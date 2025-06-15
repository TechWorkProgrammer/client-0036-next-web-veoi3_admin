import React, {useState, useEffect} from 'react';
import Modal from '@/components/common/Modal';
import {useAlert} from '@/context/Alert';
import {IPlan} from '@/types/plan';
import api from "@/utils/axios";

interface PlanFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData: IPlan | null;
}

const PlanFormModal: React.FC<PlanFormModalProps> = ({isOpen, onClose, onSuccess, initialData}) => {
    const [formData, setFormData] = useState({name: '', description: '', tokens: 0, price: "0"});
    const [isLoading, setIsLoading] = useState(false);
    const alert = useAlert();

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                description: initialData.description || '',
                tokens: initialData.tokens,
                price: initialData.price,
            });
        } else {
            setFormData({name: '', description: '', tokens: 0, price: "0"});
        }
    }, [initialData, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (initialData) {
                await api.put(`/plans/${initialData.id}`, formData);
                alert("Success", "Plan updated successfully.", "success");
            } else {
                await api.post('/plans', formData);
                alert("Success", "Plan created successfully.", "success");
            }
            onSuccess();
            onClose();
        } catch (error: any) {
            alert("Error", error.response?.data?.message || "An error occurred.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Modal title={initialData ? 'Edit Plan' : 'Add New Plan'} onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-secondary-400 mb-1">Plan
                        Name</label>
                    <input type="text" id="name" value={formData.name}
                           onChange={e => setFormData({...formData, name: e.target.value})}
                           className="block w-full bg-primary-700 rounded-md p-2 text-white" required/>
                </div>
                <div>
                    <label htmlFor="tokens" className="block text-sm font-medium text-secondary-400 mb-1">Tokens</label>
                    <input type="number" id="tokens" value={formData.tokens}
                           onChange={e => setFormData({...formData, tokens: Number(e.target.value)})}
                           className="block w-full bg-primary-700 rounded-md p-2 text-white" required/>
                </div>
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-secondary-400 mb-1">Price
                        (USD)</label>
                    <input type="number" id="price" step="0.01" value={formData.price}
                           onChange={e => setFormData({...formData, price: (e.target.value)})}
                           className="block w-full bg-primary-700 rounded-md p-2 text-white" required/>
                </div>
                <div>
                    <label htmlFor="description"
                           className="block text-sm font-medium text-secondary-400 mb-1">Description</label>
                    <textarea id="description" value={formData.description}
                              onChange={e => setFormData({...formData, description: e.target.value})}
                              className="block w-full bg-primary-700 rounded-md p-2 text-white" rows={3}></textarea>
                </div>
                <div className="flex justify-end gap-4 pt-4">
                    <button type="button" onClick={onClose} className="bg-secondary-600 px-4 py-2 rounded-lg">Cancel
                    </button>
                    <button type="submit" disabled={isLoading}
                            className="bg-accent-500 text-black px-4 py-2 rounded-lg disabled:bg-primary-500">
                        {isLoading ? 'Saving...' : 'Save Plan'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default PlanFormModal;