import React, { useState } from 'react';
import Modal from '@/components/common/Modal';
import { useAlert } from '@/context/Alert';
import api from "@/utils/axios";
import {IPlan} from "@/types/plan";

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    plan: IPlan | null;
}

const DeleteConfirmationModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onSuccess, plan }) => {
    const [isLoading, setIsLoading] = useState(false);
    const alert = useAlert();

    const handleDelete = async () => {
        if (!plan) return;
        setIsLoading(true);
        try {
            await api.delete(`/plans/${plan.id}`);
            alert("Success", `Plan "${plan.name}" has been deleted.`, "success");
            onSuccess();
            onClose();
        } catch (error: any) {
            alert("Error", error.response?.data?.message || "Failed to delete plan.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Modal title="Delete Plan" onClose={onClose}>
            <p className="text-secondary-400">Are you sure you want to delete the plan <strong className="text-white">{plan?.name}</strong>? This action cannot be undone.</p>
            <div className="flex justify-end gap-4 pt-6">
                <button type="button" onClick={onClose} className="bg-secondary-600 px-4 py-2 rounded-lg">Cancel</button>
                <button onClick={handleDelete} disabled={isLoading} className="bg-red-600 px-4 py-2 rounded-lg disabled:bg-red-800">
                    {isLoading ? 'Deleting...' : 'Delete'}
                </button>
            </div>
        </Modal>
    );
};

export default DeleteConfirmationModal;