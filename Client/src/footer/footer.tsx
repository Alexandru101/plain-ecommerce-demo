// Utils //
import { useState, useEffect } from "react";
import { emitNotification } from "../utils/Notification";
import "./footer.css";

// Icons //
import { FiTruck, FiLock, FiInstagram } from "react-icons/fi";
import { LuRefreshCw, LuCopyright } from "react-icons/lu";
import { FaTiktok, FaPinterest, FaFacebook, FaCcVisa, FaCcMastercard, FaCcAmazonPay, FaCcApplePay } from "react-icons/fa";

// Backend Newsletter Subscribe API //
const NEWSLETTER_SUBSCRIBE_API = `${import.meta.env.VITE_BACKEND_PORT}/api/newsletter-subscribe`;

// Configs //
const SOCIALS_ICON_SIZE = 25;

export default function Footer() {
    // State Variables //
    const [email, setEmail] = useState<string>("");

    // Functions //
    const newsletterSubmitHandler = async (e: React.SubmitEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        try {
            const response = await fetch(NEWSLETTER_SUBSCRIBE_API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim().toLowerCase() })
            });

            const data = await response.json();
            if (data.success) {
                emitNotification({
                    type: "success",
                    message: data.message
                });
            } else {
                emitNotification({
                    type: "alert",
                    message: data.message
                });
            }
        } catch(err) {
            console.error(err);
        }
    };

    return (
        <div id="footer">
            <div id="footer-container">
                <section id="footer-brand">
                    <span id="footer-brand-title">Cloth</span>
                    
                    <div id="footer-brand-desc">
                        <span>Timeless essentials.</span>
                        <span>Designed for everyday wear.</span>
                        <span>Minimal. Modern. Made for you.</span>
                    </div>

                    <div id="footer-newsletter">
                        <span className="footer-heading">Stay in the loop</span>
                        <span className="footer-text">Get 10% of your first order.</span>

                        <form id="footer-newsletter-form" onSubmit={newsletterSubmitHandler}>
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

                            <button>Subscribe</button>
                        </form>
                    </div>

                    <div id="footer-brand-quotes">
                        <div>
                            <FiTruck size={24} strokeWidth={1.25} />
                            <span>Free shipping over £75</span>
                        </div>

                        <div>
                            <LuRefreshCw size={24} strokeWidth={1.25} />
                            <span>Easy 30-day return</span>
                        </div>

                        <div>
                            <FiLock size={24} strokeWidth={1.25} />
                            <span>Secure checkout</span>
                        </div>
                    </div>
                </section>

                <section className="footer-section">
                    <span className="footer-section-title">SHOP</span>

                    <a href="/home">Home</a>
                    <a href="exclusive-offers">Exclusive Offers</a>
                    <a href="/men">Men</a>
                    <a href="/women">Women</a>
                    <a href="/">Collections</a> {/* Collections is not a page this is just for design */}
                    <a href="/reviews">Reviews</a>
                </section>

                <section className="footer-section">
                    <span className="footer-section-title">HELP</span>

                    {/* -------------------------- */}
                    {/* "a" Links not yet finished */}
                    {/* -------------------------- */}

                    <a href="/">Contact Us</a>
                    <a href="/">Shipping</a>
                    <a href="/">Returns & Exchanges</a>
                    <a href="/">FAQ</a>
                    <a href="/">Size Guide</a>
                    <a href="/">Track Order</a>
                </section>

                <section className="footer-section">
                    <span className="footer-section-title">FOLLOW US</span>

                    <div className="footer-media-container">
                        <FiInstagram className="social-icon" size={SOCIALS_ICON_SIZE} strokeWidth={2} />
                        <a href="https://www.instagram.com/">Instagram</a>
                    </div>

                    <div className="footer-media-container">
                        <FaTiktok className="social-icon" size={SOCIALS_ICON_SIZE} strokeWidth={2} />
                        <a href="https://www.tiktok.com/">Tiktok</a>
                    </div>

                    <div className="footer-media-container">
                        <FaPinterest className="social-icon" size={SOCIALS_ICON_SIZE} strokeWidth={2} />
                        <a href="https://www.pinterest.com/">Pintrest</a>
                    </div>

                    <div className="footer-media-container">
                        <FaFacebook className="social-icon" size={SOCIALS_ICON_SIZE} strokeWidth={2} />
                        <a href="https://en-gb.facebook.com/">Facebook</a>
                    </div>
                </section>
            </div>

            <div id="footer-extra">
                <div>
                    <LuCopyright size={13} strokeWidth={2} />
                    <span>2026 Cloth. All rights resserved.</span>
                </div>

                <div style={{ justifyContent: "center" }}>
                    <span>Privacy Policy</span>
                    <span> | </span>
                    <span>Terms of Service</span>
                    <span> | </span>
                    <span>Cookies</span>
                </div>

                <div style={{ justifyContent: "flex-end"}}>
                    <FaCcVisa size={50} strokeWidth={0} />
                    <FaCcMastercard size={50} strokeWidth={0} />
                    <FaCcAmazonPay size={50} strokeWidth={0} />
                    <FaCcApplePay size={50} strokeWidth={0} />
                </div>
            </div>
        </div>
    )
};