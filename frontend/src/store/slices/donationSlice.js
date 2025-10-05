import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

// Async thunks
export const fetchDonations = createAsyncThunk("donations/fetchDonations", async (_, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState()
    const response = await fetch(`${API_BASE_URL}/donations`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return rejectWithValue(data.message || "Failed to fetch donations")
    }

    return data
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const createDonation = createAsyncThunk(
  "donations/createDonation",
  async (donationData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState()
      const response = await fetch(`${API_BASE_URL}/donations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(donationData),
      })

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to create donation")
      }

      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const fetchAdminDonations = createAsyncThunk(
  "donations/fetchAdminDonations",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState()
      const response = await fetch(`${API_BASE_URL}/donations/admin`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to fetch admin donations")
      }

      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const updateDonationStatus = createAsyncThunk(
  "donations/updateDonationStatus",
  async ({ donationId, status, adminNotes }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState()
      const response = await fetch(`${API_BASE_URL}/donations/${donationId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ status, adminNotes }),
      })

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to update donation status")
      }

      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

const donationSlice = createSlice({
  name: "donations",
  initialState: {
    donations: [],
    adminDonations: [],
    isLoading: false,
    error: null,
    stats: {
      total: 0,
      pending: 0,
      approved: 0,
      totalAmount: 0,
    },
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    updateDonationInList: (state, action) => {
      const index = state.donations.findIndex((d) => d._id === action.payload._id)
      if (index !== -1) {
        state.donations[index] = action.payload
      }
      const adminIndex = state.adminDonations.findIndex((d) => d._id === action.payload._id)
      if (adminIndex !== -1) {
        state.adminDonations[adminIndex] = action.payload
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Donations
      .addCase(fetchDonations.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchDonations.fulfilled, (state, action) => {
        state.isLoading = false
        state.donations = action.payload
        // Calculate stats
        state.stats.total = action.payload.length
        state.stats.pending = action.payload.filter((d) => d.status === "pending").length
        state.stats.approved = action.payload.filter((d) => d.status === "approved").length
        state.stats.totalAmount = action.payload
          .filter((d) => d.type === "money")
          .reduce((sum, d) => sum + (d.amount || 0), 0)
      })
      .addCase(fetchDonations.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Create Donation
      .addCase(createDonation.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createDonation.fulfilled, (state, action) => {
        state.isLoading = false
        state.donations.unshift(action.payload)
        state.stats.total += 1
        state.stats.pending += 1
      })
      .addCase(createDonation.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Fetch Admin Donations
      .addCase(fetchAdminDonations.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchAdminDonations.fulfilled, (state, action) => {
        state.isLoading = false
        state.adminDonations = action.payload
      })
      .addCase(fetchAdminDonations.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Update Donation Status
      .addCase(updateDonationStatus.fulfilled, (state, action) => {
        const index = state.adminDonations.findIndex((d) => d._id === action.payload._id)
        if (index !== -1) {
          state.adminDonations[index] = action.payload
        }
      })
  },
})

export const { clearError, updateDonationInList } = donationSlice.actions
export default donationSlice.reducer
