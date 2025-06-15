import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAlert } from '@/context/Alert';
import Loader from '@/components/common/Loader';
import { FiEdit, FiLink } from 'react-icons/fi';
import { format } from 'date-fns';
import {IPayment} from "@/types/payment";
import api from "@/utils/axios";
import Pagination from "@/components/common/Pagination";
import PaymentStatusModal from "@/components/payment/PaymentStatusModal";


const statusColors: Record<IPayment['status'], string> = {
    PENDING: 'bg-yellow-500/20 text-yellow-400',
    CONFIRMED: 'bg-green-500/20 text-green-400',
    REJECTED: 'bg-red-500/20 text-red-400',
    CANCELLED: 'bg-gray-500/20 text-gray-400',
};

const PaymentTable: React.FC = () => {
    const [payments, setPayments] = useState<IPayment[]>([]);
    const [pagination, setPagination] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({ status: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const alert = useAlert();
    const hasFetchedRef = useRef(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<IPayment | null>(null);

    const fetchPayments = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/admin/payments', {
                params: {
                    page: currentPage,
                    limit: itemsPerPage,
                    status: filters.status || undefined,
                },
            });
            setPayments(response.data.data.payments);
            setPagination(response.data.data.pagination);
        } catch (error: any) {
            alert("Error", "Failed to fetch payments: " + error.message, "error");
        } finally {
            setIsLoading(false);
        }
    }, [alert, currentPage, itemsPerPage, filters]);

    useEffect(() => {
        if (!hasFetchedRef.current) {
            hasFetchedRef.current = true;
            fetchPayments().then();
        }
    }, [fetchPayments]);

    const handleManageClick = (payment: IPayment) => {
        setSelectedPayment(payment);
        setIsModalOpen(true);
    };

    return (
        <div className="bg-primary-900 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">All Payments</h3>
                <select onChange={(e) => { setFilters({ ...filters, status: e.target.value }); setCurrentPage(1); }} className="bg-primary-700 text-white p-2 rounded-lg">
                    <option value="">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="CANCELLED">Cancelled</option>
                </select>
            </div>

            {isLoading ? (
                <div className="flex w-full mx-auto py-10 items-center justify-center"><Loader /></div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-primary-500">
                                <th className="p-3">User</th>
                                <th className="p-3">Plan/Item</th>
                                <th className="p-3">Price</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Proof</th>
                                <th className="p-3">Date</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map(payment => (
                                <tr key={payment.id} className="border-b border-primary-700 hover:bg-primary-800">
                                    <td className="p-3">{payment.user?.username}</td>
                                    <td className="p-3">{payment.itemPack?.name || `${payment.customTokenAmount} Tokens (Custom)`}</td>
                                    <td className="p-3">${Number(payment.totalPrice).toFixed(2)}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[payment.status]}`}>
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <a href={payment.paymentProofImage || '#'} target="_blank" rel="noopener noreferrer" className="text-accent-400 hover:underline">
                                            <FiLink />
                                        </a>
                                    </td>
                                    <td className="p-3 text-sm text-secondary-400">{format(new Date(payment.createdAt), 'MMM d, yyyy')}</td>
                                    <td className="p-3">
                                        <button onClick={() => handleManageClick(payment)} className="text-secondary-400 hover:text-white"><FiEdit size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {pagination && pagination.total > 0 && (
                <Pagination
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalItems={pagination.total}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={setItemsPerPage}
                />
            )}

            <PaymentStatusModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchPayments}
                payment={selectedPayment}
            />
        </div>
    );
};

export default PaymentTable;