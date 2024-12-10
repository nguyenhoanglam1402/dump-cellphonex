import axiosInstance from "../api/inteceptor"

export const addToCartService = (values: { userId: string, productId: string, quantity: number }) => {
  return axiosInstance.post('cart', values)
}

export const getCartService = (userId: string) => {
  return axiosInstance.get(`cart/${userId}`)
}

export const removeCartService = (id: string) => {
  return axiosInstance.delete(`cart/${id}`)
}

export const updateCartService = (value: { id: string, quantity: number }) => {
  return axiosInstance.put(`cart`, value)
}