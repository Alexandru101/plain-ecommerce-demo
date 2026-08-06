// Modules //
import { useState } from "react";
import "./account.css";

// Types //
const accountTabs = {
    overview: {
        text: "Account Overview",
        content: <Overview />
    },

    orders: {
        text: "Orders",
        content: <NoContentTemplate />
    },
    
    wishlist: {
        text: "Wishlist",
        content: <NoContentTemplate />
    },
    
    addresses: {
        text: "Addresses",
        content: <NoContentTemplate />
    },

    payment: {
        text: "Payment Methods",
        content: <NoContentTemplate />
    },
    
    refunds: {
        text: "Return & Refunds",
        content: <NoContentTemplate />
    },
    
    changePassword: {
        text: "Change Password",
        content: <NoContentTemplate />
    },
    
    logout: {
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
                    {Object.entries(accountTabs).map(([key, tab]) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key as AccountTabs)}   
                        >{tab.text}</button>
                    ))}

                    {/* ----------------------------------------------- */}
                    {/* Next finish designing button and adding content */}
                    {/* ----------------------------------------------- */}
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