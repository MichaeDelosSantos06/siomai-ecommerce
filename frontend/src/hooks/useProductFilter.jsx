import { useState, useMemo } from "react";

/**
 * Sanitizes search input to prevent XSS and injection attacks
 * Removes potentially dangerous characters and trims whitespace
 * @param {string} input - The raw search input
 * @returns {string} - Sanitized search string
 */
const sanitizeSearchInput = (input) => {
    if (!input || typeof input !== 'string') return '';
    
    // Remove HTML tags, script injections, and special regex characters
    return input
        .replace(/<[^>]*>/g, '')           // Remove HTML tags
        .replace(/[&<>"'`]/g, '')          // Remove special HTML characters
        .replace(/[^\w\s]/gi, '')          // Remove special characters except alphanumeric and spaces
        .trim()
        .slice(0, 100);                    // Limit search length to 100 characters
};

/**
 * Custom hook for filtering products with search functionality
 * @param {Array} products - Array of product objects to filter
 * @returns {Object} - Contains searchQuery, setSearchQuery, filteredProducts, and clearSearch
 */
const useProductFilter = (products = []) => {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredProducts = useMemo(() => {
        const sanitizedQuery = sanitizeSearchInput(searchQuery);
        
        if (!sanitizedQuery) return products;
        
        const query = sanitizedQuery.toLowerCase();
        return products.filter(item => {
            const name = (item.name || '').toLowerCase();
            const description = (item.description || '').toLowerCase();
            return name.includes(query) || description.includes(query);
        });
    }, [products, searchQuery]);

    const clearSearch = () => setSearchQuery("");

    return {
        searchQuery,
        setSearchQuery,
        filteredProducts,
        clearSearch,
        hasActiveSearch: sanitizeSearchInput(searchQuery).length > 0,
        searchCount: filteredProducts.length,
        totalCount: products.length
    };
};

export default useProductFilter;