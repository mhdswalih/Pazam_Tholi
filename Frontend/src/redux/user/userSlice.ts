import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  token: string;
}

const initialState: UserState = {
  id: "",
  firstName: "",
  lastName: "",
  email: "",
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
      state.token = action.payload.token;
    },
    removeUser: () => {
        return initialState
    }
  },
});

export const { addUser } = loginUser.actions;
export default loginUser.reducer;
