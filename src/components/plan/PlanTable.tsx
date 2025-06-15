import React, {useState, useEffect, useCallback, useRef} from 'react';
import {useAlert} from '@/context/Alert';
import Loader from '@/components/common/Loader';
import Button from '@/components/common/Button';
import {FiEdit, FiTrash2} from 'react-icons/fi';
import {IPlan} from "@/types/plan";
import PlanFormModal from "@/components/plan/PlanFormModal";
import api from "@/utils/axios";
import DeleteConfirmationModal from "@/components/plan/DeleteConfirmationModal";

const PlanTable: React.FC = () => {
    const [plans, setPlans] = useState<IPlan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const alert = useAlert();
    const hasFetchedRef = useRef(false);

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<IPlan | null>(null);

    const fetchPlans = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/plans');
            setPlans(response.data.data);
        } catch (error: any) {
            alert("Error", "Failed to fetch plans: " + error.message, "error");
        } finally {
            setIsLoading(false);
        }
    }, [alert]);

    useEffect(() => {
        if (!hasFetchedRef.current) {
            hasFetchedRef.current = true;
            fetchPlans().then();
        }
    }, [fetchPlans]);

    const handleAddNew = () => {
        setSelectedPlan(null);
        setIsFormModalOpen(true);
    };

    const handleEdit = (plan: IPlan) => {
        setSelectedPlan(plan);
        setIsFormModalOpen(true);
    };

    const handleDelete = (plan: IPlan) => {
        setSelectedPlan(plan);
        setIsDeleteModalOpen(true);
    };

    return (
        <div className="p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Manage Pricing Plans</h3>
                <Button label="+ Add New Plan" onClick={handleAddNew} color="primary"/>
            </div>

            {isLoading ? (
                <div className="flex w-full mx-auto py-10 items-center justify-center"><Loader/></div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                        <tr className="border-b border-primary-500">
                            <th className="p-3">Name</th>
                            <th className="p-3">Tokens</th>
                            <th className="p-3">Price</th>
                            <th className="p-3">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {plans.map(plan => (
                            <tr key={plan.id} className="border-b border-primary-700 hover:bg-primary-800">
                                <td className="p-3 font-semibold">{plan.name}</td>
                                <td className="p-3">{plan.tokens.toLocaleString()}</td>
                                <td className="p-3">${Number(plan.price).toFixed(2)}</td>
                                <td className="p-3">
                                    <div className="flex gap-4">
                                        <button onClick={() => handleEdit(plan)}
                                                className="text-secondary-400 hover:text-white"><FiEdit size={18}/>
                                        </button>
                                        <button onClick={() => handleDelete(plan)}
                                                className="text-red-500 hover:text-red-400"><FiTrash2 size={18}/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            <PlanFormModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                onSuccess={fetchPlans}
                initialData={selectedPlan}
            />
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onSuccess={fetchPlans}
                plan={selectedPlan}
            />
        </div>
    );
};

export default PlanTable;