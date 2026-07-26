import type { LoginDTO, UserRegistrationDTO } from "../types/userType.js";
import { UserRepository } from "../repository/userRepository.js";
import { AppError } from "../utils/appError.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";
import  axios  from "axios";

export const UserService = {
    register: async (data: UserRegistrationDTO) => {
        const { email, username, password} = data;

        const checkEmail = await UserRepository.checkEmail(email);
        if(checkEmail){
            throw new AppError("Email already Exsit", 400);
        }

        const checkUsername = await UserRepository.checkUsername(username);
        if(checkUsername){
            throw new AppError("Username taken", 400);
        }

        const saltRounds = 12;
        const hashedPass = await bcrypt.hash(password, saltRounds);
        return UserRepository.register({email, username, password: hashedPass});
    },

    login: async (data: LoginDTO) => {
        const { email, password} = data;

        const user = await UserRepository.checkEmail(email);

        if(!user){
            throw new AppError("Incorrect Credentials", 401);
        }


        const isMatch = await bcrypt.compare(password, user.password!);
        if(!isMatch){
            throw new AppError("Incorrect Credentials", 401);
        }

        const token = generateToken({
            id: user.id,
            role: user.role,
            status: user.status,
            username: user.username,
            email: user.email
        })

        return {
            id: user.id,
            role: user.role,
            status: user.status,
            username: user.username,
            email: user.email,
            token
        }
    },

    googleLogin: async (data: {accessToken: string}) => {
        const { accessToken} = data;
        const googleUser = await axios.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );

        const user = await UserRepository.googleLogin(googleUser.data);

        const token = generateToken({
            id: user.id,
            email: user.email
        });

        return { user, token}
    },

    getCustomerInfo: async () => {
        return await UserRepository.getCustomerInfo();
    },

    getTotalCustomer: async () => {
        return await UserRepository.getTotalCustomer();
      
    },

    getTotalVipCustomer: async () => {
        return await UserRepository.getTotalVipCustomer();
    },

    newCustomers: async () => {
        return await UserRepository.getTotalCustomer();
    }
}