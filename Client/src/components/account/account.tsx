// Modules //
import { useState } from "react";
import "./account.css";

// Icons //
import { FiUser, FiBox, FiHeart, FiLogOut } from "react-icons/fi";
import { BiMap, BiCreditCard, BiLock } from "react-icons/bi";
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

export default function Account() {
    // State variables //
    const [activeTab, setActiveTab] = useState<AccountTabs>("overview");

    // Grabbing the current active tab index within the array of accountTabs //
    const activeIndex = Object.keys(accountTabs).indexOf(activeTab);

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
        <div>Overview</div>
    )
};

function NoContentTemplate() {
    return (
        <div className="account__section-fullbox">Content Not Found :(</div>
    )
};