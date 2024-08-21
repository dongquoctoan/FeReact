import { Button, Form, Modal } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { FC } from "react";

type Props = {
  visible?: boolean;
  reasonContent: string;
  onCancel: () => void;
  onChangeReasonContent: (e: any) => void;
  onBackChooseReason: () => void;

  onSubmit: () => void;
};

const ModalDetailLockCustomer: FC<Props> = ({
  visible,
  reasonContent,
  onCancel,
  onChangeReasonContent,
  onBackChooseReason,
  onSubmit,
}) => {
  const handleLockCustomer = () => {
    onSubmit();
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="return" type="primary" onClick={onBackChooseReason}>
          Quay lại
        </Button>,
        <Button key="lock" type="primary" onClick={handleLockCustomer}>
          Khóa
        </Button>,
      ]}
    >
      <Form layout="vertical">
        <Form.Item label="Lý do khóa tài khoản này?">
          <TextArea
            name="content"
            showCount
            maxLength={100}
            value={reasonContent}
            style={{ height: 120 }}
            onChange={onChangeReasonContent}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalDetailLockCustomer;
