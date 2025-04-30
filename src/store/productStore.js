import { create } from 'zustand'
import axios from '../utils/axios'

export const useProductStore = create((set)=> ({
    isLoading: false,
    error: null, 
    productsPaginatedData: null,

    getProducts: async(page)=>{
        set({isLoading: true, error: null})
        try {
            const response = await axios.get(`/products/get-products?page=${page}`)
            set({products: response.data.products, productsPaginatedData: response.data, isLoading: false})
        } catch (error) {
            set({error: error.response.data.message, isLoading: false})
        }
    }
}))