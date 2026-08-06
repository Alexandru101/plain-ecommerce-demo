// Modules //
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";

// Utils //
import SoundBridge from "./utils/SoundManager.tsx";
import NotificationManager from "./utils/Notification.tsx";
import Navbar from "./navbar/navbar.tsx";
import Footer from "./footer/footer.tsx";

// Components //
import Home from "./components/home/home.tsx";
import Reviews from "./components/reviews/reviews.tsx";
import ExclusiveOffers from "./components/exclusive-offers/exclusive-offers.tsx";
import Account from "./components/account/account.tsx";
import Search from "./components/search/search.tsx";
import Cart from "./components/cart/cart.tsx";

// Components/Auth //
import Login from "./components/auth/login/login.tsx";
import Create from "./components/auth/create/create.tsx";
import ForgotPassword from "./components/auth/forgot-password/forgot-password.tsx";
import ResetPassword from "./components/auth/reset-password/reset.password.tsx";

// Components/newsletter //
import NewsletterEmailVerification from "./components/newsletter/email-verification.tsx";

function NotificationListener() {
  useEffect(() => {
    const handler = (args: any) => {
      const { type, message, duration } = args.detail;
      NotificationManager.createNotification(type, message, duration);
    };

    window.addEventListener("app-notification", handler);
    
    return () => window.removeEventListener("app-notification", handler);
  }, []);

  return null;
};

export default function App() {
  return (
    <Router>
      <SoundBridge />
      <NotificationListener />

      <div>
        <Navbar />

        <Routes>
            {/* Home Page */}
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />

            <Route path="/reviews" element={<Reviews />} />
            <Route path="/exclusive-offers" element={<ExclusiveOffers />} />
            <Route path="/account" element={<Account />} />
            <Route path="/search" element={<Search />} />

            {/* Login / Signup / Forgot-Reset Password */}
            <Route path="/login" element={<Login />} />
            <Route path="/create" element={<Create />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Newsletter - email verification */}
            <Route path="/newsletter-email-verification" element={<NewsletterEmailVerification />} />

            <Route path="/cart" element={<Cart />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  )
}