import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";

export const useCartStore = create((set,get) => ({
    cart: [],
    coupon: null,
    total: 0,
    subTotal: 0,
    isCouponApplied: false,

    getCartItems: async () => {
        try {
            const res = await axios.get("/cart");
            set({ cart: res.data});
            console.log(res.data);
            get().calculateTotal();
        } catch (error) {
            set({ cart: []});
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong while fetching cart items");
        }
    },

    addToCart: async(product)=> {
        try {
            await axios.post("/cart", {productId: product._id});
            toast.success("Product added to cart");

            set((prevState)=> {
                const existingItem = prevState.cart.find(item => item._id === product._id);
                const newCart=existingItem
                    ? prevState.cart.map(item => item._id === product._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                    )
                    : [...prevState.cart, { ...product, quantity: 1 }];

                return { cart: newCart };
            })
            get().calculateTotal();
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong while adding to cart");
        }
    },

    removeFromCart: async(productId) => {
        try {
            await axios.delete(`/cart/`, { data: { productId } });
            toast.success("Product removed from cart");
            set((prevState) => ({
                cart: prevState.cart.filter((item) => item._id !== productId),
            }));
            get().calculateTotal();
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong while removing from cart");
        }
    },

    updateQuantity: async(productId, quantity) => {
        if(quantity === 0) {  
            get().removeFromCart(productId);
            return;
        }
        try {
            await axios.put(`/cart/${productId}`, { quantity });
            toast.success("Quantity updated");
            set((prevState) => ({
                cart: prevState.cart.map((item) => {
                    if (item._id === productId) {
                        return { ...item, quantity };
                    }
                    return item;
                }),
            }))
            get().calculateTotal();
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong while updating quantity");
        }
    },

    clearCart: async() => { // after payment successFull this function will be called to clear the cart
        set({cart: [],coupon: null, subTotal: 0, total: 0});
        
    },


    getMyCoupon: async (code) => {
        try {
            const res = await axios.get(`/coupons`);
            set({ coupon: res.data });
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong while applying coupon");
        }
    },

    applyCoupon: async (code) => {
        try {
            const res = await axios.post(`/coupons/validate`, { code });
            set({ coupon: res.data,isCouponApplied: true });
            get().calculateTotal();
            toast.success("Coupon applied successfully");
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong while applying coupon");
        }
    },

    removeCoupon: async () => {
        set({ coupon: null, isCouponApplied: false });
        get().calculateTotal();
        toast.success("Coupon removed successfully");
    },
    // Function to calculate total  
    calculateTotal: () => {
        const {cart, coupon} = get();
        const subTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
        let total = subTotal;

        if(coupon) {
            const discount=subTotal*coupon.discountPercentage/100;
            total = subTotal-discount;
        }

        set({subTotal, total}); 
    },
}));