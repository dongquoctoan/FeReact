import { message } from "antd";
import livestreamApi from "apis/livestream";
import LivestreamContol from "components/LivestreamContol";
import { NewLiveStreamSession } from "constants/types/livestream.type";
import { useNavigate } from "react-router-dom";
import { LIVESTREAM_LIST } from "routes/route.constant";

const AddLivestream = () => {
  const navigate = useNavigate();

  const submitAddLivestream = async (data: NewLiveStreamSession) => {
    try {
      await livestreamApi.create(data);
      message.success("Tạo Livestream thành công");
      navigate(LIVESTREAM_LIST);
    } catch (error: any) {
      message.error(error.response.data.error.message);
    }
  };
  return <LivestreamContol onSubmit={submitAddLivestream} />;
};

export default AddLivestream;
