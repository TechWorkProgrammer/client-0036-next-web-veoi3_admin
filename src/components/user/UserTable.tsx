import React, {useState, useEffect, useCallback, useRef} from 'react';
import {format} from 'date-fns';
import Image from 'next/image';
import {IUser, Role} from '@/types/user';
import api from '@/utils/axios';
import Pagination from "@/components/common/Pagination";
import Loader from "@/components/common/Loader";
import UserTableFilters from "@/components/user/UserTableFilters";
import EditTokenModal from "@/components/user/EditTokenModal";
import {useAlert} from "@/context/Alert";
import Button from "@/components/common/Button";

interface IPaginationInfo {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
}

const UserTable: React.FC = () => {
    const [users, setUsers] = useState<IUser[]>([]);
    const [pagination, setPagination] = useState<IPaginationInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [filters, setFilters] = useState<{ search: string; role: Role | '' }>({search: '', role: ''});

    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const alert = useAlert();

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/users', {
                params: {
                    page: currentPage,
                    limit: itemsPerPage,
                    search: filters.search || undefined,
                    role: filters.role || undefined,
                },
            });
            setUsers(response.data.data.users);
            setPagination(response.data.data.pagination);
        } catch (error: any) {
            alert("Ouch...", "Failed to fetch users: " + error.message, "error");
        } finally {
            setLoading(false);
        }
    }, [currentPage, itemsPerPage, filters.search, filters.role, alert]);

    const hasFetchedRef = useRef(false);

    useEffect(() => {
        if (!hasFetchedRef.current) {
            hasFetchedRef.current = true;
            fetchUsers().then();
        }
    }, [fetchUsers])

    const handleEditClick = (user: IUser) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    return (
        <div>
            <UserTableFilters onFilterChange={newFilters => {
                setCurrentPage(1);
                setFilters(newFilters);
            }}/>

            {loading ? (
                <div className="flex w-full mx-auto py-10 items-center justify-center"><Loader/></div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                        <tr className="border-b">
                            <th className="p-3">User</th>
                            <th className="p-3">Role</th>
                            <th className="p-3">Tokens</th>
                            <th className="p-3">Points</th>
                            <th className="p-3">Created At</th>
                            <th className="p-3">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="border-b border-primary-700 hover:bg-primary-800">
                                <td className="p-3 flex items-center space-x-3">
                                    <Image
                                        src={user.profileImage || `/assets/images/avatar.png`}
                                        alt={user.username}
                                        className="w-10 h-10 rounded-full object-cover"
                                        width={40}
                                        height={40}
                                    />
                                    <div>
                                        <p className="font-semibold">{user.username}</p>
                                        <p className="text-sm text-secondary-500 truncate max-w-xs">{user.address}</p>
                                    </div>
                                </td>
                                <td className="p-3">{user.role}</td>
                                <td className="p-3">{user.token}</td>
                                <td className="p-3">{user.point}</td>
                                <td className="p-3">{format(new Date(user.createdAt), 'MMM d, yyyy h:mm a')}</td>
                                <td className="p-3">
                                    <Button onClick={() => handleEditClick(user)} label="Edit Tokens" fullWidth={true}
                                            color="primary"/>
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

            {isModalOpen && selectedUser && (
                <EditTokenModal
                    user={selectedUser}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={() => {
                        fetchUsers().then();
                    }}
                />
            )}
        </div>
    );
};

export default UserTable;