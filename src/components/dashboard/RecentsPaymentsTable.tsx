import React from 'react';
import Image from 'next/image';
import {format} from 'date-fns';

interface RecentPaymentsTableProps {
    payments: any[];
}

const RecentPaymentsTable: React.FC<RecentPaymentsTableProps> = ({payments}) => {
    return (
        <div className="bg-background-light p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Recent Pending Payments</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                    <tr className="border-b border-primary-600">
                        <th className="p-3 text-sm">User</th>
                        <th className="p-3 text-sm">Amount</th>
                        <th className="p-3 text-sm">Date</th>
                    </tr>
                    </thead>
                    <tbody>
                    {payments.length > 0 ? payments.map(payment => (
                        <tr key={payment.id} className="border-b border-primary-700">
                            <td className="p-3 flex items-center space-x-3">
                                <Image
                                    src={payment.user.profileImage || `https://ui-avatars.com/api/?name=${payment.user.username}&background=random`}
                                    alt={payment.user.username}
                                    width={32}
                                    height={32}
                                    className="rounded-full"
                                />
                                <span>{payment.user.username}</span>
                            </td>
                            <td className="p-3 font-mono">{Number(payment.totalPrice).toFixed(2)} {payment.currency}</td>
                            <td className="p-3 text-secondary-400 text-xs">{format(new Date(payment.createdAt), 'MMM d, yyyy')}</td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={3} className="text-center p-6 text-secondary-500">No pending payments.</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentPaymentsTable;