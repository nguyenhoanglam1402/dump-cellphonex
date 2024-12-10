import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Input, Form, message, Space, Popconfirm, Upload, Select, Tabs } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

import { RcFile } from "antd/es/upload";
import { IProductData, Product } from "../../types";
import { products } from "../../constant/product";
import { createProductService, getProductsService } from "../../services/product";
import { toast } from "react-toastify";
import { getBase64 } from "../../utils";
import { ICategoryData } from "../../types/category.type";
import { createCategories, getCategories } from "../../services/category.service";

// Helper function for handling image upload
const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG files!");
  }
  return isJpgOrPng;
};

const initialProducts: Product[] = [
  ...products
];

const AdminPage: React.FC = () => {
  const [products, setProducts] = useState<IProductData[]>(initialProducts);
  const [categories, setCategories] = useState<ICategoryData[]>([])

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalCategoriesVisible, setIsModalCategoriesVisible] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined); // For image preview in modal
  const [form] = Form.useForm()
  const [formCategories] = Form.useForm()


  const fetchProduct = async () => {
    const resp = await getProductsService()
    if (resp.status !== 200) {
      toast("Cannot fetch Products", { type: 'error' })
    }

    setProducts(resp.data?.data)

  }

  const fetchCategories = async () => {
    const resp = await getCategories()
    if (resp.status !== 200) {
      toast("Cannot fetch Products", { type: 'error' })
    }

    setCategories(resp.data?.data)
  }

  useEffect(() => {
    fetchProduct()
    fetchCategories()
  }, [])

  const handleAddProduct = () => {
    setIsEditing(false);
    setEditingProduct(null);
    setImageUrl(undefined);
    form.resetFields(); // Clear all form fields
    setIsModalVisible(true);
  };

  const handleAddCategory = () => {
    setIsEditing(false);
    setEditingProduct(null);
    setImageUrl(undefined);
    form.resetFields(); // Clear all form fields
    setIsModalCategoriesVisible(true);
  };

  const handleEditProduct = (product: Product) => {
    setIsEditing(true);
    setEditingProduct(product);
    setImageUrl(product?.pictureURL);
    setIsModalVisible(true);

    form.setFieldsValue({
      ...product,
      features: product.features?.join(", "), // Convert features array to comma-separated string
    });
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((product) => product.id !== id));
    message.success("Product deleted successfully.");
  };

  const handleDeleteCategories = (id: string) => {
    setCategories(categories.filter((cate) => cate.id !== id));
    message.success("Product deleted successfully.");
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleModalCategoriesClose = () => {
    setIsModalCategoriesVisible(false);
    form.resetFields();
  };


  const handleSaveProduct = async (values: any) => {
    const { features, ...restValues } = values;
    const featureArray = features?.split(",").map((feature: string) => feature.trim()); // Split the features string into an array

    const newProduct = { ...restValues, id: products.length + 1, feature: featureArray, pictureURL: imageUrl };
    if (isEditing && editingProduct) {
      // Edit existing product
      setProducts(
        products.map((product) =>
          product.id === editingProduct.id ? { ...product, ...restValues, features: featureArray, pictureURL: imageUrl } : product
        )
      );
      message.success("Product updated successfully.");
    } else {
      // Add new product
      const resp = await createProductService(newProduct)
      if (resp.status === 200) {
        setProducts([...products, newProduct]);
        message.success("Product added successfully.");
      } else {
        message.error("Product added error.");

      }
    }
    setIsModalVisible(false);
  };

  const handleSaveCategory = async (values: any) => {
    const newCategory = { ...values, pictureURL: imageUrl };

    // Add new product
    const resp = await createCategories(newCategory)
    if (resp.status === 201) {
      setCategories([...categories, newCategory]);
      message.success("Category added successfully.");
    } else {
      message.error("Category added error.");

    }

    setIsModalVisible(false);
  };

  const handleImageChange = async (info: any) => {
    const file = info.file.originFileObj as RcFile;
    if (!file) return;

    try {
      const base64 = await getBase64(file); // Convert to Base64
      setImageUrl(base64);
      message.success("Image uploaded successfully!");
    } catch (err) {
      message.error("Failed to convert image to Base64.");
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Price", dataIndex: "price", key: "price" },
    { title: "Category", dataIndex: "category", key: "category" },
    {
      title: "Image",
      key: "image",
      render: (text: any, record: Product) => (
        <img src={record.pictureURL} alt={record.name} className="w-12 h-12 object-cover rounded" />
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text: any, record: Product) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEditProduct(record)}
          />
          <Popconfirm
            title="Are you sure to delete this product?"
            onConfirm={() => handleDeleteProduct(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const columnsCategory = [
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Image",
      key: "image",
      render: (text: any, record: Product) => (
        <img src={record.pictureURL} alt={record.name} className="w-12 h-12 object-cover rounded" />
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text: any, record: Product) => (
        <Space size="middle">
          <Popconfirm
            title="Are you sure to delete this product?"
            onConfirm={() => handleDeleteCategories(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];


  const renderProductTab = () => {
    return <>
      {/* Product Table */}
      < Button
        type="primary"
        icon={< PlusOutlined />}
        onClick={handleAddProduct}
        className="mb-6"
      >
        Add Product
      </ Button>
      <Table
        columns={columns}
        dataSource={products}
        rowKey="id"
        pagination={false}
      />

      {/* Modal for Adding/Editing Product */}
      <Modal
        title={isEditing ? "Edit Product" : "Add Product"}
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={600}
      >
        <Form
          initialValues={editingProduct || {}}
          onFinish={handleSaveProduct}
          layout="vertical"
          form={form}

        >
          <Form.Item
            label="Product Name"
            name="name"
            rules={[{ required: true, message: "Please enter the product name!" }]}
          >
            <Input placeholder="Enter product name" />
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Please enter the price!" }]}
          >
            <Input placeholder="Enter product price" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter a description!" }]}
          >
            <Input.TextArea rows={4} placeholder="Enter product description" />
          </Form.Item>

          <Form.Item
            label="Features"
            name="features"
            rules={[{ required: true, message: "Please enter the features!" }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Enter product features (comma separated)"
              defaultValue={editingProduct?.feature.join(", ")}
            />
          </Form.Item>

          <Form.Item
            label="Category"
            name="categoryId"
            rules={[{ required: true, message: "Please enter the category!" }]}
          >
            <Select onChange={(value) => form.setFieldValue('categoryId', value)}>
              {categories.map((item, key) => <Select.Option key={key} value={item.id}>{item.name}</Select.Option>)}
            </Select>
          </Form.Item>

          <Form.Item
            label="Amount In Store"
            name="amountInStore"
            rules={[{ required: true, message: "Please enter amount!" }]}
          >
            <Input placeholder="Enter product amount" />
          </Form.Item>

          <Form.Item
            label="Product Image"
            name="imageUrl"
            valuePropName="file"
            rules={[{ required: true, message: "Please upload an image!" }]}
          >
            <Upload
              name="image"
              listType="picture-card"
              showUploadList={false}
              beforeUpload={beforeUpload}
              onChange={handleImageChange}
              customRequest={({ file, onSuccess }) => {
                // Simulate image upload
                setTimeout(() => {
                  onSuccess?.("ok");
                }, 1000);
              }}
            >
              {imageUrl ? (
                <img src={imageUrl} alt="product" className="w-20 h-20 object-cover rounded" />
              ) : (
                <div>
                  <PlusOutlined />
                  <div>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <div className="flex justify-end">
            <Button onClick={handleModalClose} className="mr-3">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  }

  const renderCategoriesTab = () => {
    return <>
      {/* Product Table */}
      < Button
        type="primary"
        icon={< PlusOutlined />}
        onClick={handleAddCategory}
        className="mb-6"
      >
        Add Category
      </ Button>
      <Table
        columns={columnsCategory}
        dataSource={categories}
        rowKey="id"
        pagination={false}
      />

      {/* Modal for Adding/Editing Product */}
      <Modal
        title={isEditing ? "Edit Category" : "Add Category"}
        visible={isModalCategoriesVisible}
        onCancel={handleModalCategoriesClose}
        footer={null}
        width={600}
      >
        <Form
          onFinish={handleSaveCategory}
          layout="vertical"
          form={formCategories}

        >
          <Form.Item
            label="Category Name"
            name="name"
            rules={[{ required: true, message: "Please enter the product name!" }]}
          >
            <Input placeholder="Enter product name" />
          </Form.Item>

          <Form.Item
            label="Product Image"
            name="imageUrl"
            valuePropName="file"
            rules={[{ required: true, message: "Please upload an image!" }]}
          >
            <Upload
              name="image"
              listType="picture-card"
              showUploadList={false}
              beforeUpload={beforeUpload}
              onChange={handleImageChange}
              customRequest={({ file, onSuccess }) => {
                // Simulate image upload
                setTimeout(() => {
                  onSuccess?.("ok");
                }, 1000);
              }}
            >
              {imageUrl ? (
                <img src={imageUrl} alt="product" className="w-20 h-20 object-cover rounded" />
              ) : (
                <div>
                  <PlusOutlined />
                  <div>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <div className="flex justify-end">
            <Button onClick={handleModalClose} className="mr-3">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Admin Product Management</h2>
      <Tabs defaultActiveKey="1"
        centered
        items={[
          {
            key: '1',
            id: '1',
            label: 'Products',
            children: renderProductTab()
          },
          {
            key: '2',
            id: '2',
            label: 'Category',
            children: renderCategoriesTab()
          },
        ]} />

    </div>
  );
};

export default AdminPage;
