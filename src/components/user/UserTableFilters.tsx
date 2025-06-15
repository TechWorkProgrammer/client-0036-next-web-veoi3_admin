import React, {useState, useEffect} from "react";
import {Role} from "@/types/user";

interface UserTableFiltersProps {
    onFilterChange: (filters: { search: string; role: Role | "" }) => void;
}

const UserTableFilters: React.FC<UserTableFiltersProps> = ({onFilterChange}) => {
    const [search, setSearch] = useState("");
    const [role, setRole] = useState<Role | "">("");

    useEffect(() => {
        const handler = setTimeout(() => {
            onFilterChange({search, role});
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [search, role, onFilterChange]);

    return (
        <div className="flex items-center justify-between mb-4">
            <input
                type="text"
                placeholder="Search by username..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-primary-700 text-white p-2 rounded-lg w-1/3 focus:outline-none focus:ring-2 focus:ring-accent-500"
            />
            <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role | "")}
                className="bg-primary-700 text-white p-2 rounded-lg cursor-pointer appearance-none border border-primary-500 hover:border-accent-500 focus:outline-none"
            >
                <option value="">All Roles</option>
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
            </select>
        </div>
    );
};

export default UserTableFilters;