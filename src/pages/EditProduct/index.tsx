import { Button, message, Space } from "antd";
import { productApi } from "apis/product";
import ProductControl from "components/ProductControl";
import { ProductControlState } from "components/ProductControl/hooks/useProductControl";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PRODUCT } from "routes/route.constant";

const EditProduct = () => {
  const navigate = useNavigate();
  const { id: productId } = useParams();
  const [product, setProduct] = useState<ProductControlState>();

  useEffect(() => {
    handleGetProductDetail();
  }, []);

  // get product detail
  const handleGetProductDetail = async () => {
    try {
      if (!productId) return;
      const response = await productApi.getOne(productId);
      setProduct(response.data.result);
    } catch (error: any) {
      message.error(error.response.data.error.message);
    }
  };

  const handleSubmitEditProduct = async (productData: ProductControlState) => {
    try {
      if (!productId) return;
      await productApi.update(productId, productData);
      message.success("Cập nhật sản phẩm thành công.");
      navigate(PRODUCT, { replace: true });
    } catch (error: any) {
      message.error(error.response.data.error.message);
    }
  };

  const renderActions = (onSubmit: () => void) => {
    return (
      <Space>
        <Button onClick={() => navigate(-1)}>Hủy</Button>
        <Button type="primary" onClick={onSubmit}>
          Cập nhật
        </Button>
      </Space>
    );
  };
  return (
    <div>
      <ProductControl
        renderActions={renderActions}
        onSubmit={handleSubmitEditProduct}
        initialProduct={product}
      />
    </div>
  );
};

export default EditProduct;
