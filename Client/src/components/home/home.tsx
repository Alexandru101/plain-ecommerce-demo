// Modules //
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaRegStar, FaStarHalfAlt, FaStar } from "react-icons/fa";
import "./home.css";

// Images //
import SeaHorizenImg from "../../assets/sea-horizen.jpg";
import Mens_essentials_hoodie_1 from "../../assets/products/Mens_essentials_hoodie/1.png";
import Mens_heavyweight_tshirt_1 from "../../assets/products/Mens_heavyweight_Tshirts/1.png";
import Mens_relaxed_fit_joggers_1 from "../../assets/products/Mens_relaxed_fit_joggers/1.png";
import Vivobarefoot_primus_lite_1 from "../../assets/products/Vivobarefoot_primus_lite/1.png";
import Mens_grey_overshirt from "../../assets/products/Mens_grey_overshirt/1.png";

export const productImages: Record<string, string> = {
    "Mens_heavyweight_tshirt": Mens_heavyweight_tshirt_1,
    "Mens_essentials_hoodie": Mens_essentials_hoodie_1,
    "Mens_relaxed_fit_joggers": Mens_relaxed_fit_joggers_1,
    "Vivobarefoot_primus_lite_mens": Vivobarefoot_primus_lite_1,
    "Mens_grey_overshirt": Mens_grey_overshirt
};

// Types //
import type { Product } from "../../utils/Types.tsx";

const GET_PRODUCTS_API = `${import.meta.env.VITE_BACKEND_PORT}/api/get-products`;

export default function Home() {
    // Variables //
    const sectionRef = useRef<HTMLDivElement | null>(null);

    // State variables //
    const [products, setProducts] = useState<Product[] | null>([]);
    const [showProducts, setShowProducts] = useState<boolean>(false);

    // Loading products //
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(GET_PRODUCTS_API, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                const data = await response.json();
                if (data.success) {
                    setProducts(data.products);
                }

                console.log(data);
            } catch(err) {
                console.error(`Error fetching products: ${err}`);
            }
        }

        fetchProducts();
    }, []);

    // Applying products animation //
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setShowProducts(entry.isIntersecting)
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, [])

    return (
        <div id="home-container">
            <section id="home-heading">
                <img src={SeaHorizenImg} alt="sea-horizen" id="hero-img" />

                <div id="home-heading-container">
                    <span id="home-heading-title">
                        Where quality meets simplicity
                    </span>

                    <span id="home-heading-description">
                        Discover clothes that combine lasting quality with minimalist design.
                    </span>

                    <div id="home-heading-buttons">
                        <Link to="/men" className="home-heading-button">Shop men</Link>
                        <Link to="/women" className="home-heading-button">Shop women</Link>
                    </div>
                </div>

                <span className="hero-text">Scroll Down</span>
                <div className="scroll-line" />
            </section>

            <div id="home-content">
                <section className="home-section" ref={sectionRef}>
                    <div className="home-section-title">
                        <span>New Arrivals</span>
                        <hr className="divider" />
                    </div>
            
                    <div className="home-section-content">
                        {products?.filter(product => product.category === "New Arrivals").slice(0, 6).map((product, index) => (
                            <div 
                                key={product._id} 
                                className={`home-section-content-card ${showProducts ? "show" : ""}`}
                                style={{ transitionDelay: `${index * 0.05}s`}}    
                            >
                                <img
                                    src={productImages[product.imgFolder]}
                                    alt={product.name}
                                    className="home-section-content-card-image"
                                />

                                <div className="home-section-content-card-desc">
                                    <span style={{ fontSize: "16px" }}>{product.name}</span>
                                    <span style={{ fontSize: "18px" }}>{`£${product.price.toFixed(2)}`}</span>

                                    <div className="home-section-content-card-desc-stars">
                                        {Array(5).fill(0).map((_, i) => {
                                            if (i < Math.floor(product.rating)) {
                                                return <FaStar key={i} />
                                            }

                                            if (i < product.rating) {
                                                return <FaStarHalfAlt key={i} />
                                            }

                                            return <FaRegStar key={i} />
                                        })}

                                        <span style={{ paddingLeft: "0.5rem" }}>(120)</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};