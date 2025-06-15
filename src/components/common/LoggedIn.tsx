import React from "react";
import {FaPowerOff, FaSyncAlt} from "react-icons/fa";
import api from "@/utils/axios";
import {saveUser, getUser, getAccessToken, clearUser} from "@/utils/user";

interface LoggedInComponentProps {
    user: ReturnType<typeof getUser>;
    disconnectWallet: () => void;
    alert: (title: string, message: string, type: "success" | "error" | "info") => void;
    loader: (state: boolean) => void;
}

const LoggedInComponent: React.FC<LoggedInComponentProps> = ({
                                                                 user,
                                                                 disconnectWallet,
                                                                 alert,
                                                                 loader,
                                                             }) => {
    const refreshUserData = async () => {
        loader(true);
        try {
            const token = getAccessToken();
            if (!token) {
                alert(
                    "Authentication Required",
                    "No valid session found. Please connect your wallet again.",
                    "error"
                );
                clearUser();
                return;
            }
            const response = await api.get(`/user/me`);
            const updated = response.data.data;
            saveUser({
                user: updated,
                accessToken: user?.accessToken || "",
                refreshToken: user?.refreshToken || "",
                walletType: user?.walletType || "unknown",
            });
            alert("Data Refreshed", "Your account information has been updated.", "success");
        } catch (err: any) {
            alert("Refresh Failed", err.message || "Unable to update user data.", "error");
        } finally {
            loader(false);
        }
    };

    return (
        <div className="w-full p-4 min-w-[20rem] xl:min-w-[28rem]">
            <div className="flex flex-col items-start justify-start w-full gap-4">
                <h1 className="text-white/70 mb-2 font-semibold">Admin Profile</h1>
                <div
                    className="w-full border border-secondary-200 rounded-md px-4 py-2 flex items-center justify-between">
                    <p className="text-white/70 text-base">Username </p>
                    <p className="text-white text-base font-semibold">{user?.user.username || "?"}</p>
                </div>
                <div
                    className="w-full border border-secondary-200 rounded-md px-4 py-2 flex items-center justify-between">
                    <p className="text-white/70 text-base">Address </p>
                    <p className="text-white text-base font-semibold">{user?.user.address || "?"}</p>
                </div>
                <div
                    className="w-full border border-secondary-200 rounded-md px-4 py-2 flex items-center justify-between">
                    <p className="text-white/70 text-base">Role </p>
                    <p className="text-white text-base font-semibold">{user?.user.role || "?"}</p>
                </div>
                <div className="flex w-full gap-2">
                    <button
                        onClick={refreshUserData}
                        className="w-1/2 flex items-center justify-center gap-2 bg-accent-400 text-black text-lg font-semibold py-2 rounded transition"
                    >
                        <FaSyncAlt/>
                        Refresh
                    </button>

                    <button
                        onClick={disconnectWallet}
                        className="w-1/2 flex items-center justify-center gap-2 bg-red-600/20 text-red-600 text-lg font-semibold py-2 rounded transition"
                    >
                        <FaPowerOff/>
                        Disconnect
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoggedInComponent;
