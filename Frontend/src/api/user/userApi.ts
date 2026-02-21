import type { IUser } from "../../types/user";
import { Axios } from "../axiosinstance/instance";


export const registeUser = async(userData:IUser) => {
    try {
        const response = await Axios.post('/auth/register',userData)
        return response.data
    } catch (error) {
        console.log(error);
    }
}

export const verifyOtp = async(email : string,otp:string) => {    
    try {
        const response = await Axios.post('/auth/verify-otp',{email,otp})
        return response.data
    } catch (error) {
        console.log(error);
        
    }
}

export const refreshToken = async () => {

    const response = await Axios.post(
        '/auth/refresh-token',   
        {},
        { withCredentials: true }
    );

    return response.data;
}

export const login = async(email:string,password:string) => {
    try {
        const response = await Axios.post('/auth/login',{email,password})
        return  response.data
    } catch (error) {
        console.log(error);
        
    }
}

export const editProfile = async(userData : any) => { 
    try {
        const response =await Axios.patch('/profile/edit-profile', userData)
        console.log(response.data,'THIS IS FROM API SIDE');
        return response.data
    } catch (error) {
        console.log(error);
        
        
    }
}