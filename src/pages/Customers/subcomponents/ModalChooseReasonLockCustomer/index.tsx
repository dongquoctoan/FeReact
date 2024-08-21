import { Form, Modal, Radio, Space } from "antd";
import React, { FC } from "react";

type Props = {
  visible?: boolean;
  onCancel?: () => void;
  onNext: () => void;
  reasonId: string;
  onChangeReasonId: (e: any) => void;
};

const ModalChooseReasonLockCustomer: FC<Props> = ({
  visible,
  onCancel,
  onNext,
  reasonId,
  onChangeReasonId,
}) => {
  return (
    <>
      <Modal
        visible={visible}
        onCancel={onCancel}
        onOk={onNext}
        okText="Tiếp"
        okButtonProps={{ disabled: reasonId ? false : true }}
      >
        <Form layout="vertical">
          <Form.Item label="Lý do khóa tài khoản này?">
            <Radio.Group
              name="user_lock_reason_code_id"
              value={reasonId}
              onChange={onChangeReasonId}
            >
              <Space direction="vertical">
                <Radio value="id-1">Lý do 1</Radio>
                <Radio value="id-2">Lý do 2</Radio>
                <Radio value="id-3">Lý do 3</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default React.memo(ModalChooseReasonLockCustomer);
