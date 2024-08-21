import { message } from "antd";
import discountApi from "apis/discount";
import DiscountControl, { InitialDiscount } from "components/DiscountControl";
import { NewDiscountData } from "constants/types/discount.type";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DISCOUNT_LIST } from "routes/route.constant";

const EditDiscount = () => {
  const navigate = useNavigate();
  const [discount, setDiscount] = useState<InitialDiscount>();
  const { discountId } = useParams();

  // initialDiscount
  const getDiscountDetail = async () => {
    try {
      if (discountId) {
        const discountRes = await discountApi.getDetail(discountId);
        const { name, start_time, end_time, discount_product_models } =
          discountRes.data.result;
        setDiscount({
          name,
          startTime: moment(start_time).format("HH:mm DD/MM/YYYY"),
          endTime: moment(end_time).format("HH:mm DD/MM/YYYY"),
          discountProductModels: discount_product_models,
        });
      }
    } catch (error: any) {
      message.error(error.response.data.error.message);
    }
  };

  useEffect(() => {
    getDiscountDetail();
  }, [discountId]);

  const submitEditDiscount = async (data: NewDiscountData) => {
    try {
      if (discountId) {
        await discountApi.update(discountId, data);
        message.success("Cập nhật chương trình khuyến mãi thành công");
        navigate(DISCOUNT_LIST);
      }
    } catch (error: any) {
      message.error(error.response.data.error.message);
    }
  };

  return (
    <DiscountControl
      initialDiscount={discount}
      type="edit"
      onSubmit={submitEditDiscount}
    />
  );
};

export default EditDiscount;
