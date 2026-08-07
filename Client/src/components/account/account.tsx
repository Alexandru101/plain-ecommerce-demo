// Modules //
import { useState } from "react";
import "./account.css";

// Icons //
import { FiUser } from "react-icons/fi";
import { FiBox } from "react-icons/fi";

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
        icon: FiUser,
        text: "Wishlist",
        content: <NoContentTemplate />
    },
    
    addresses: {
        icon: FiUser,
        text: "Addresses",
        content: <NoContentTemplate />
    },

    payment: {
        icon: FiUser,
        text: "Payment Methods",
        content: <NoContentTemplate />
    },
    
    refunds: {
        icon: FiUser,
        text: "Return & Refunds",
        content: <NoContentTemplate />
    },
    
    changePassword: {
        icon: FiUser,
        text: "Change Password",
        content: <NoContentTemplate />
    },
    
    logout: {
        icon: FiUser,
        text: "Logout",
        content: <Logout />
    }
};

type AccountTabs = keyof typeof accountTabs;

export default function Account() {
    const [activeTab, setActiveTab] = useState<AccountTabs>("overview");

    return (
        <div className="account">
            <header className="account__header">
                <h1 className="account__title">My Account</h1>
                <p className="account__description">Welcome back, user!</p>
            </header>

            <section className="account__settings">
                <nav className="account__panel">
                    {Object.entries(accountTabs).map(([key, tab]) => {
                        const Icon = tab.icon;

                        return (
                            <button
                                key={key}
                                className="account__panel-button"
                                onClick={() => setActiveTab(key as AccountTabs)}
                            >
                                <Icon className="account__panel-button-icon" />
                                <span className="account__panel-button-text">{tab.text}</span>
                            </button>
                        )
                    })}
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

function Logout() {
    return (
        <div>Logout</div>
    )
};

function NoContentTemplate() {
    return (
        <div></div>
    )
};