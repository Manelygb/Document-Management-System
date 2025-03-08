import { createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {history} from '../../utils';
import AuthRepository  from "../../repositories/auth/AuthRepository";

// this is the singleton intance
const AuthRepositoryInstance = AuthRepository.getInstance();

interface AuthState {
    value : User | null;
}

interface User {
    email :string;
    firstName?:string,
    lastName?: string,
}

interface LoginPayload {
    email : string;
    password : string;
}

const name = "auth";
const extraActions = createExtraActions();
const initialState = createInitialState();

function createInitialState() : AuthState {
    return {
    value : JSON.parse(localStorage.getItem("auth") || 'null'),
    };
}

const authSlice = createSlice({
    name : name,
    initialState,
    reducers : {
        setLoginAuth : (state, action:PayloadAction<User | null>) => {
            state.value = action.payload
        },
    },
});

function createExtraActions() {
    return {
        login: login(),
        logout: logout(),
    };

    function login() {
        return createAsyncThunk(
            '${name}/login',
            async ({email, password}: LoginPayload, {dispatch}) => {
                console.log(" testing here the login");
                const result = await AuthRepositoryInstance.login({email, password});
                if(result.success) {
                    localStorage.setItem("auth", JSON.stringify(result.user));
                    dispatch(authActions.setLoginAuth(result.user ?? null));
                    if (history.navigate) {
                        history.navigate("/users-dashboard");
                } }
                else {
                    console.log("was not loggrd in");
                    alert(result.message);
                
        
            }
        }
        );
    }

    function logout() {
        return createAsyncThunk(
            `${name}/logout`,
            async (_, { dispatch }) => {
                dispatch(authActions.setLoginAuth(null));
                localStorage.removeItem("auth");
                console.log("Logout ............... 1");
                if (history.navigate) {
                    history.navigate("/login");
            }
        }
        );
    }
}
export const authActions = { ...authSlice.actions, ...extraActions };
export const authReducer = authSlice.reducer;