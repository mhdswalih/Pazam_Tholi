import type { IUser } from "../../types/user";
import { Axios } from "../axiosinstance/instance";


export const registeUser = async (userData: IUser) => {
    try {
        const response = await Axios.post('/auth/register', userData)
        return response.data
    } catch (error) {
        console.log(error);
    }
}

export const verifyOtp = async (email: string, otp: string) => {
    try {
        const response = await Axios.post('/auth/verify-otp', { email, otp })
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

export const login = async (email: string, password: string) => {
    try {
        const response = await Axios.post('/auth/login', { email, password })
        return response.data
    } catch (error) {
        console.log(error);

    }
}
export const editProfile = async (
    userId: string,
    userData: any,
    file?: File
) => {
    try {

        let response;

        // CASE 1: If file exists → use FormData
        if (file) {

            const formData = new FormData();

            // append file (must match FileInterceptor("file"))
            formData.append("file", file);

            // append user data
            Object.entries(userData).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formData.append(key, value as string);
                }
            });

            response = await Axios.patch(
                `/profile/edit-profile/${userId}`,
                formData
            );

        }

        // CASE 2: If no file → send JSON
        else {

            response = await Axios.patch(
                `/profile/edit-profile/${userId}`,
                userData
            );

        }

        return response.data;

    } catch (error: any) {

        console.error(error);
        throw error.response?.data || "Failed to edit profile";

    }
};