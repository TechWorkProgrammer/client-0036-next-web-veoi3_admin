import React from 'react';

interface StatusBreakdownCardProps {
    title: string;
    data: Record<string, number>;
}

const StatusBreakdownCard: React.FC<StatusBreakdownCardProps> = ({title, data}) => {
    return (
        <div className="bg-background-light p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">{title}</h3>
            <ul className="space-y-2">
                {Object.entries(data).map(([key, value]) => (
                    <li key={key} className="flex justify-between items-center text-sm">
                        <span className="text-secondary-400 capitalize">{key}</span>
                        <span className="font-semibold">{value.toLocaleString('en-US')}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StatusBreakdownCard;