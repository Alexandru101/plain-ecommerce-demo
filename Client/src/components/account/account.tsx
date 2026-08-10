// Modules //
import { useState, useEffect } from "react";
import ApiClient from "../../utils/ApiClient";
import "./account.css";

// Icons //
import { FiUser, FiBox, FiHeart, FiLogOut } from "react-icons/fi";
import { BiMap, BiCreditCard, BiLock, BiShoppingBag } from "react-icons/bi";
import { LuRotateCcw } from "react-icons/lu";

// Types //
const accountTabs = {
    overview: {
        icon: FiUser,
        text: "Account Overview",
        content: <Overview />
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
};

type AccountTabs = keyof typeof accountTabs;

type UserDataResponse = {
    success: boolean
    message: string | null
    userData: object | null
};

// Backend API: grabs user data if logged in //
const BACKEND_API = `${import.meta.env.VITE_BACKEND_PORT}/api/get-userdata`;

export default function Account() {
    // State variables //
    const [activeTab, setActiveTab] = useState<AccountTabs>("overview");

    // Grabbing the current active tab index within the array of accountTabs //
    const activeIndex = Object.keys(accountTabs).indexOf(activeTab);

    // Loading user data object //
    useEffect(() => {
        const getData = async () => {
            try {
                const data = await ApiClient.get<UserDataResponse>(BACKEND_API);

                if (data.success) {
                    console.log(data.success);
                    console.log(data.message);
                    console.log(data.userData);
                }
            } catch(err) {
                console.error(`Error fetching user data -> ${err}`);
            }
        };

        getData();
    }, []);

    return (
        <div className="account">
            <header className="account__header">
                <h1 className="account__title">My Account</h1>
                <p className="account__description">Welcome back, user!</p>
            </header>

            <section className="account__settings">
                <nav className="account__panel">
                    <div 
                        className="account__active-indicator"
                        style={{ transform: `translateY(${activeIndex * 60}px)`}}
                    />

                    {Object.entries(accountTabs).map(([key, tab]) => {
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
                        onClick={() => console.log("Button Activated")}
                    >
                        <FiLogOut className="account__panel-button-icon" />
                        <span className="account__panel-button-text">Logout</span>
                    </button>
                </nav>

                <main className="account__content">
                    {accountTabs[activeTab].content}
                </main>
            </section>
        </div>
    )
}

// Panel Sections //
function Overview() {
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
                    <div className="avatar">A</div>

                    <div className="account__rightInfo-container">
                        <h1 className="account__rightInfo-title">John doe</h1>

                        <p className="account__rightInfo-desc">
                            example@gmail.com
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