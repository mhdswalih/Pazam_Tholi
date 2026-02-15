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