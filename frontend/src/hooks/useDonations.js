import { useSelector, useDispatch } from "react-redux"
import {
  fetchDonations,
  createDonation,
  fetchAdminDonations,
  updateDonationStatus,
  clearError,
} from "../store/slices/donationSlice"

export const useDonations = () => {
  const dispatch = useDispatch()
  const { donations, adminDonations, isLoading, error, stats } = useSelector((state) => state.donations)

  const getDonations = () => {
    dispatch(fetchDonations())
  }

  const addDonation = async (donationData) => {
    return dispatch(createDonation(donationData))
  }

  const getAdminDonations = () => {
    dispatch(fetchAdminDonations())
  }

  const updateStatus = async (donationId, status, adminNotes) => {
    return dispatch(updateDonationStatus({ donationId, status, adminNotes }))
  }

  const clearDonationError = () => {
    dispatch(clearError())
  }

  return {
    donations,
    adminDonations,
    isLoading,
    error,
    stats,
    getDonations,
    addDonation,
    getAdminDonations,
    updateStatus,
    clearError: clearDonationError,
  }
}
