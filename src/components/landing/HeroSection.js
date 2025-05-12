import React from 'react';
// import { Link } from 'react-router-dom'; // Not used for these CTAs as they open new tabs
import Button from '../common/Button'; // Assuming this path is correct for your Button component

const themeColors = {
    brandPurple: '#5a239e',
    brandBeige: '#f6eeb4',
    brandBeigeHover: '#fbf8e9',
    brandPurpleHover: '#703abc',
    brandPurpleDeep: '#3b0770'
};

const HeroSection = () => {
    // In a real React app, this function might come from props or context if it involves router navigation
    const navigateToLogin = () => {
        window.open('/login', '_blank', 'noopener,noreferrer');
    };
    
    const navigateToFeatures = () => {
        window.open('/features', '_blank', 'noopener,noreferrer'); // Or use React Router Link for internal navigation
    };

    const features = [
        { text: "360° Client View", icon: "fas fa-users" },
        { text: "Policy Management", icon: "fas fa-coins" },
        { text: "Sales Recommandations from AI", icon: "fas fa-robot" },
        { text: "Auto-Reminders ", icon: "fas fa-bell" },
        { text: "End to End Agency Management", icon: "fas fa-solid fa-building" },
        { text: "Marketing And Much More ", icon: "fas fa-ellipsis-h" }

    ];

    // CSS styles (can be moved to a separate .css file and imported)
    const styles = `
        @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in-down { animation: fadeInDown 0.8s ease-out forwards; opacity: 0; }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; opacity: 0; }
        
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }

        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            font-weight: 600;
            transition: all 0.3s ease;
            text-align: center;
            cursor: pointer;
        }
        .btn-primary {
            background-color: var(--brand-beige);
            color: var(--brand-purple);
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
        }
        .btn-primary:hover {
            background-color: var(--brand-beige-hover);
            color: var(--brand-purple-deep);
            transform: translateY(-2px);
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
        }
        .btn-secondary {
            background-color: transparent;
            color: var(--brand-beige);
            border: 2px solid var(--brand-beige);
        }
        .btn-secondary:hover {
            background-color: var(--brand-beige);
            color: var(--brand-purple);
            transform: translateY(-2px);
        }
        .btn i { margin-right: 0.5rem; }

        @keyframes gradientAnimation {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        .animated-gradient {
            background: linear-gradient(135deg, var(--brand-purple), var(--brand-purple-deep), #4a0e6c, var(--brand-purple-hover)); /* Added another color stop */
            background-size: 400% 400%; /* Increased size for smoother/slower perceived movement if desired, or keep smaller for faster changes */
            animation: gradientAnimation 12s ease infinite; /* Speed up animation from 15s to 12s */
        }

        /* Animation for decorative shapes */
        @keyframes subtleDrift {
            0% { transform: translate(0, 0) scale(1); opacity: 0.1; }
            25% { transform: translate(5px, 8px) scale(1.02); opacity: 0.15;}
            50% { transform: translate(-3px, -6px) scale(0.98); opacity: 0.1;}
            75% { transform: translate(-6px, 4px) scale(1.01); opacity: 0.12;}
            100% { transform: translate(0, 0) scale(1); opacity: 0.1; }
        }
         @keyframes subtlePulse {
            0%, 100% { opacity: 0.08; transform: scale(0.98); }
            50% { opacity: 0.15; transform: scale(1.02); }
        }


        .hero-section::before, .hero-section::after {
            content: '';
            position: absolute;
            border-radius: 50%;
            z-index: 0;
            /* filter: blur(50px); */ /* Keep blur for soft edges */
        }
        .hero-section::before { /* Larger, subtle circle */
            width: 350px; /* Slightly larger */
            height: 350px;
            background: var(--brand-beige-hover);
            top: 5%; /* Adjusted position */
            left: 2%;
            filter: blur(60px); /* Increased blur */
            animation: subtleDrift 25s ease-in-out infinite alternate; /* Added animation */
        }
        .hero-section::after { /* Smaller, different position */
            width: 250px; /* Slightly larger */
            height: 250px;
            background: var(--brand-beige);
            bottom: 10%; /* Adjusted position */
            right: 5%;
            filter: blur(50px); /* Increased blur */
            animation: subtlePulse 20s ease-in-out infinite alternate; /* Added different animation */
            animation-delay: -5s; /* Offset animation start */
        }
        .font-serif { font-family: 'Georgia', 'Times New Roman', serif; }
    `;

    return (
        <>
            <style>{styles}</style>
            <section 
                className="hero-section text-center py-24 lg:py-32 relative overflow-hidden animated-gradient"
                style={{
                    '--brand-purple': themeColors.brandPurple,
                    '--brand-beige': themeColors.brandBeige,
                    '--brand-beige-hover': themeColors.brandBeigeHover,
                    '--brand-purple-deep': themeColors.brandPurpleDeep,
                    '--brand-purple-hover': themeColors.brandPurpleHover, // Added for gradient
                }}
            >
                <div className="container mx-auto px-6 relative z-10">
                    <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in-down">
                        Increase Sales with <span className="text-yellow-300">AI </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-white opacity-90 mb-8 max-w-3xl mx-auto animate-fade-in-down delay-100">
                        360 &#176; AI driven Software for  Insurance Agents and Agencies
                    </p>
                    
                    <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4 mb-10 max-w-4xl mx-auto animate-fade-in-up delay-200">
                        {features.map((feature, index) => (
                            <span 
                                key={index} 
                                className="bg-white/25 backdrop-blur-md text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-full flex items-center shadow-sm hover:bg-white/30 transition-all duration-300 cursor-default"
                            >
                                <i className={`${feature.icon} mr-2 opacity-80`}></i> {feature.text}
                            </span>
                        ))}
                    </div>
                    <div className="mt-10 mb-10 animate-fade-in-up delay-500">
                        <p className="text-lg text-white ">Join hundreds of insurance agents transforming their business with ClientWise.</p>
                    </div>
                  
                    
                    <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 animate-fade-in-up delay-400">
                        <Button 
                            variant="primary" 
                            className="w-full sm:w-auto text-base lg:text-sm btn-primary"
                            onClick={navigateToLogin}
                        >
                            <i className="fas fa-user-plus"></i> Sign Up Free
                        </Button> 
                        <Button 
                            variant="secondary" 
                            className="w-full sm:w-auto text-base lg:text-sm btn-secondary"
                            onClick={navigateToFeatures}
                        >
                            <i className="fas fa-arrow-circle-right"></i> Learn More
                        </Button>
                    </div>
                    <div className="flex mt-12 justify-center items-center space-x-3 mb-12 text-white opacity-90 text-sm animate-fade-in-up delay-300">
                        <i className="fas fa-shield-alt text-xl text-yellow-300"></i>
                        <span>Backed by Top Industry Experts & Robust Technology</span>
                    </div>
                  
                </div>
            </section>
        </>
    );
};

export default HeroSection;
