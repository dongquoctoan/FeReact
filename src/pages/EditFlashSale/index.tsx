import { message } from "antd";
import flashSaleApi from "apis/flashsale";
import FlashSaleControl, {
  InitialFlashSale,
} from "components/FlashSaleControl";
import { NewFlashSaleData } from "constants/types/flashsale.type";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LIST_FLASH_SALE } from "routes/route.constant";

const EditFlashSale = () => {
  const navigate = useNavigate();
  const [flashSale, setFlashSale] = useState<InitialFlashSale>();
  const { flashSaleId } = useParams();

  // init FlashSale
  const getFlashSaleDetail = async () => {
    try {
      if (flashSaleId) {
        const flashSaleRes = await flashSaleApi.getDetail(flashSaleId);
        const { name, start_time, end_time, flashsale_product_models } =
          flashSaleRes.data.result;
        setFlashSale({
          name,
          startTime: moment(start_time).format("HH:mm DD/MM/YYYY"),
          endTime: moment(end_time).format("HH:mm DD/MM/YYYY"),
          flashsaleProductModels: flashsale_product_models,
        });
      }
    } catch (error: any) {
      message.error(error.response.data.error.message);
    }
  };

  useEffect(() => {
    getFlashSaleDetail();
  }, [flashSaleId]);

  const submitEditFlashSale = async (data: NewFlashSaleData) => {
    try {
      if (flashSaleId) {
        await flashSaleApi.update(flashSaleId, data);
        message.success("Cập nhật chương trình flash sale thành công");
        navigate(LIST_FLASH_SALE);
      }
    } catch (error: any) {
      message.error(error.response.data.error.message);
    }
  };

  return (
    <FlashSaleControl
      initialFlashSale={flashSale}
      type="edit"
      onSubmit={submitEditFlashSale}
    />
  );
};

export default EditFlashSale;
