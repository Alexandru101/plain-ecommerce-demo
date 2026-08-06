// Utils //
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "./navbar.css";

export default function Navbar() {
    // Variables //
    const location = useLocation();
    const isHomepage = location.pathname === "/home";

    const [pageScrolled, setPageScrolled] = useState<boolean>(false);
    const [hidden, setHidden] = useState<boolean>(false);
    const lastScrollY = useRef<number>(0);

    // Detecting user scrolling //
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const lastY = lastScrollY.current;

            setPageScrolled(scrollY > 900);
            setHidden(scrollY > lastY);
            lastScrollY.current = scrollY;
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Navbar Styling //
    return (
        <nav id="navbar" className={`${(isHomepage && !pageScrolled) ? "homepage" : ""} ${hidden ? "hidden" : ""}`}>
            <div className="navbar-side left">
                <Link to="/home">
                    <span>Home</span>
                </Link>

                <Link to="/reviews">
                    <span>Reviews</span>
                </Link>

                <Link to="/exclusive-offers">
                    <span>Exclusive Offers</span>
                </Link>
            </div>

            <div id="navbar-logo">
                <Link to="/home">
                    <img src="/clothing_logo.png" alt="logo" />
                </Link>

                <div id="navbar-logo-links">
                    <Link to="/men">
                        <span style={{ fontSize: "17px", fontWeight: "600" }}>Men</span>
                    </Link>

                    <Link to="/women">
                        <span style={{ fontSize: "17px", fontWeight: "600" }} >Women</span>
                    </Link>
                </div>
            </div>

            <div className="navbar-side right">
                <Link to="/search">
                    <span>Search</span>
                </Link>

                <Link to="/account">
                    <span>Account</span>
                </Link>

                <Link to="/cart">
                    <span>Cart</span>
                </Link>
            </div>
        </nav>
    )
}