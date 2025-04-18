import React from 'react';

// Assume themeColors is available globally or via context/props
const themeColors = { brandPurple: '#5a239e', brandBeige: '#f6eeb4' };

const TestimonialCard = ({ quote, name, title, avatarText, delay = 0, className = '' }) => (
    <div className={`bg-white rounded-lg p-6 shadow-lg border border-gray-100 animate-on-scroll delay-${delay * 100} relative overflow-hidden ${className}`}>
         <svg className="absolute top-0 left-0 -mt-2 -ml-2 w-16 h-16 text-[--brand-purple] opacity-10 z-0" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true" style={{'--brand-purple': themeColors.brandPurple}}> <path d="M9.333 8h-2.667c-1.473 0-2.667 1.194-2.667 2.667v8c0 1.473 1.194 2.667 2.667 2.667h2.667v-13.334zm16 0h-2.667c-1.473 0-2.667 1.194-2.667 2.667v8c0 1.473 1.194 2.667 2.667 2.667h2.667v-13.334z"></path> </svg>
         <p className="text-gray-600 mb-5 italic relative z-10">"{quote}"</p>
         <div className="flex items-center relative z-10"> <img src={`https://placehold.co/40x40/${themeColors.brandBeige.substring(1)}/${themeColors.brandPurple.substring(1)}?text=${avatarText}`} alt={`${name} Avatar`} className="w-10 h-10 rounded-full mr-3 border-2 border-white shadow-sm" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/40x40/cccccc/ffffff?text=Err'; }} /> <div> <p className="font-semibold text-gray-900">{name}</p> <p className="text-sm text-gray-500">{title}</p> </div> </div>
     </div>
);

const TestimonialsSection = () => (
    <section id="testimonials" className="bg-white py-16 lg:py-24">
        <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16 animate-on-scroll"> Don't Just Take Our Word For It... </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                 <TestimonialCard quote="ClientWise completely organized..." name="Maria Garcia" title="Independent Agent" avatarText="MG" delay={0} />
                 <TestimonialCard quote="Our agency's conversion rate is up 20%..." name="David Chen" title="Agency Owner, SecureFuture" avatarText="DC" delay={1} />
                 <TestimonialCard quote="Finally, a CRM that understands..." name="Sarah Patel" title="Top Producer, InsureCo" avatarText="SP" delay={2} className="lg:block hidden" />
            </div>
            <div className="text-center animate-on-scroll delay-300">
                <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-6">Trusted by leading agencies across India</p>
                <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-6"> <img src="https://placehold.co/120x40/e5e7eb/9ca3af?text=Agency+1" alt="Agency Logo 1" className="h-8 grayscale opacity-70 hover:opacity-100 transition-opacity" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/120x40/cccccc/ffffff?text=Logo'; }}/> <img src="https://placehold.co/120x40/e5e7eb/9ca3af?text=Agency+2" alt="Agency Logo 2" className="h-8 grayscale opacity-70 hover:opacity-100 transition-opacity" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/120x40/cccccc/ffffff?text=Logo'; }}/> <img src="https://placehold.co/120x40/e5e7eb/9ca3af?text=Agency+3" alt="Agency Logo 3" className="h-8 grayscale opacity-70 hover:opacity-100 transition-opacity" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/120x40/cccccc/ffffff?text=Logo'; }}/> <img src="https://placehold.co/120x40/e5e7eb/9ca3af?text=Agency+4" alt="Agency Logo 4" className="h-8 grayscale opacity-70 hover:opacity-100 transition-opacity" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/120x40/cccccc/ffffff?text=Logo'; }}/> <img src="https://placehold.co/120x40/e5e7eb/9ca3af?text=Agency+5" alt="Agency Logo 5" className="h-8 grayscale opacity-70 hover:opacity-100 transition-opacity" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/120x40/cccccc/ffffff?text=Logo'; }}/> </div>
            </div>
        </div>
    </section>
);

export default TestimonialsSection;
