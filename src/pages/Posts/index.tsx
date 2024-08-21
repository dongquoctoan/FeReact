import { Button, Card, Col, DatePicker, Form, Input, message, Row } from "antd";
import CardTitle from "components/CardTitle";
import { useEffect } from "react";
import TablePost from "pages/Posts/subcomponents/TablePost";
import { PlusOutlined } from "@ant-design/icons";
import { useHookstate } from "@hookstate/core";
import PostListStore, { fetchPostList } from "pages/Posts/store";
import { useFormik } from "formik";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { ADD_NEW_POST } from "routes/route.constant";
import { postApi } from "apis/post";

const PostList = () => {
  const postListState = useHookstate(PostListStore);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPostList();
  }, []);

  const formFilter = useFormik({
    initialValues: {
      name: "",
      start_time: null,
      end_time: null,
    },
    onSubmit: (data: any) => {
      fetchPostList(data);
    },
  });

  //   const changeFilterStatus = (status: string) => {
  //     const params: any = {
  //       ...formFilter.values,
  //       status,
  //     };

  //     fetchPostList(params);
  //     formFilter.setFieldValue("status", status);
  //   };

  const changeFilterTime = (dates: any, dateStrings: [string, string]) => {
    formFilter.setFieldValue("start_time", dateStrings[0]);
    formFilter.setFieldValue("end_time", dateStrings[1]);
  };

  const changePage = (page: number, pageSize: number) => {
    const params = {
      ...(formFilter.values as any),
      page,
      limit: pageSize,
    };
    fetchPostList(params);
  };

  const deletePost = async (postId: string) => {
    try {
      await postApi.delete(postId);
      message.success("Xóa bài viết thành công.");
      formFilter.submitForm();
    } catch (error: any) {
      message.error(error.response.data.error.message);
    }
  };

  return (
    <div>
      <Card>
        <CardTitle
          title="Danh sách bài viết"
          subtitle="Hãy bắt đầu tạo bài viết."
        />

        <Form colon={false} onFinish={formFilter.submitForm}>
          <Row gutter={16}>
            <Col span={7}>
              <Form.Item label="Tìm kiếm">
                <Input
                  name="name"
                  value={formFilter.values.name}
                  onChange={formFilter.handleChange}
                  placeholder="Tìm kiếm"
                />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item label="Thời gian">
                <DatePicker.RangePicker
                  value={[
                    formFilter.values.start_time &&
                      moment(formFilter.values.start_time, "DD-MM-YYYY"),
                    formFilter.values.end_time &&
                      moment(formFilter.values.end_time, "DD-MM-YYYY"),
                  ]}
                  onChange={changeFilterTime}
                  format="DD-MM-YYYY"
                />
              </Form.Item>
            </Col>
            <Col>
              <Button type="primary" htmlType="submit">
                Tìm
              </Button>
            </Col>
          </Row>
        </Form>
        <Button
          icon={<PlusOutlined />}
          type="primary"
          style={{ marginBottom: 16, float: "right" }}
          onClick={() => navigate(ADD_NEW_POST)}
        >
          Tạo mới
        </Button>
        <TablePost
          posts={postListState.posts.get()}
          loading={postListState.isLoading.get()}
          total={postListState.total.get()}
          pageSize={postListState.limit.get()}
          current={postListState.page.get()}
          onChangePage={changePage}
          onDelete={deletePost}
        />
      </Card>
    </div>
  );
};

export default PostList;
