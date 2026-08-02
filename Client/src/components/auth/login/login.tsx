// Utils //
import { useState, useEffect, useRef } from "react";
import { captchaSDK } from "../../../utils/FriendlyCaptchaSDK";
import { useNavigate } from "react-router-dom";
import { emitNotification } from "../../../utils/Notification";
import "./login.css";

// Icons //
import { Link } from "react-router-dom";
import { MdBolt } from "react-icons/md";
import { FiPackage, FiRotateCcw, FiUser } from "react-icons/fi";

const AUTHENTICATION_API = `${import.meta.env.VITE_BACKEND_PORT}/api/authentication`;

export default function Login() {
    // State Variables //
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    // Variables //
    const navigate = useNavigate();
    const captchaRef = useRef(null);
    const captchaWidgetRef = useRef<any>(null);

    // Captcha Implementation //
    useEffect(() => {
        const captchaElement = captchaRef.current;
        if (!captchaElement) return;

        const widget = captchaSDK.createWidget({
            element: captchaElement,
            sitekey: import.meta.env.VITE_FRIENDLY_CAPTCHA_SITE_KEY
        });

        captchaWidgetRef.current = widget;

        return () => widget.destroy();
    }, []);

    // Functions //
    const loginHandler = async (e: React.SubmitEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        const captchaID = captchaWidgetRef.current?.getResponse();
        if (!captchaID) return;

        try {
            const response = await fetch(AUTHENTICATION_API, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, captchaID })
            });

            const data = await response.json();
            
            if (data.success) {
                emitNotification({
                    type: "success",
                    message: "Successfully logged into account"
                });

                navigate("/home");
            } else {
                emitNotification({
                    type: "alert",
                    message: data.message,
                    duration: 6000
                });

                captchaWidgetRef.current?.reset();
            }
        } catch(err) {
            console.error(`Error: ${err}`);
        }
    };

    // Page Styling //
    return (
        <div id="hero">
            <div id="header">
                <span id="header-title">Customer Login</span>
                <span id="header-desc">
                    Log in to your account for a faster, personalised shopping experience.
                </span>
            </div>

            <div id="cards-container">

                {/* ----------------------- */}
                {/* Account Card Details #1 */}
                {/* ----------------------- */}

                <div className="card">
                    <span className="card-title">
                        I dont have an account
                    </span>

                    <span className="card-desc">
                        Creating an account will provide you will the following benefits:
                    </span>

                    <div id="card-benefits-container">
                        <div className="card-benefits-frame">
                            <div className="card-benefits-frame-icon">
                                <MdBolt />
                            </div>

                            <span className="card-benefits-frame-text">Speed up checkout</span>
                        </div>

                        <div className="card-benefits-frame">
                            <div className="card-benefits-frame-icon">
                                <FiPackage />
                            </div>

                            <span className="card-benefits-frame-text">Track your orders and deliveries with ease</span>
                        </div>

                        <div className="card-benefits-frame">
                            <div className="card-benefits-frame-icon">
                                <FiRotateCcw />
                            </div>

                            <span className="card-benefits-frame-text">Easily manage returns and refunds</span>
                        </div>

                        <div className="card-benefits-frame">
                            <div className="card-benefits-frame-icon">
                                <FiUser />
                            </div>

                            <span className="card-benefits-frame-text">Receive personalised product recommendations tailored to you</span>
                        </div>
                    </div>

                    <Link className="card-button" to="/create">
                        <button>Create an account</button>
                    </Link>
                </div>

                {/* ----------------------- */}
                {/* Account Card Details #2 */}
                {/* ----------------------- */}

                <form className="card" onSubmit={loginHandler}>
                    <span className="card-title">
                        I already have an account
                    </span>

                    <div className="card-button-frame">
                        <span>Email address *</span>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.currentTarget.value)}
                            placeholder="example@gmail.com"

                            required
                            autoComplete="email"
                            autoCorrect="off"
                            spellCheck={false}

                            pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                        />
                    </div>

                    <div className="card-button-frame" style={{ marginTop: "10px" }}>
                        <span>Password *</span>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.currentTarget.value)}
                            placeholder="********"

                            required
                            minLength={8}
                            autoComplete="new-password"
                            spellCheck={false}

                            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$"
                            title="Password must be at least 8 characters long and include at least 1 uppercase letter, 1 lowercase letter, and 1 number. No spaces or special characters allowed."
                        />
                    </div>

                    <div className="frc-captcha">
                        <span ref={captchaRef}></span>
                    </div>

                    <div className="card-button">
                        <button style={{ width: "40%" }}>Login</button>
                    </div>

                    <Link to="/forgot-password" className="card-password-reset-text">
                        <span style={{ color: "inherit" }}>I forgot my password</span>
                    </Link>
                </form>
            </div>
        </div>
    )
};