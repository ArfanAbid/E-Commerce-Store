import {create} from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios.js";

export const useProductStore = create((set) => ({
    products: [],
    loading: false,

    setProducts: (products) => set({ products }),

    createProduct: async (productData) => {
        set({ loading: true });
        try {
            const res = await axios.post("/products/createProduct", productData);
            set((prevState)=>({ // update the state by adding the new product
                products: [...prevState.products, res.data],
                loading: false
            }))
        } catch (error) {
            set({ loading: false });
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong while creating a product");
        }
    },

    fetchAllProducts:async () => {
        set({ loading: true });
        try {
            const res = await axios.get("/products/getAllProducts");
            set({ products: res.data, loading: false });
        } catch (error) {
            set({ loading: false });
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong while fetching products");
        }
    },

    fetchProductsByCategory: async (category) => {
        set({ loading: true });
        try {
            const res = await axios.get(`/products/category/${category}`);
            set({ products: res.data, loading: false });
        } catch (error) {
            set({ loading: false });
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong while fetching products by category");
        }
    },

    deleteProduct: async (productId) => {
        set({ loading: true });
        try {
            await axios.delete(`/products/deleteProduct/${productId}`);
            set((prevState) => ({
                products: prevState.products.filter((product) => product._id !== productId),
                loading: false
            }));
        } catch (error) {
            set({ loading: false });
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong while deleting a product");
        }
    },

    toggleFeaturedProduct: async (productId) => {
        set({ loading: true });
        try {
            await axios.patch(`/products/toggle-Featured-Product/${productId}`);
            set((prevState) => ({ 			// this will update the isFeatured prop of the product
                products: prevState.products.map((product) => {
                    if (product._id === productId) {
                        return {
                            ...product,
                            isFeatured: !product.isFeatured
                        };
                    }
                    return product;
                }),
                loading: false
            }));
        } catch (error) {
            set({ loading: false });
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong while toggling featured product");
        }
    },

    fetchFeaturedProducts: async () => {
        set({ loading: true });
        try {
            const res = await axios.get("/products/featured");
            set({ products: res.data.featuredProducts, loading: false });
        } catch (error) {
            set({ loading: false });
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong while fetching featured products");
        }
    },


}));
