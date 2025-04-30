import { create } from 'zustand'
import axios from '../utils/axios'

export const useAdminStore = create((set)=> ({
    user:null,
    isAuthenticated: false,
    error: null, 
    isLoading: false,
    isCheckingAuth: true,
    message:null,
    dashboardMetrics: null,

    login: async(email, password)=>{
        set({isLoading: true, error:null})
        try {
           const response = await axios.post(`/admin/login`, {email, password})
           set({user: response.data.data, error: null, isAuthenticated: true, isLoading: false})
        } catch (error) {
            set({error: error.response.data.message || 'Error Signing In', isLoading: false})
            throw error
        }
    },

    logout: async()=>{
        set({isLoading: true, error:null})
        try {
            await axios.post(`/admin/logout`)
            set({user:null, isAuthenticated: false, error:null, isLoading: false})
        } catch (error) {
            set({error: 'Error Logging Out', isLoading: false})
            throw error 
        }
    },

    checkAuth: async()=>{
        set({isCheckingAuth: true, error:null})
        try {
            const response = await axios.get(`/auth/check-auth`)
            set({user: response.data.data, isAuthenticated: true, isCheckingAuth: false})
        } catch (error) {
            set({ error: null, isCheckingAuth: false, isAuthenticated: false })
        }
    },

    getDashboardMetrics: async()=>{
        set({isLoading: true, error:null})
        try {
            const response = await axios.get(`/admin`)
            console.log(response)
            set({ error:null, isLoading: false})
        } catch (error) {
            set({error: 'Error fetching metrics', isLoading: false})
            throw error 
        }
    },
}))