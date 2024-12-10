import axiosInstance from "../api/inteceptor"

export const getCategories = () => {
  return axiosInstance.get('category')
}

export const createCategories = (value: any) => {
  return axiosInstance.post('category', value)
}