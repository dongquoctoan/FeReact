import { message } from "antd";
import livestreamApi from "apis/livestream";
import LivestreamControl, {
  InitialLivestream,
} from "components/LivestreamContol";
import { NewLiveStreamSession } from "constants/types/livestream.type";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LIVESTREAM_LIST } from "routes/route.constant";
import moment from "moment";

const EditLivestream = () => {
  const navigate = useNavigate();
  const [livestream, setLivestream] = useState<InitialLivestream>();
  const { livestreamId } = useParams();

  const getLivestreamDetail = async () => {
    try {
      if (livestreamId) {
        const dataRes = await livestreamApi.getDetail(livestreamId);
        const { title, link_livestream, start_time, end_time } =
          dataRes.data.result[0];
        setLivestream({
          title: title,
          link_livestream: link_livestream,
          start_time: moment(start_time).format("HH:mm DD/MM/YYYY"),
          end_time: moment(end_time).format("HH:mm DD/MM/YYYY"),
        });
      }
    } catch (error: any) {
      message.error(error.response.data.error.message);
    }
  };

  useEffect(() => {
    getLivestreamDetail();
  }, [livestreamId]);

  const submitEditLivestream = async (data: NewLiveStreamSession) => {
    try {
      if (livestreamId) {
        await livestreamApi.update(livestreamId, data);
        message.success("Cập nhật Livestream thành công");
        navigate(LIVESTREAM_LIST);
      }
    } catch (error: any) {
      message.error(error.response.data.error.message);
    }
  };

  return (
    <LivestreamControl
      initialLivestream={livestream}
      type="edit"
      onSubmit={submitEditLivestream}
    />
  );
};

export default EditLivestream;
