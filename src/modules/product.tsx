import { useEffect, useState } from "react";
// import { products } from "../constant/product";
import { getProductsService } from "../services/product";
import { IProductData } from "../types";
import { useNavigate } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState<IProductData[]>([])
  const navigate = useNavigate()

  const fetchDataProduct = async () => {
    const resp = await getProductsService();
    const data = resp.data.data || []
    setProducts(data)
  }

  useEffect(() => {
    fetchDataProduct()
  }, [])

  const handleSeeDetail = (id: string) => {
    navigate(`/products/${id}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-6">Our Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border"
          >
            <img
              src={product.pictureURL}
              alt={product.name}
              className="rounded-lg w-full max-h-[222px] h-full object-contain"
            />
            <h3 className="mt-4 text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-600">{product.price.toLocaleString("en-US", { style: "currency", currency: "USD" })}</p>
            <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all" onClick={() => handleSeeDetail(product.id)}>
              See detail
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};


export default ProductList;
