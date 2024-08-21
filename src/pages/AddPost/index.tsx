import { message } from "antd";
import { postApi } from "apis/post";
import PostControl from "components/PostControl";
import { CreatePostData } from "constants/types/post.type";
import { useNavigate } from "react-router-dom";
import { POST } from "routes/route.constant";

const AddPost = () => {
  const navigate = useNavigate();

  const submitAddPost = async (data: CreatePostData) => {
    try {
      await postApi.create(data);
      message.success("Tạo bài viết thành công");
      navigate(POST);
    } catch (error: any) {
      message.error(error.response.data.error.message);
    }
  };
  return <PostControl onSubmit={submitAddPost} />;
};

export default AddPost;
