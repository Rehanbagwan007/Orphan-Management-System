import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

export const fetchChildren = createAsyncThunk("children/fetchChildren", async (_, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState()
    const response = await fetch(`${API_BASE_URL}/children/available`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return rejectWithValue(data.message || "Failed to fetch children")
    }

    return data
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

const childrenSlice = createSlice({
  name: "children",
  initialState: {
    children: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChildren.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchChildren.fulfilled, (state, action) => {
        state.isLoading = false
        state.children = action.payload
      })
      .addCase(fetchChildren.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { clearError } = childrenSlice.actions
export default childrenSlice.reducer
