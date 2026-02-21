import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePic : string
  token: string;
}

const initialState: UserState = {
  id: "",
  firstName: "",
  lastName: "",
  email: "",
  profilePic : "",
  token: "",
};

const loginUser = createSlice({
  name: "login",
  initialState,
  reducers: {
    addUser: (
      state,
      action: PayloadAction<UserState>
    ) => {
      state.id = action.payload.id;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.email = action.payload.email;
      state.profilePic = action.payload.profilePic;
      state.token = action.payload.token;
    },
    removeUser: () => {
        return initialState
    }
  },
});

export const { addUser ,removeUser } = loginUser.actions;
export default loginUser.reducer;
