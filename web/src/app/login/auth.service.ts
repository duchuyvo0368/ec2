/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { LoginData, RegisterData } from './type';

const API_CONFIG = "http://localhost:5000/v1/api";


export const login = async ({
    data,
    onSuccess,
    onError,
}: {
    data: LoginData;
    onSuccess?: (res: any) => void;
    onError?: (err: any) => void;
}) => {
    try {
        const res = await axios.post(`${API_CONFIG}/auth/login`, data)

        console.log("Login response:", res);
        onSuccess?.(res.data); 

    } catch (err: any) {
        onError?.(err.response?.data || err);
    }
};
export const refreshToken = async ({
    token,
    onSuccess,
    onError,
}: {
    token: string;
    onSuccess?: (res: any) => void;
    onError?: (err: any) => void;
}): Promise<any> => {
    try {
        const res = await axios.post(
            `${API_CONFIG}/auth/refresh-token`,
            {},
            {
                headers: {
                    'x-refresh-token': token,
                },
            }
        );

        console.log('Refresh token response:', res);
        onSuccess?.(res.data);
        return res;
    } catch (err: any) {
        onError?.(err.response?.data || err);
        throw err;
    }
};


export const register = async ({
    data,
    onSuccess,
    onError,
}: {
    data: RegisterData;
    onSuccess?: (res: any) => void;
    onError?: (err: any) => void;
}) => {
    try {
        const res = await axios.post(`${API_CONFIG}/auth/register`, data)

        console.log("Register response:", res);
        onSuccess?.(res.data); 

    } catch (err: any) {
        onError?.(err.response?.data || err);
    }
};
