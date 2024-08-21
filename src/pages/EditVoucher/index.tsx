import { Button, message, Space } from "antd";
import { voucherApi } from "apis/voucher";
import VoucherControl from "components/VoucherControl";
import { VoucherControlState } from "components/VoucherControl/hooks/useVoucherControl";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { VOUCHER } from "routes/route.constant";
import { isEqual } from "lodash";
import { FINISHED_STATUS } from "constants/Voucher/voucherType";

const EditVoucher: React.FC = () => {
  const navigate = useNavigate();
  const { voucherId } = useParams();
  const [voucher, setVoucher] = useState<VoucherControlState>();

  useEffect(() => {
    handleGetVoucherDetail();
  }, []);

  // get voucher detail
  const handleGetVoucherDetail = async () => {
    try {
      if (!voucherId) return;
      const response = await voucherApi.getDetail(voucherId);
      const result = response.data.result;
      setVoucher({
        ...result,
        start_time: moment(result.start_time).format("HH:mm DD/MM/YYYY"),
        end_time: moment(result.end_time).format("HH:mm DD/MM/YYYY"),
      });
    } catch (error: any) {
      message.error(error.response.data.error.message);
    }
  };

  const handleSubmitEditVoucher = async (voucherData: VoucherControlState) => {
    try {
      if (!voucherId) return;
      await voucherApi.update(voucherId, voucherData);
      message.success("Cập nhật voucher thành công.");
      navigate(VOUCHER, { replace: true });
    } catch (error: any) {
      message.error(error.response.data.error.message);
    }
  };

  const renderActions = (onSubmit: () => void, errors: object) => {
    return (
      <Space>
        <Button onClick={() => navigate(-1)}>Hủy</Button>
        {voucher?.status !== FINISHED_STATUS ? (
          <Button
            type="primary"
            onClick={onSubmit}
            disabled={isEqual(errors, {}) ? false : true}
          >
            Cập nhật
          </Button>
        ) : null}
      </Space>
    );
  };

  return (
    <div>
      <VoucherControl
        renderActions={renderActions}
        onSubmit={handleSubmitEditVoucher}
        initialVoucher={voucher}
      />
    </div>
  );
};

export default EditVoucher;
