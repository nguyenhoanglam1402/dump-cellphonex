/* eslint-disable @typescript-eslint/no-explicit-any */
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from './page/auth'
import HomePage from './page/home'
import ProductListPage from './page/product-list'
import ProductDetailsPage from './page/product-list/detail'
import DefaultLayout from './layout/layout-nav'
import Checkout from './page/checkout'
import { useDispatch, } from 'react-redux'
import Cart from './page/cart'
import ContactPage from './page/contact'
import AdminPage from './page/admin'
import { useEffect } from 'react'
import { getUser } from './services/user'
import { jwtDecode } from 'jwt-decode'
import { IUserData } from './types/authen.type'
import { login } from './redux/user'
import { addToCart, setToCart } from './redux/cart'
import { CartItem } from './types'
import { getCartService } from './services/cart'

function App() {

  const dispatch = useDispatch()

  const fetchUserData = async () => {
    const token = localStorage.getItem('access_token')
    if (!token) return

    const payload = jwtDecode(token) as IUserData
    const resp = await getUser(payload.email)
    const data: IUserData = { ...resp?.data?.result }
    dispatch(login(data))
    return data
  }

  const fetchCart = async (user: IUserData) => {
    const res = await getCartService(user?.id || '')
    const data = res.data.items as any[]
    console.log("🚀 ~ fetchCart ~ data:", data)

    const dataCart = data.map(item => {
      const cartItem = {
        id: item.id,
        name: item.Product.name,
        pictureURL: item.Product.pictureURL,
        feature: item.Product.feature,
        quantity: item.amount,
        price: item.Product.price
      } as CartItem
      return cartItem
    })
    dispatch(setToCart(dataCart))
  }

  const handlePrepareData = async () => {
    const user = await fetchUserData()
    if (!user) return
    fetchCart(user)
  }

  useEffect(() => {
    handlePrepareData()
  }, [])

  return (

    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<DefaultLayout />}>
          <Route path='/' element={<HomePage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/:id" element={<Checkout />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>
        <Route path="/admin/product" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>

  )
}

export default App
