import React from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
    return (
        <div className="bg-background-light p-6 rounded-lg flex items-center space-x-4">
            <div className="bg-background-dark p-3 rounded-full">
                {icon}
            </div>
            <div>
                <p className="text-sm text-secondary-400">{title}</p>
                <p className="text-2xl font-bold">{value.toLocaleString('en-US')}</p>
            </div>
        </div>
    );
};

export default StatCard;