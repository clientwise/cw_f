import React, { useState, useEffect, useMemo, useCallback } from 'react'; // Added useCallback here too
import { Link } from 'react-router-dom';
import Button from '../components/common/Button'; // Adjust path if needed
import AddProductModal from '../components/products/AddProductModal'; // Adjust path

// Assume themeColors is available globally or via context/props
const themeColors = {
    brandPurple: '#5a239e',
    brandPurpleHover: '#703abc',
    purple100: '#ede9fe',
    purple600: '#7e22ce',
    gray100: '#f3f4f6',
    gray200: '#e5e7eb',
    gray500: '#6b7280',
    gray600: '#4b5563',
    gray700: '#374151',
    gray800: '#1f2937',
    white: '#ffffff',
    green100: '#dcfce7',
    green800: '#166534',
    yellow100: '#fef9c3',
    yellow800: '#854d0e',
    red100: '#fee2e2',
    red600: '#dc2626',
    red800: '#991b1b',
    blue100: '#dbeafe',
    blue600: '#2563eb',
};

// Placeholder data for products - Replace with API call later
// const placeholderProducts = [
//   { id: 'prod_health_01', category: 'Health Insurance', name: 'MediSecure Plus', insurer: 'SecureHealth General', description: {String: 'Comprehensive family floater plan.', Valid: true}, insurerLogo: {String: `https://placehold.co/40x40/${themeColors.purple100.substring(1)}/${themeColors.brandPurple.substring(1)}?text=SH`, Valid: true}, status: 'Active' },
//   { id: 'prod_life_01', category: 'Life Insurance', name: 'TermProtect Max', insurer: 'InsureCo Life', description: {String: 'High cover term plan with riders.', Valid: true}, insurerLogo: {String: `https://placehold.co/40x40/dcfce7/15803d?text=IL`, Valid: true}, status: 'Active' },
//   { id: 'prod_motor_01', category: 'Motor Insurance', name: 'DriveSafe Comprehensive', insurer: 'AutoProtect Motor', description: {String: 'Full coverage car insurance.', Valid: true}, insurerLogo: {String: `https://placehold.co/40x40/cffafe/0e7490?text=AP`, Valid: true}, status: 'Active' },
//   { id: 'prod_travel_01', category: 'Travel Insurance', name: 'Global Voyager Secure', insurer: 'Global Voyager Travel', description: {String: 'International travel coverage.', Valid: true}, insurerLogo: {String: `https://placehold.co/40x40/fef3c7/b45309?text=GV`, Valid: true}, status: 'Active' },
//   { id: 'prod_health_02', category: 'Health Insurance', name: 'SeniorCare Gold', insurer: 'SecureHealth General', description: {String: 'Specialized plan for senior citizens.', Valid: true}, insurerLogo: {String: `https://placehold.co/40x40/${themeColors.purple100.substring(1)}/${themeColors.brandPurple.substring(1)}?text=SH`, Valid: true}, status: 'Active' },
//   { id: 'prod_life_02', category: 'Life Insurance', name: 'InvestSecure ULIP', insurer: 'InsureCo Life', description: {String: 'Unit-linked investment & insurance plan.', Valid: true}, insurerLogo: {String: `https://placehold.co/40x40/dcfce7/15803d?text=IL`, Valid: true}, status: 'Inactive' },
//   { id: 'prod_motor_02', category: 'Motor Insurance', name: 'BikeProtect Basic', insurer: 'AutoProtect Motor', description: {String: 'Third-party liability for two-wheelers.', Valid: true}, insurerLogo: {String: `https://placehold.co/40x40/cffafe/0e7490?text=AP`, Valid: true}, status: 'Active' },
//   { id: 'prod_prop_01', category: 'Property Insurance', name: 'HomeSecure Plus', insurer: 'SecureHome General', description: {String: 'Home structure and content insurance.', Valid: true}, insurerLogo: {String: `https://placehold.co/40x40/fce7f3/9d174d?text=SG`, Valid: true}, status: 'Active' },
// ];

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState('All Categories');
    const [insurerFilter, setInsurerFilter] = useState('All Insurers');
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

    // Fetch products function wrapped in useCallback
    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        console.log(`Fetching products with filters: Category=${categoryFilter}, Insurer=${insurerFilter}, Search=${searchTerm}`);

        const token = localStorage.getItem('authToken');
        if (!token) { setError("Authentication error: Not logged in."); setIsLoading(false); return; }

        const params = new URLSearchParams();
        if (categoryFilter && categoryFilter !== 'All Categories') params.append('category', categoryFilter);
        if (insurerFilter && insurerFilter !== 'All Insurers') params.append('insurer', insurerFilter);
        if (searchTerm) params.append('search', searchTerm);
        // TODO: Add limit and offset params

        const url = `http://localhost:8080/api/products?${params.toString()}`;

        try {
            const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
            if (!response.ok) { let e = `Err: ${response.status}`; try { const d = await response.json(); e = d.error || e; } catch {} throw new Error(e); }
            const data = await response.json();
            setProducts(data || []);
            console.log("Fetched products:", data);
        } catch (err) { console.error("Failed to fetch products:", err); setError(err.message || "An error occurred."); setProducts([]);
        } finally { setIsLoading(false); }
    }, [categoryFilter, insurerFilter, searchTerm]); // Dependencies for refetching

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Memoized filtering logic (use this if backend doesn't filter)
    // If backend filters, just use 'products' directly: const filteredProducts = products;
    const filteredProducts = useMemo(() => {
        // If backend handles filtering, simply return products:
        // return products;

        // Client-side filtering (if backend doesn't filter):
        return products.filter(p =>
            (categoryFilter === 'All Categories' || p.category === categoryFilter) &&
            (insurerFilter === 'All Insurers' || p.insurer === insurerFilter) &&
            (searchTerm === '' ||
             p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             p.description?.String?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             p.insurer.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [products, categoryFilter, insurerFilter, searchTerm]);

    const insurers = useMemo(() => ['All Insurers', ...new Set(products.map(p => p.insurer))], [products]);
    const handleOpenAddProductModal = () => setIsAddProductModalOpen(true);
    const handleCloseAddProductModal = () => setIsAddProductModalOpen(false);
    const handleProductAdded = () => {
        handleCloseAddProductModal(); // Close modal
        fetchProducts(); // Refresh the product list
    };
    return (
        <div style={{'--brand-purple': themeColors.brandPurple, '--brand-purple-hover': themeColors.brandPurpleHover}}>
             <div className="flex flex-wrap justify-between items-center gap-4 mb-6 p-4 bg-white rounded-t-lg shadow-sm border border-gray-200"> <h2 className="text-lg font-semibold text-gray-700">Product Catalog</h2> 
             <Button onClick={handleOpenAddProductModal} variant="brand" className="px-4 py-2 text-sm">
                    <i className="fas fa-plus mr-2"></i> Add New Product
                </Button>
             </div>
             <div className="p-4 md:p-6 mb-6 bg-white rounded-lg shadow-sm border border-gray-200"> <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end"> <div> <label htmlFor="category" className="block text-xs font-medium text-gray-700 mb-1">Category</label> <select id="category" name="category" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} disabled={isLoading} className="block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[--brand-purple] focus:border-[--brand-purple] sm:text-sm"> <option>All Categories</option> <option>Health Insurance</option> <option>Life Insurance</option> <option>Motor Insurance</option> <option>Travel Insurance</option> <option>Property Insurance</option> <option>Other</option> </select> </div> <div> <label htmlFor="insurer" className="block text-xs font-medium text-gray-700 mb-1">Insurer</label> <select id="insurer" name="insurer" value={insurerFilter} onChange={e => setInsurerFilter(e.target.value)} disabled={isLoading || products.length === 0} className="block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[--brand-purple] focus:border-[--brand-purple] sm:text-sm"> {insurers.map(insurer => <option key={insurer} value={insurer}>{insurer}</option>)} </select> </div> <div className="sm:col-span-2 md:col-span-1 lg:col-span-2"> <label htmlFor="search" className="block text-xs font-medium text-gray-700 mb-1">Search Products</label> <div className="flex"> <input type="search" id="search" name="search" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} disabled={isLoading} placeholder="Search by name, insurer..." className="flex-grow px-3 py-1.5 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-[--brand-purple] focus:border-[--brand-purple] sm:text-sm"/> <button className="px-3 py-1.5 border border-[--brand-purple] bg-[--brand-purple] text-white rounded-r-md hover:bg-[--brand-purple-hover] focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[--brand-purple]" disabled={isLoading}> <i className="fas fa-search"></i> </button> </div> </div> </div> </div>


            {isLoading && ( <div className="text-center p-10 text-gray-500"> <i className="fas fa-spinner fa-spin text-3xl text-[--brand-purple]"></i> <p className="mt-2">Loading Products...</p> </div> )}
            {!isLoading && error && ( <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert"> <strong className="font-bold">Error: </strong> <span className="block sm:inline">{error}</span> </div> )}

            {!isLoading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {/* This is where filteredProducts is used */}
                    {filteredProducts.length === 0 ? (
                         <p className="text-center text-gray-500 py-10 md:col-span-2 lg:col-span-3 xl:col-span-4">No products found matching your criteria.</p>
                    ) : (
                        filteredProducts.map((product) => (
                            <div key={product.id} className={`bg-white rounded-lg shadow border ${product.status === 'Inactive' ? 'border-red-100 opacity-70' : 'border-gray-100'} overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-200 animate-on-scroll`}>
                                <div className="p-4 flex flex-col flex-grow">
                                    <div className="flex justify-between items-start mb-1"> <span className="text-xs font-semibold uppercase tracking-wider text-purple-600">{product.category}</span> {product.status === 'Inactive' && <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">Inactive</span>} </div>
                                    <h3 className="text-md font-semibold text-gray-800 mb-1">{product.name}</h3>
                                    <div className="flex items-center text-sm text-gray-500 mb-3"> <img src={product.insurerLogo?.String || `https://placehold.co/40x40/cccccc/ffffff?text=${product.insurer?.charAt(0) || 'L'}`} alt={product.insurer} className="w-4 h-4 mr-1.5 rounded-full object-contain bg-gray-100" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/40x40/cccccc/ffffff?text=L'; }}/> {product.insurer} </div>
                                    <p className="text-sm text-gray-600 mb-4 flex-grow">{product.description?.String || 'No description available.'}</p>
                                    <Link to={`/dashboard/products/${product.id}`} className="mt-auto text-sm font-medium text-[--brand-purple] hover:text-[--brand-purple-hover]" style={{'--brand-purple': themeColors.brandPurple, '--brand-purple-hover': themeColors.brandPurpleHover}}> View Details &rarr; </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
               <AddProductModal
                isOpen={isAddProductModalOpen}
                onClose={handleCloseAddProductModal}
                onProductAdded={handleProductAdded}
            />
        </div>
    );
};

export default ProductsPage;
