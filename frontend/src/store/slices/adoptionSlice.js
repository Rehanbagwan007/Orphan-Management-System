import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

export const fetchAdoptionRequests = createAsyncThunk(
  "adoptions/fetchAdoptionRequests",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState()
      const response = await fetch(`${API_BASE_URL}/adoptions/my-requests`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to fetch adoption requests")
      }

      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

const adoptionSlice = createSlice({
  name: "adoptions",
  initialState: {
    requests: [],
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
      .addCase(fetchAdoptionRequests.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchAdoptionRequests.fulfilled, (state, action) => {
        state.isLoading = false
        state.requests = action.payload
      })
      .addCase(fetchAdoptionRequests.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { clearError } = adoptionSlice.actions
export default adoptionSlice.reducer
