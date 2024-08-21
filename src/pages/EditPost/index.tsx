import { message } from "antd";
import { postApi } from "apis/post";
import PostControl, { InitialPost } from "components/PostControl";
import { UpdatePostData } from "constants/types/post.type";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { POST } from "routes/route.constant";

const EditPost = () => {
  const navigate = useNavigate();
  const [post, setPost] = useState<InitialPost>();
  const { postId } = useParams();

  // initialPost
  const getPostDetail = async () => {
    try {
      if (postId) {
        const postRes = await postApi.getOne(postId);
        const { title, description, content, post_category_ids } =
          postRes.data.result;
        setPost({
          title,
          description,
          content,
          post_category_ids,
        });
      }
    } catch (error: any) {
      message.error(error.response.data.error.message);
    }
  };

  useEffect(() => {
    getPostDetail();
  }, [postId]);

  const submitEditPost = async (data: UpdatePostData) => {
    try {
      if (postId) {
        await postApi.update(postId, data);
        message.success("Cập nhật bài viết thành công");
        navigate(POST);
      }
    } catch (error: any) {
      message.error(error.response.data.error.message);
    }
  };

  return (
    <PostControl initialPost={post} type="edit" onSubmit={submitEditPost} />
  );
};

export default EditPost;
