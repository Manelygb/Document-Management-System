import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { UserRepository, FetchUsersParams, User, FetchUsersResponse } from "../../repositories/users/UserRepository";

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  pagination: {
    total_records: number;
    total_pages: number;
    current_page: number;
    per_page: number;
  };
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
  pagination: {
    total_records: 0,
    total_pages: 0,
    current_page: 1,
    per_page: 10,
  },
};

export const fetchUsers = createAsyncThunk("users/fetchUsers", async (params: FetchUsersParams, { rejectWithValue }) => {
  try {
    const response = await UserRepository.fetchUsers(params);
    console.log("working", response);
    return response as FetchUsersResponse;
    
  } catch (error: any) {
    console.log("could not fetch");
    return rejectWithValue(error.response?.data || "Error fetching users");
  }
});

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default userSlice.reducer;
