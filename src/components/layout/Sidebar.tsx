import React, {useState} from "react";
import {useRouter} from "next/router";
import {FaMedium} from "react-icons/fa6";
import {MdPerson} from "react-icons/md";
import {RiTelegram2Fill} from "react-icons/ri";
import Image from "next/image";
import WalletConnectModal from "@/components/common/WalletConnectModal";
import {FaXTwitter} from "react-icons/fa6";
import {useWallet} from "@/context/Wallet";
import {GoPeople} from "react-icons/go";
import {getUser} from "@/utils/user";
import {HiOutlineHome} from "react-icons/hi";
import {TbCurrencyEthereum} from "react-icons/tb";
import {FiPlayCircle} from "react-icons/fi";
import {GiNotebook} from "react-icons/gi";


interface SidebarProps {
    variant: "desktop" | "mobile";
    isMinimized?: boolean;
    toggleOpen?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
                                             variant,
                                             isMinimized = false,
                                             toggleOpen,
                                         }) => {
    const router = useRouter();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const {connectedWallet} = useWallet();
    const user = getUser();
    const mainNav = [
        {
            label: "Dashboard",
            path: "/",
            icon: <HiOutlineHome className="w-5 h-5"/>
        },
        {
            label: "User",
            path: "/user",
            icon: <GoPeople className="w-5 h-5"/>
        },
        {
            label: "Video",
            path: "/video",
            icon: <FiPlayCircle className="w-5 h-5"/>
        },
        {
            label: "Plan",
            path: "/plan",
            icon: <GiNotebook className="w-5 h-5"/>
        },
        {
            label: "Payment",
            path: "/payment",
            icon: <TbCurrencyEthereum className="w-5 h-5"/>
        }
    ];
    const handleNavigation = (path: string) => {
        router.push(path).then(() => {
            if (variant === "mobile" && toggleOpen) {
                toggleOpen();
            }
        });
    };
    const containerClasses =
        variant === "desktop"
            ? `fixed top-0 left-0 bottom-0 flex flex-col transition-all duration-300 ${
                isMinimized ? "w-20" : "w-64"
            }`
            : `fixed top-0 left-0 bottom-0 w-64 flex flex-col transition-all duration-300 z-20 pt-16`;
    return (
        <>
            <aside
                className={`bg-background-light ${containerClasses}`}
            >
                <div
                    onClick={() => handleNavigation("/")}
                    className="hidden md:flex items-center justify-start px-4 pt-4 cursor-pointer"
                >
                    <div className="relative w-8 h-8">
                        <Image
                            src="/icon.png"
                            alt="CypherAI Logo"
                            fill
                            style={{objectFit: "contain"}}
                            priority
                        />
                    </div>
                    <p className="ml-2 text-white font-semibold text-xl mb-2">VeoI3 Admin</p>
                </div>
                <div className="flex-1 overflow-y-auto mt-2">
                    {mainNav.map((item) => (
                        <div key={item.path} className="px-3 py-1">
                            <button
                                onClick={() => handleNavigation(item.path)}
                                className={`flex items-center w-full px-4 py-2 transition rounded font-semibold ${
                                    router.pathname === item.path
                                        ? "bg-accent-500/20 text-white"
                                        : "hover:bg-accent-500/10 text-secondary"
                                } ${
                                    variant === "desktop" && isMinimized
                                        ? "justify-center"
                                        : ""
                                }`}
                            >
                                {item.icon}
                                {(variant === "mobile" || !isMinimized) && (
                                    <span className="ml-3">{item.label}</span>
                                )}
                            </button>
                        </div>
                    ))}

                </div>
                <div className="border-t border-secondary-500 px-2 py-2 flex flex-col gap-2 font-semibold text-md">
                    <button
                        onClick={() => setIsProfileOpen(true)}
                        className="flex items-center w-full px-4 py-2 transition hover:bg-accent-500/10 text-secondary rounded"
                    >
                        <MdPerson size={18}/>
                        <span className="ml-3">
                          {connectedWallet ? user?.user.username : "Login"}
                        </span>
                    </button>
                </div>
                <div className="border-t border-secondary-500">
                    <div className="flex space-x-4 w-full justify-between px-4 md:px-6 py-6">
                        <a href="https://t.me/" target="_blank" rel="noopener noreferrer"
                           className="text-secondary-900 hover:text-accent-500 transition bg-primary-800 rounded p-3">
                            <RiTelegram2Fill size={24}/>
                        </a>
                        <a href="https://x.com/cypheraieth" target="_blank" rel="noopener noreferrer"
                           className="text-secondary-900 hover:text-accent-500 transition bg-primary-800 rounded p-3">
                            <FaXTwitter size={24}/>
                        </a>
                        <a href="https://medium.com/" target="_blank" rel="noopener noreferrer"
                           className="text-secondary-900 hover:text-accent-500 transition bg-primary-800 rounded p-3">
                            <FaMedium size={24}/>
                        </a>
                    </div>
                </div>
            </aside>
            <WalletConnectModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)}/>
        </>
    );
};

export default Sidebar;
