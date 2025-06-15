import React, { useState, useEffect } from 'react';
import Modal from '@/components/common/Modal';
import { useAlert } from '@/context/Alert';
import Button from '@/components/common/Button';
import api from "@/utils/axios";
import {IPayment} from "@/types/payment";

interface PaymentStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    payment: IPayment | null;
}

const PaymentStatusModal: React.FC<PaymentStatusModalProps> = ({ isOpen, onClose, onSuccess, payment }) => {
    const [newStatus, setNewStatus] = useState(payment?.status || 'PENDING');
    const [tokensToAdd, setTokensToAdd] = useState(0);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const alert = useAlert();

    useEffect(() => {
        if (payment) {
            setNewStatus(payment.status);
            setTokensToAdd(payment.itemPack?.tokens || payment.customTokenAmount || 0);
            setMessage('');
        }
    }, [payment]);

    const handleSave = async () => {
        if (!payment) return;
        setIsLoading(true);
        try {
            await api.put(`/admin/payments/${payment.id}/status`, {
                status: newStatus,
                tokensToAdd: newStatus === 'CONFIRMED' ? tokensToAdd : undefined,
                message: newStatus === 'REJECTED' ? message : undefined,
            });
            alert("Success", `Payment status updated to ${newStatus}`, "success");
            onSuccess();
            onClose();
        } catch (error: any) {
            alert("Error", error.response?.data?.message || "Failed to update status.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen || !payment) return null;

    return (
        <Modal title={`Manage Payment #${payment.id.slice(0, 8)}`} onClose={onClose}>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-secondary-400 mb-1">Set New Status</label>
                    <select value={newStatus} onChange={e => setNewStatus(e.target.value as IPayment['status'])} className="block w-full bg-background-light border border-secondary-200 rounded-md py-2 px-3 text-white">
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="REJECTED">Rejected</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>

                {newStatus === 'CONFIRMED' && (
                    <div>
                        <label className="block text-sm font-medium text-secondary-400 mb-1">Tokens to Add</label>
                        <input type="number" value={tokensToAdd} onChange={e => setTokensToAdd(Number(e.target.value))} className="block w-full bg-background-light border border-secondary-200 rounded-md py-2 px-3 text-white"/>
                    </div>
                )}

                {newStatus === 'REJECTED' && (
                    <div>
                        <label className="block text-sm font-medium text-secondary-400 mb-1">Rejection Reason (Optional)</label>
                        <textarea value={message} onChange={e => setMessage(e.target.value)} rows={3} className="block w-full bg-background-light border border-secondary-200 rounded-md py-2 px-3 text-white"></textarea>
                    </div>
                )}

                <div className="flex justify-end gap-4 pt-4">
                    <Button label="Cancel" onClick={onClose} color="secondary" />
                    <Button label={isLoading ? 'Saving...' : 'Save Status'} onClick={handleSave} disabled={isLoading} />
                </div>
            </div>
        </Modal>
    );
};

export default PaymentStatusModal;