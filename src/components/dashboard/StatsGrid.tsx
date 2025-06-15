import React from 'react';
import StatCard from './StatCard';
import {FaUsers, FaCoins} from 'react-icons/fa';
import {RiCopperCoinFill} from 'react-icons/ri';

interface StatsGridProps {
    stats: {
        total: number;
        totalTokens: number;
        totalPoints: number;
    };
}

const StatsGrid: React.FC<StatsGridProps> = ({stats}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard title="Total Users" value={stats.total} icon={<FaUsers className="w-6 h-6 text-accent-400"/>}/>
            <StatCard title="Total Tokens Distributed" value={stats.totalTokens}
                      icon={<FaCoins className="w-6 h-6 text-accent-400"/>}/>
            <StatCard title="Total Points Distributed" value={stats.totalPoints}
                      icon={<RiCopperCoinFill className="w-6 h-6 text-accent-400"/>}/>
        </div>
    );
};

export default StatsGrid;