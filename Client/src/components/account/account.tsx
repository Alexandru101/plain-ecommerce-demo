// Modules //
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { emitNotification } from "../../utils/Notification.tsx";
import ApiClient from "../../utils/ApiClient";
import "./account.css";

// Icons //
import { FiUser, FiBox, FiHeart, FiLogOut } from "react-icons/fi";
import { BiMap, BiCreditCard, BiLock, BiShoppingBag } from "react-icons/bi";
import { LuRotateCcw } from "react-icons/lu";

// Types //
type UserDataResponse = {
    success: boolean;
    message: string | null;
    userData: UserDataObject | null;
};

type UserDataObject = {
    _id: string
    email: string
    gender: string
    firstName: string
    lastName: string
    createdAt: string
};

const accountTabs = (userData: UserDataObject | null) => ({
    overview: {
        icon: FiUser,
        text: "Account Overview",
        content: <Overview userData={userData} />
    },

    orders: {
        icon: FiBox,
        text: "Orders",
        content: <NoContentTemplate />
    },
    
    wishlist: {
        icon: FiHeart,
        text: "Wishlist",
        content: <NoContentTemplate />
    },
    
    addresses: {
        icon: BiMap,
        text: "Addresses",
        content: <NoContentTemplate />
    },

    payment: {
        icon: BiCreditCard,
        text: "Payment Methods",
        content: <NoContentTemplate />
    },
    
    refunds: {
        icon: LuRotateCcw,
        text: "Return & Refunds",
        content: <NoContentTemplate />
    },
    
    changePassword: {
        icon: BiLock,
        text: "Change Password",
        content: <NoContentTemplate />
    }
});

type AccountTabs = keyof ReturnType<typeof accountTabs>;

// Backend API: grabs user data if logged in //
const USERDATA_API = `${import.meta.env.VITE_BACKEND_PORT}/api/get-userdata`;
const LOGOUT_API = `${import.meta.env.VITE_BACKEND_PORT}/api/logout`;

export default function Account() {
    // State variables //
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [confirmLogout, setConfirmLogout] = useState<boolean>(false);

    const [activeTab, setActiveTab] = useState<AccountTabs>("overview");
    const [userData, setUserData] = useState<UserDataObject | null>(null);

    // Variables
    const navigate = useNavigate();

    // Getting the "tabs" and finding the index of the current active tab
    const tabs = accountTabs(userData);
    const activeIndex = Object.keys(tabs).indexOf(activeTab);

    // Loading user data object //
    useEffect(() => {
        const getData = async () => {
            try {
                const data = await ApiClient.get<UserDataResponse>(USERDATA_API, {});

                if (data.success && data.userData) {
                    setUserData(data.userData);

                    // Data object --> {
                    // _id: "6a57a96d6cd0f6a31e6b5344",
                    // email: "alexandru_dev15@proton.me",
                    // gender: "Male",
                    // firstName: "uknown",
                    // lastName: "uknown",
                    // createdAt: "2026-07-15T15:38:21.311Z" }
                }
            } catch(err) {
                console.error(`Error fetching user data -> ${err}`);
                navigate("/login");
            } finally {
                setIsLoading(false);
            }
        };

        getData();
    }, [navigate]);

    // Logging user out of his account //
    const logout = async (): Promise<void> => {
        await ApiClient.post(LOGOUT_API, {});

        emitNotification({
            type: "success",
            message: "Successfully logged out"
        });

        navigate("/home");
    };

    if (isLoading) {
        return (
            <div className="account__loading">
                <div className="account__loading-spinner"></div>
            </div>
        )
    }

    return (
        <div className="account">
            <header className="account__header">
                <h1 className="account__title">My Account</h1>
                <p className="account__description">Welcome back, {userData?.firstName}!</p>
            </header>

            <section className="account__settings">
                <nav className="account__panel">
                    <div 
                        className="account__active-indicator"
                        style={{ transform: `translateY(${activeIndex * 60}px)`}}
                    />

                    {Object.entries(tabs).map(([key, tab]) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === key;

                        return (
                            <button
                                key={key}
                                type="button"
                                className={`account__panel-button ${isActive ? "account__panel-button--active" : "" }`}
                                onClick={() => setActiveTab(key as AccountTabs)}
                            >
                                <Icon className="account__panel-button-icon" />
                                <span className="account__panel-button-text">{tab.text}</span>
                            </button>
                        )
                    })}

                    <button
                        type="button"
                        className="account__panel-button account__panel-button--logout"
                        onClick={() => setConfirmLogout(true)}
                    >
                        <FiLogOut className="account__panel-button-icon" />
                        <span className="account__panel-button-text">Logout</span>
                    </button>
                </nav>

                <main className="account__content">
                    {tabs[activeTab].content}
                </main>
            </section>

            {confirmLogout && (
                <div className="account__logout-overlay">
                    <div className="account__logout-modal">
                        <h2>Are you sure you want to logout?</h2>

                        <div className="account__logout-actions">
                            <button
                                type="button"
                                className="account__logout-buttons"
                                onClick={logout}
                            >
                                Confirm
                            </button>
                            
                            <button
                                type="button"
                                className="account__logout-buttons"
                                onClick={() => setConfirmLogout(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// Panel Sections //
function Overview({ userData }: { userData: UserDataObject | null }) {
    return (
        <div className="account__content-container">
            <section className="account__overview">
                <div className="account__leftInfo">
                    <h1 className="account__leftInfo-title">Account Overview</h1>

                    <p className="account__leftInfo-desc">
                        From your account dashboard, you can view your recent orders,
                        manage your shopping and billing addresses, and edit your password
                        and account details.
                    </p>
                </div>

                <div className="account__rightInfo">
                    <div className="avatar">
                        {userData?.firstName.charAt(0).toUpperCase()}
                    </div>

                    <div className="account__rightInfo-container">
                        <h1 className="account__rightInfo-title">{`${userData?.firstName ?? ""} ${userData?.lastName ?? ""}`}</h1>

                        <p className="account__rightInfo-desc">
                            {`${userData?.email ?? "example@gmail.com"}`}
                        </p>

                        <span className="account__underlineText">Edit Profile</span>
                    </div>
                </div>
            </section>

            <section className="account__cards">
                <div className="account__card">
                    <div className="avatar">
                        <BiShoppingBag />
                    </div>

                    <h1>3</h1>
                    <span className="account__card-text">Orders</span>
                    <span className="account__underlineText">View all orders</span>
                </div>

                <div className="account__card">
                    <div className="avatar">
                        <FiHeart />
                    </div>

                    <h1>5</h1>
                    <span className="account__card-text">Wishlist Items</span>
                    <span className="account__underlineText">View Wishlist</span>
                </div>

                <div className="account__card">
                    <div className="avatar">
                        <BiMap />
                    </div>

                    <h1>2</h1>
                    <span className="account__card-text">Saved Addresses</span>
                    <span className="account__underlineText">Manage Addresses</span>
                </div>

                <div className="account__card">
                    <div className="avatar">
                        <BiCreditCard />
                    </div>

                    <h1>2</h1>
                    <span className="account__card-text">Payment Methods</span>
                    <span className="account__underlineText">Manage Payment Methods</span>
                </div>
            </section>

            <section className="account__cards">
                <div className="account__card">
                    <div className="account__orders-top">
                        <h3>Recent Orders</h3>
                        <span className="account__underlineText">View all orders</span>
                    </div>
                </div>
            </section>
        </div>
    )
};

function NoContentTemplate() {
    return (
        <div className="account__section-fullbox">Content Not Found :(</div>
    )
};