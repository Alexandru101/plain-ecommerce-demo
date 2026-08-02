import { useSearchParams, useNavigate } from "react-router-dom";
import { emitNotification } from "../../utils/Notification";
import "./email-verification.css";
import { emit } from "node:cluster";

// Backend API //
const VERIFY_EMAIL_API = `${import.meta.env.VITE_BACKEND_PORT}/api/newsletter-verify-email`;

export default function NewsletterEmailVerification() {
    // Variables //
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    // Functions //
    const submitHandler = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!token) {
            emitNotification({
                type: "alert",
                message: "Error missing verification token, please try again."
            });

            navigate("/home");
            return;
        }

        try {
            const response = await fetch(VERIFY_EMAIL_API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token })
            });

            const data = await response.json();
            
            if (!response.ok) {
                emitNotification({
                    type: "alert",
                    message: data.message || "Verification failed.",
                    duration: 6000
                });

                return;
            }

            if (data.success) {
                emitNotification({
                    type: "success",
                    message: data.message
                });

                navigate("/home")
            } else {
                emitNotification({
                    type: "alert",
                    message: data.message,
                    duration: 6000
                });
            }
        } catch(err) {
            console.error(err);

            emitNotification({
                type: "alert",
                message: "Something went wrong, please try again later."
            });
        }
    };

    return (
        <form id="newsletter-hero" onSubmit={submitHandler}>
            <h1 id="newsletter-title">Verify your email</h1>
            
            <span id="newsletter-desc">
                You're one click away from unlocking <br />
                10% off your first order and exclusive updates.
            </span>

            <button type="submit" id="newsletter-button">Verify Email</button>

            <span id="newsletter-info">
                By verifying, you'll start receiving <br />
                new arrivals, exclusive offers and updates
            </span>
        </form>
    )
}