import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAuthenticated: false,
    isLoading: true,
    user: {
        "email": "",
        "phone": "",
        "fullName": "",
        "role": "",
        "avatar": "",
        "id": ""
    },
};

export const accoutSlice = createSlice({
    name: 'account',
    initialState: initialState,
    reducers: {
        doLoginAction: (state, action) => {
            state.isAuthenticated = true,
                state.isLoading = false,
                state.user = action.payload.user
        },
        doGetAccountAction: (state, action) => {
            state.isAuthenticated = true,
                state.isLoading = false,
                state.user = action.payload.user
        },
        doLogoutAction: (state, action) => {
            localStorage.removeItem("access_token")
            state.isAuthenticated = false,
                state.isLoading = false,
                state.user = initialState.user
        },
        doUpdateUser: (state, action) => {
            state.user.avatar = action.payload.avatar,
                state.user.phone = action.payload.phone,
                state.user.fullName = action.payload.fullName
        }
    },
    extraReducers: (builder) => {

    },
});

export const { doLoginAction, doGetAccountAction, doLogoutAction, doUpdateUser } = accoutSlice.actions;

export default accoutSlice.reducer;
