import { useRef, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { captchaSDK } from "../../../utils/FriendlyCaptchaSDK";
import { emitNotification } from "../../../utils/Notification";
import ApiClient from "../../../utils/ApiClient.tsx";
import "./forgot-password.css";

const SEND_EMAIL_API = `${import.meta.env.VITE_BACKEND_PORT}/api/forgot-password`;

export default function ForgotPassword() {    
    // State Variables //
    const [email, setEmail] = useState<string>("");

    // Variables //
    const navigate = useNavigate();
    const captchaRef = useRef<any>(null);
    const captchaWidgetRef = useRef<any>(null);

    // Setting up captcha //
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
    const submitHandler = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const captchaID = captchaWidgetRef.current?.getResponse();
        if (!captchaID) return;

        try {
            const data = await ApiClient.post(SEND_EMAIL_API, {
                body: { email: email.trim(), captchaID }
            });
            
            if (data.success) {
                emitNotification({ 
                    type: "info",
                    message: data.message,
                    duration: 6000
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
            console.log(`Sumbit Error: ${err}`);
        }
    }
    
    return (
        <div id="forgot-password-hero">
            <div id="forgot-password-header">
                <span id="forgot-password-header-title">Forgot your password?</span>
                
                <span id="forgot-password-header-desc">
                    Please enter your email address below.
                    If your account is in our database,
                    you will receive instructions that will then allow you to reset your password.
                </span>
            </div>

            <form id="forgot-password-container" onSubmit={submitHandler}>
                <div id="forgot-password-input-frame">
                    <span>Email address*</span>
                    
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

                    <div className="frc-captcha">
                        <span style={{ width: "30rem" }} ref={captchaRef}></span>
                    </div>
                </div>

                <div id="forgot-password-button-frame">
                    <button>Send Code</button>
                </div>

                <Link to="/login">
                    <span style={{ color: "inherit" }}>Back to customer login</span>
                </Link>
            </form>
        </div>
    )
};