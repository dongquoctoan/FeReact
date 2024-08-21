import { message } from "antd";
import flashSaleApi from "apis/flashsale";
import FlashSaleControl from "components/FlashSaleControl";
import { NewFlashSaleData } from "constants/types/flashsale.type";
import { useNavigate } from "react-router-dom";
import { LIST_FLASH_SALE } from "routes/route.constant";

const AddFlashSale = () => {
  const navigate = useNavigate();

  const submitAddFlashSale = async (data: NewFlashSaleData) => {
    try {
      await flashSaleApi.create(data);
      message.success("Tạo chương trình flash sale thành công");
      navigate(LIST_FLASH_SALE);
    } catch (error: any) {
      message.error(error.response.data.error.message);
    }
  };
  return <FlashSaleControl onSubmit={submitAddFlashSale} />;
};

export default AddFlashSale;
