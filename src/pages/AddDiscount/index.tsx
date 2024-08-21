import { message } from "antd";
import discountApi from "apis/discount";
import DiscountControl from "components/DiscountControl";
import { NewDiscountData } from "constants/types/discount.type";
import React from "react";
import { useNavigate } from "react-router-dom";
import { DISCOUNT_LIST } from "routes/route.constant";

const AddDiscount = () => {
  const navigate = useNavigate();

  const submitAddDiscount = async (data: NewDiscountData) => {
    try {
      await discountApi.create(data);
      message.success("Tạo chương trình khuyến mãi thành công");
      navigate(DISCOUNT_LIST);
    } catch (error: any) {
      message.error(error.response.data.error.message);
    }
  };

  return <DiscountControl onSubmit={submitAddDiscount} />;
};

export default AddDiscount;
