import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    bookName: ""
}


export const BookSlice = createSlice({
    name: "book",
    initialState,
    reducers: {
        doSearchBook: (state, action) => {
            state.bookName = action.payload.bookName
        }
    }
})

export const { doSearchBook } = BookSlice.actions

export default BookSlice.reducer