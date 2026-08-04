import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { captchaSDK } from "../../../utils/FriendlyCaptchaSDK";
import { emitNotification } from "../../../utils/Notification";
import ApiClient from "../../../utils/ApiClient.tsx";
import "./reset-password.css";

const RESET_PASSWORD_API = `${import.meta.env.VITE_BACKEND_PORT}/api/reset-password`;

export default function ResetPassword() {
    // State Variables //
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");

    // Variables //
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

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
    }, [])

    // Functions //
    const submitHandler = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (newPassword != confirmNewPassword) {
            emitNotification({
                type: "alert",
                message: "Passwords do not match.",
                duration: 6000
            });

            return;
        }

        const captchaID = captchaWidgetRef.current?.getResponse();
        if (!captchaID) return;

        try {
            const data = await ApiClient.post<{ success: boolean, message: string }>(RESET_PASSWORD_API, {
                body: { password: newPassword, captchaID, token }
            });
            
            if (data.success) {
                emitNotification({
                    type: "success",
                    message: data.message
                });

                navigate("/home");
            } else {
                emitNotification({
                    type: "alert",
                    message: data.message,
                    duration: 6000
                })

                captchaWidgetRef.current?.reset();
            }
        } catch(err) {
            console.log(`Submit error: ${err}`);
        }
    }

    return (
        <div id="reset-password-hero">
            <div id="reset-password-header">
                <span id="reset-password-header-title">Reset Password</span>

                <span id="reset-password-header-desc">
                    Enter your new password below. Choose a strong, unique password to keep your account secure.
                </span>
            </div>

            <form id="reset-password-container" onSubmit={submitHandler}>
                <div className="reset-password-input-frame">
                    <span>New password *</span>

                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.currentTarget.value)}
                        placeholder="********"

                        required
                        minLength={8}
                        autoComplete="new-password"
                        spellCheck={false}
                        
                        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$"
                        title="Password must be at least 8 characters long and include at least 1 uppercase letter, 1 lowercase letter, and 1 number. No spaces or special characters allowed."
                    />
                </div>

                <div className="reset-password-input-frame">
                    <span>Confirm new password *</span>

                    <input
                        type="password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.currentTarget.value)}
                        placeholder="********"

                        required
                        minLength={8}
                        autoComplete="new-password"
                        spellCheck={false}
                        
                        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$"
                        title="Password must be at least 8 characters long and include at least 1 uppercase letter, 1 lowercase letter, and 1 number. No spaces or special characters allowed."
                    />
                </div>

                <div id="captcha-container">
                    <div className="frc-captcha">
                        <span ref={captchaRef}></span>
                    </div>
                </div>

                <button id="reset-password-button">
                    <span>Change password</span>
                </button>
            </form>
        </div>
    )
};