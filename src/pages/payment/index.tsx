import ProtectedPage from "@/components/ProtectedPage";
import React from "react";
import {useWallet} from "@/context/Wallet";
import SidebarLayout from "@/components/layout/SidebarLayout";
import PaymentTable from "@/components/payment/PaymentTable";

const Payment: React.FC = () => {
    const {connectedWallet} = useWallet();
    return (
        <SidebarLayout>
            {connectedWallet ?
                <div className="rounded-lg flex-1 flex flex-col p-4 md:p-6">
                    <div className="flex justify-start mb-4">
                        <h2 className="md:text-xl font-semibold">Payment</h2>
                    </div>
                    <div className="w-full">
                        <PaymentTable/>
                    </div>
                </div> : <div className="rounded-lg flex-1 flex flex-col p-4 md:p-6"><ProtectedPage/></div>
            }
        </SidebarLayout>
    );
};

export default Payment;
