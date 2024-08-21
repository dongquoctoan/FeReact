import { Button, message, Space } from "antd";
import { productApi } from "apis/product";
import ProductControl from "components/ProductControl";
import { ProductControlState } from "components/ProductControl/hooks/useProductControl";
import { useNavigate } from "react-router-dom";
import { PRODUCT } from "routes/route.constant";

const AddProduct = () => {
  const navigate = useNavigate();

  const handleSubmitAddProduct = async (productData: ProductControlState) => {
    try {
      await productApi.create(productData);
      message.success("Thêm mới sản phẩm thành công.");
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
          Lưu &#38; Hiển thị
        </Button>
      </Space>
    );
  };
  return (
    <div>
      <ProductControl
        renderActions={renderActions}
        onSubmit={handleSubmitAddProduct}
      />
    </div>
  );
};

export default AddProduct;
