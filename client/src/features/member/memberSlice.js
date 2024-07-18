import { createSlice } from '@reduxjs/toolkit'

export const memberSlice = createSlice({
    name: 'member',
    initialState: {
        userData: null
    },
    reducers: {
        setUserData: (state, action) => {
            state.userData = {
                userNo: action.payload.userNo,
                userName: action.payload.userName
            }
        },
        clearUserData: (state, action) => {
            state.userData = null
        }
    }
})

// Action creators are generated for each case reducer function
export const { setUserData, clearUserData } = memberSlice.actions

export default memberSlice.reducer