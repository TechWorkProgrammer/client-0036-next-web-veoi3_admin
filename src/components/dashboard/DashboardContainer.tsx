import api from '@/utils/axios';
import React, {useState, useEffect, useCallback, useRef} from 'react';
import StatsGrid from "@/components/dashboard/StatsGrid";
import StatusBreakdownCard from "@/components/dashboard/StatusBreakdownCard";
import RecentPaymentsTable from "@/components/dashboard/RecentsPaymentsTable";
import {useAlert} from "@/context/Alert";
import Loader from "@/components/common/Loader";

interface DashboardData {
    users: { total: number; totalTokens: number; totalPoints: number; };
    payments: Record<string, number>;
    generations: Record<string, number> & { totalVideos: number; totalCompletedSeconds: number; };
    recentPendingPayments: any[];
}

const DashboardContainer: React.FC = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    const alert = useAlert();

    const fetchDashboardData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/dashboard/stats');
            setData(response.data.data);
        } catch (error: any) {
            alert("Ouch...", "Failed to fetch users: " + error.message, "error");
        } finally {
            setLoading(false);
        }
    }, [alert]);

    const hasFetchedRef = useRef(false);

    useEffect(() => {
        if (!hasFetchedRef.current) {
            hasFetchedRef.current = true;
            fetchDashboardData().then();
        }
    }, [fetchDashboardData])

    if (loading) {
        return <div className="flex w-full mx-auto py-10 items-center justify-center"><Loader/></div>;
    }

    if (!data) {
        return null;
    }

    return (
        <div className="space-y-6">
            <StatsGrid stats={data.users}/>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <RecentPaymentsTable payments={data.recentPendingPayments}/>
                </div>
                <div className="space-y-6">
                    <StatusBreakdownCard title="Payment Status" data={data.payments}/>
                    <StatusBreakdownCard title="Generation Status" data={data.generations}/>
                </div>
            </div>
        </div>
    );
};

export default DashboardContainer;