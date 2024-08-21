import { Form, Input } from "antd";
import store, {
  getAffiliateRequestDetail,
} from "pages/AffiliateRequestDetail/store";
import Status from "components/Status";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useHookstate } from "@hookstate/core";

const RequestBasicInfo = () => {
  const requestDetailState = useHookstate(store);
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      getAffiliateRequestDetail(id);
    }
  }, [id]);

  return (
    <div>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 8 }}
        colon={false}
        labelWrap={true}
      >
        <Form.Item label="Tên khách hàng" style={{ marginBottom: 0 }}>
          <Form.Item
            style={{
              display: "inline-block",
              width: "calc(50% - 4px)",
              marginRight: "4px",
            }}
          >
            <Input
              placeholder="Họ"
              name="first_name"
              value={requestDetailState.first_name.get()}
              readOnly={true}
            />
          </Form.Item>
          <Form.Item
            style={{
              display: "inline-block",
              width: "calc(50% - 4px)",
              marginLeft: "4px",
            }}
          >
            <Input
              placeholder="Tên"
              name="last_name"
              value={requestDetailState.last_name.get()}
              readOnly={true}
            />
          </Form.Item>
        </Form.Item>
        <Form.Item label="Tên đăng nhập">
          <Input
            placeholder="Nhập vào"
            name="username"
            value={requestDetailState.username.get()}
          />
        </Form.Item>
        <Form.Item label="Địa chỉ email">
          <Input
            placeholder="Nhập vào"
            type="email"
            name="email"
            value={requestDetailState.email.get()}
            readOnly={true}
          />
        </Form.Item>
        <Form.Item label="Số điện thoại">
          <Input
            name="phone"
            value={requestDetailState.phone.get()}
            readOnly={true}
          />
        </Form.Item>
        <Form.Item label="Liên kết mạng xã hội">
          <Input
            name="link_socical_media"
            value={requestDetailState.link_social_media.get()}
            readOnly={true}
          />
        </Form.Item>
        <Form.Item label="Tình trạng yêu cầu">
          <Status status={requestDetailState.affiliate_status.get()} />
        </Form.Item>
      </Form>
    </div>
  );
};

export default RequestBasicInfo;
