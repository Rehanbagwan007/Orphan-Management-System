import { useSelector, useDispatch } from "react-redux"
import { loginUser, registerUser, logout, clearError, fetchUserProfile } from "../store/slices/authSlice"

export const useAuth = () => {
  const dispatch = useDispatch()
  const token = (localStorage.getItem("token"))

  const { user, isLoading, error, isAuthenticated } = useSelector((state) => state.auth)
  
  const login = async (credentials) => {
    return dispatch(loginUser(credentials))
  }

  const register = async (userData) => {
    return dispatch(registerUser(userData))
  }

  const logoutUser = () => {
    dispatch(logout())
  }

  const clearAuthError = () => {
    dispatch(clearError())
  }

  const fetchProfile = () => {
    dispatch(fetchUserProfile())
  }

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    login,
    register,
    logout: logoutUser,
    clearError: clearAuthError,
    fetchProfile,
    API_BASE_URL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  }
}
