import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { message } from "antd"

const initialState = {
    carts: [],
    // payDone: false,

}

export const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        doAddBookAction: (state, action) => {
            let carts = state.carts
            const item = action.payload

            let isExistIndex = carts.findIndex(c => c._id === item._id)
            if (isExistIndex > -1) {
                carts[isExistIndex].quantity = parseInt(carts[isExistIndex].quantity) + parseInt(item.quantity)
                if (carts[isExistIndex].quantity > carts[isExistIndex].detail.quantity) {
                    carts[isExistIndex].quantity = carts[isExistIndex].detail.quantity
                }

            }
            else {
                carts.push({ quantity: parseInt(item.quantity), _id: item._id, detail: item.detail })
            }

            state.carts = carts
            message.success("Add to cart successfully!")
        },
        doUpdateCartAction: (state, action) => {
            let carts = state.carts
            const item = action.payload

            let isExistIndex = carts.findIndex(c => c._id === item._id)
            if (isExistIndex > -1) {
                carts[isExistIndex].quantity = parseInt(item.quantity)
                if (carts[isExistIndex].quantity > carts[isExistIndex].detail.quantity) {
                    carts[isExistIndex].quantity = carts[isExistIndex].detail.quantity
                }

            }
            else {
                carts.push({ quantity: parseInt(item.quantity), _id: item._id, detail: item.detail })
            }

            state.carts = carts
        },
        doDeleteCartAction: (state, action) => {
            state.carts = state.carts.filter(c => c._id !== action.payload._id)
        },
        doPlaceOrderAction: (state, action) => {
            state.carts = []
        },
        extraReducers: (builder) => {

        },
    }
})


export const { doAddBookAction, doUpdateCartAction, doDeleteCartAction, doPlaceOrderAction } = orderSlice.actions

export default orderSlice.reducer
