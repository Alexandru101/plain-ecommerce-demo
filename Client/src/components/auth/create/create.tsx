// Utils //
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { captchaSDK } from "../../../utils/FriendlyCaptchaSDK";
import { emitNotification } from "../../../utils/Notification";
import ApiClient from "../../../utils/ApiClient.tsx";
import "./create.css";

const REGISTRATION_API = `${import.meta.env.VITE_BACKEND_PORT}/api/registration`;

export default function Create() {
    // State Variables //
    const [email, setEmail] = useState<string>("");
    const [emailTouched, setEmailTouched] = useState<boolean>(false);

    const [gender, setGender] = useState<string>("");

    const [firstName, setFirstName] = useState<string>("");
    const [firstNameTouched, setFirstNameTouched] = useState<boolean>(false);

    const [lastName, setLastName] = useState<string>("");
    const [lastNameTouched, setLastNameTouched] = useState<boolean>(false);

    const [password, setPassword] = useState<string>("");
    const [passwordTouched, setPasswordTouched] = useState<boolean>(false);

    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [confirmPasswordTouched, setConfirmPasswordTouched] = useState<boolean>(false);

    // Variables //
    const navigate = useNavigate();
    const captchaRef = useRef<any>(null);
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
    const signupHandler = async (event: React.SubmitEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();

        const captchaID = captchaWidgetRef.current?.getResponse();
        if (!captchaID) return;
        if (password !== confirmPassword) return;

        try {
            const data = await ApiClient.post<{ success: boolean, message: string }>(REGISTRATION_API, {
                body: { email, gender, firstName, lastName, password, captchaID }
            });

            if (data.success) {
                emitNotification({
                    type: "success",
                    message: data.message
                });

                navigate("/login");
            } else {
                emitNotification({
                    type: "alert",
                    message: data.message,
                    duration: 6000
                });

                captchaWidgetRef.current?.reset?.();
            }
        } catch (err) {
            console.log(`Failed to post to api: ${err}`);
        };
    };

    // Page Styling //
    return (
        <div id="hero">
            <div id="header">
                <span id="header-title">Create my account</span>
                <span id="header-desc">
                    Explore the latest trends in fashion and streetwear.
                    Sign up today to unlock exclusive deals, track your orders easily, and get personalised recommendations made just for you.
                </span>
            </div>

            <div id="header-contact-frame">
                <span>For any issues, please contact</span>
                <a href="tel:+447526025237">+44 (0) 7526 025237</a>
                <span>or</span>
                <a href="mailto:alexandru_dev15@proton.me">alexandru_dev15@proton.me</a>
            </div>

            <form id="registration" onSubmit={signupHandler}>
                <div className="registration-container">
                    <div className="registration-field">
                        <span className="registration-field-title">Email address *</span>
                        <input 
                            className="registration-field-input"
                            style={(emailTouched && !emailRegex.test(email)) ? errorInputStyling : defaultInputStyling}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.currentTarget.value)}
                            onBlur={() => setEmailTouched(true)}
                            placeholder="example@gmail.com"

                            required
                            autoComplete="email"
                            autoCorrect="off"
                            spellCheck={false}

                            pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                        />
                    </div>

                    <div className="registration-field">
                        <span className="registration-field-title">Gender *</span>

                        <select className="registration-field-dropdown"
                            value={gender}
                            onChange={(e) => setGender(e.currentTarget.value)}
                            required 
                        >
                            <option value="" disabled>Choose gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                </div>

                <div className="registration-container">
                    <div className="registration-field">
                        <span className="registration-field-title">First Name *</span>
                        <input
                            className="registration-field-input"
                            style={(firstNameTouched && !nameRegex.test(firstName)) ? errorInputStyling : defaultInputStyling}
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.currentTarget.value)}
                            onBlur={() => setFirstNameTouched(true)}
                            placeholder="John"
                            
                            required
                            minLength={1}
                            maxLength={20}

                            autoComplete="given-name"
                            autoCapitalize="words"
                            autoCorrect="off"
                            spellCheck={false}

                            pattern="^[A-Za-z]+$"
                            title="First name can only contain letters (no spaces or symbols)"
                        />
                    </div>
                
                    <div className="registration-field">
                        <span className="registration-field-title">Last Name *</span>
                        <input
                            className="registration-field-input"
                            style={(lastNameTouched && !nameRegex.test(lastName)) ? errorInputStyling : defaultInputStyling}
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.currentTarget.value)}
                            onBlur={() => setLastNameTouched(true)}
                            placeholder="Doe"
                            
                            required
                            minLength={1}
                            maxLength={20}

                            autoComplete="family-name"
                            autoCapitalize="words"
                            autoCorrect="off"
                            spellCheck={false}

                            pattern="^[A-Za-z]+$"
                            title="Last name can only contain letters (no spaces or symbols)"
                        />
                    </div>
                </div>

                <div className="registration-container">
                    <div className="registration-field">
                        <span className="registration-field-title">Password *</span>
                        <input
                            className="registration-field-input"
                            style={(passwordTouched && !passwordRegex.test(password)) ? errorInputStyling : defaultInputStyling}
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.currentTarget.value)}
                            onBlur={() => setPasswordTouched(true)}
                            placeholder="********"

                            required
                            minLength={8}
                            autoComplete="new-password"
                            spellCheck={false}
                            
                            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$"
                            title="Password must be at least 8 characters long and include at least 1 uppercase letter, 1 lowercase letter, and 1 number. No spaces or special characters allowed."
                        />
                    </div>

                    <div className="registration-field">
                        <span className="registration-field-title">Confirm password *</span>
                        <input 
                            className="registration-field-input"
                            style={(confirmPasswordTouched && !passwordRegex.test(confirmPassword)) ? errorInputStyling : defaultInputStyling}
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.currentTarget.value)}
                            onBlur={() => setConfirmPasswordTouched(true)}
                            placeholder="********"

                            required
                            minLength={8}
                            autoComplete="new-password"
                            spellCheck={false}

                            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$"
                            title="Password must be at least 8 characters long and include at least 1 uppercase letter, 1 lowercase letter, and 1 number. No spaces or special characters allowed."
                        />
                    </div>
                </div>

                <div className="frc-captcha">
                    <span ref={captchaRef}></span>
                </div>

                <div className="registration-container">
                    <div id="registration-button-container">
                        <button type="submit" id="registration-button">Create account</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

// Regex //
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const nameRegex = /^[A-Za-z]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

// Empty Field Border Styling //
const errorInputStyling = { border: "1px solid #000" };
const defaultInputStyling = { border: "1px solid #a19f9f93" };