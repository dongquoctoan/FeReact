import { Button, message, Space } from "antd";
import { voucherApi } from "apis/voucher";
import VoucherControl from "components/VoucherControl";
import { VoucherControlState } from "components/VoucherControl/hooks/useVoucherControl";
import { isEqual } from "lodash";
import React from "react";
import { useNavigate } from "react-router-dom";
import { VOUCHER } from "routes/route.constant";

const AddVoucher: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateVoucher = async (data: VoucherControlState) => {
    try {
      await voucherApi.create(data);
      message.success("Thêm mới voucher thành công.");
      navigate(VOUCHER, { replace: true });
    } catch (error: any) {
      message.error(error.response.data.error.message);
    }
  };

  const renderActions = (onSubmit: () => void, errors: object) => {
    return (
      <Space>
        <Button onClick={() => navigate(-1)}>Hủy</Button>
        <Button
          type="primary"
          onClick={onSubmit}
          disabled={isEqual(errors, {}) ? false : true}
        >
          Lưu &#38; Hiển thị
        </Button>
      </Space>
    );
  };
  return (
    <div>
      <VoucherControl
        renderActions={renderActions}
        onSubmit={handleCreateVoucher}
      />
    </div>
  );
};

export default AddVoucher;
