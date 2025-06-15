import React, {useState} from "react";
import {createPortal} from "react-dom";
import {FaTimes} from "react-icons/fa";
import Image from "next/image";
import Button from "@/components/common/Button";
import {useWallet} from "@/context/Wallet";
import {useAlert} from "@/context/Alert";
import {useLoader} from "@/context/Loader";
import {getUser} from "@/utils/user";
import LoggedInComponent from "@/components/common/LoggedIn";

interface WalletConnectModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const wallets = [
    {
        name: "VEOI",
        icon: "/icon.png",
        description: "Use your address and password to connect securely.",
    },
];

const WalletConnectModal: React.FC<WalletConnectModalProps> = ({isOpen, onClose}) => {
    const {connectWallet, disconnectWallet, connectedWallet} = useWallet();
    const alert = useAlert();
    const loader = useLoader();
    const user = getUser();

    const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
    const [mode, setMode] = useState<"login" | "register">("login");
    const [form, setForm] = useState({address: "", password: "", repeat_password: ""});

    if (!isOpen) return null;

    const handleConnect = async () => {
        if (selectedWallet === "VEOI") {
            if (!form.address || !form.password || (mode === "register" && form.password !== form.repeat_password)) {
                alert("Validation Error", "Please fill all fields correctly.", "error");
                return;
            }
            await connectWallet(selectedWallet, form.address, form.password, mode === "register");
        } else {
            await connectWallet(selectedWallet || "");
        }
    };

    return createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-70 z-40 flex items-center justify-center overflow-auto">
            <div className="bg-background-light rounded shadow-lg w-fit max-w-2xl mx-4 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-secondary-500 hover:text-white">
                    <FaTimes size={24}/>
                </button>
                <div className="flex flex-col md:flex-row">
                    {connectedWallet ? (
                        <LoggedInComponent user={user} disconnectWallet={disconnectWallet} alert={alert}
                                           loader={loader}/>
                    ) : (
                        <>
                            {user == null && (
                                <div className="w-full md:w-1/3 p-4 rounded-l-lg border-r border-secondary-200 px-2">
                                    <h3 className="text-lg font-semibold text-white mb-2 pt-2">Choose a Wallet</h3>
                                    <ul className="space-y-3">
                                        {wallets.map((w) => (
                                            <li
                                                key={w.name}
                                                onClick={() => {
                                                    setSelectedWallet(w.name);
                                                    if (w.name !== "VEOI") setMode("login");
                                                }}
                                                className={`${
                                                    w.name === "MetaMask" ? "hidden md:flex" : "flex"
                                                } items-center gap-3 p-3 rounded-lg cursor-pointer ${
                                                    selectedWallet === w.name ? "bg-accent-500/10" : "hover:bg-accent-500/10"
                                                }`}
                                            >
                                                <Image src={w.icon} alt={w.name} width={32} height={32}/>
                                                <span className="text-white font-semibold">{w.name}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <div className="flex-1 rounded-r-lg w-[24rem]">
                                {selectedWallet === "VEOI" ? (
                                    <div className="flex flex-col gap-4">
                                        <h3 className="text-xl font-bold text-accent-400 mb-2 border-b border-secondary-200 p-4">
                                            {mode === "login" ? "VEOI Login" : "VEOI Register"}
                                        </h3>
                                        <div className="px-4 flex flex-col gap-4">
                                            <div className="relative w-full">
                                                <input
                                                    type="text"
                                                    name="username"
                                                    id="username"
                                                    placeholder=" "
                                                    value={form.address}
                                                    onChange={(e) => setForm({...form, address: e.target.value})}
                                                    className="peer block w-full appearance-none border border-secondary-200 bg-primary-700 text-white rounded-md px-3 py-2 focus:outline-none focus:border-accent-400"
                                                />
                                                <label
                                                    htmlFor="username"
                                                    className="absolute left-3 -top-2.5 bg-primary-700 px-1 text-sm text-accent-400 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-secondary-500 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-accent-400"
                                                >
                                                    Username
                                                </label>
                                            </div>
                                            <div className="relative w-full">
                                                <input
                                                    type="password"
                                                    name="password"
                                                    id="password"
                                                    placeholder=" "
                                                    value={form.password}
                                                    onChange={(e) => setForm({...form, password: e.target.value})}
                                                    className="peer block w-full appearance-none border border-secondary-200 bg-primary-700 text-white rounded-md px-3 py-2 focus:outline-none focus:border-accent-400"
                                                />
                                                <label
                                                    htmlFor="password"
                                                    className="absolute left-3 -top-2.5 bg-primary-700 px-1 text-sm text-accent-400 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-secondary-500 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-accent-400"
                                                >
                                                    Password
                                                </label>
                                            </div>
                                            {mode === "register" && (
                                                <div className="relative w-full">
                                                    <input
                                                        type="password"
                                                        name="repeat_password"
                                                        id="repeat_password"
                                                        placeholder=" "
                                                        value={form.repeat_password}
                                                        onChange={(e) => setForm({
                                                            ...form,
                                                            repeat_password: e.target.value
                                                        })}
                                                        className="peer block w-full appearance-none border border-secondary-200 bg-primary-700 text-white rounded-md px-3 py-2 focus:outline-none focus:border-accent-400"
                                                    />
                                                    <label
                                                        htmlFor="repeat_password"
                                                        className="absolute left-3 -top-2.5 bg-primary-700 px-1 text-sm text-accent-400 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-secondary-500 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-accent-400"
                                                    >
                                                        Repeat Password
                                                    </label>
                                                </div>
                                            )}

                                            <div className="flex justify-between items-center mb-4">
                                                <Button label={mode === "login" ? "Login" : "Register"}
                                                        onClick={handleConnect}
                                                        color="primary"/>
                                            </div>
                                        </div>
                                    </div>
                                ) : selectedWallet ? (
                                    <div className="flex flex-col gap-4">
                                        <h3 className="text-xl font-bold text-accent-400 mb-2 border-b border-secondary-200 p-4">{selectedWallet}</h3>
                                        <p className="text-white mb-4 px-4">
                                            {wallets.find((w) => w.name === selectedWallet)?.description}
                                        </p>
                                        <div className="flex align-center justify-end mx-4 mb-4">
                                            <Button label="Connect"
                                                    onClick={handleConnect}
                                                    color="primary"/>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-white text-center py-12 font-semibold text-lg">Select a wallet to
                                        continue.</p>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default WalletConnectModal;
