import { useHookstate } from "@hookstate/core";
import { Affix, Button, Card, Form, Input, message, Space, Select } from "antd";
import CardTitle from "components/CardTitle";
import styles from "components/PostControl/PostControl.module.css";
import postControlStore, { resetState } from "components/PostControl/store";
import { CreatePostData } from "constants/types/post.type";
import useComponentMounted from "hooks/useComponentMounted";
import { usePrevious } from "hooks/usePrevious";
import { isEqual } from "lodash";
import React, { FC, memo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { POST } from "routes/route.constant";
import { z } from "zod";
import { Editor } from "components/Editor";
import { postCategoryApi } from "apis/postCategory";

type PostControlBasicError = {
  title: Array<string>;
  description: Array<string>;
  content: Array<string>;
  post_category_ids: Array<string>;
};

const validateBasicSchema = z.object({
  title: z.string().trim().min(1, { message: "Tiêu đề không được để trống." }),
  description: z.string(),
  content: z
    .string()
    .trim()
    .min(1, { message: "Nội dung không được để trống" }),
  post_category_ids: z
    .array(z.string())
    .min(1, { message: "Phải lựa chọn danh mục." }),
});

const initialBasicError = {
  title: [],
  description: [],
  content: [],
  post_category_ids: [],
};

export type InitialPost = {
  title: string;
  description: string;
  content: string;
  post_category_ids: Array<string>;
};

type Props = {
  initialPost?: InitialPost;
  type?: "edit" | "add";
  onSubmit: (data: CreatePostData) => void;
};

const PostControl: FC<Props> = ({ initialPost, type, onSubmit }) => {
  const navigate = useNavigate();
  const isMounted = useComponentMounted();

  const [postCategoryOptions, setPostCategoryOptions] = useState<any[]>([]);
  const postControlState = useHookstate(postControlStore);
  const errorBasicState =
    useHookstate<PostControlBasicError>(initialBasicError);

  const prevInitialPost = usePrevious(initialPost);

  // initial data
  useEffect(() => {
    if (initialPost && !isEqual(initialPost, prevInitialPost)) {
      const { title, description, content, post_category_ids } = initialPost;

      postControlState.title.set(title);
      postControlState.description.set(description);
      postControlState.content.set(content);
      postControlState.post_category_ids.set(post_category_ids);
    }
  }, [initialPost]);

  const validateBasicPostSetting = () => {
    const result = validateBasicSchema.safeParse(postControlState.value);

    if (result.success == false) {
      const errors: any = result.error.flatten().fieldErrors;
      errorBasicState.set(errors);
      return false;
    } else {
      errorBasicState.set(initialBasicError);
      return true;
    }
  };

  const changePostTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    postControlState.title.set(title);
  };

  const changeCategory = (value: string[]) => {
    postControlState.post_category_ids.set(value);
  };

  const changePostContent = (
    html: any,
    delta: any,
    source: any,
    editor: any
  ) => {
    const description = editor.getText();
    postControlState.content.set(html);
    postControlState.description.set(description);
  };

  // submit
  const submitForm = async () => {
    try {
      const cloneData = JSON.parse(JSON.stringify(postControlState.value));

      const validBasicSetting = validateBasicPostSetting();

      if (!validBasicSetting) return;

      onSubmit(cloneData);
    } catch (error: any) {
      message.error(error.response.data.error.message);
    }
  };

  const cancelPostControl = () => {
    resetState();
    navigate(POST);
  };

  const fetchPostCategoryOptions = async () => {
    try {
      const res = await postCategoryApi.getAll({ limit: 5000 });
      const arr = res.data.result.docs || [];
      const options = arr.map((item: any) => ({
        label: item.name,
        value: item._id,
      }));
      setPostCategoryOptions([...options]);
    } catch (ex) {
      setPostCategoryOptions([]);
    }
  };

  useEffect(() => {
    fetchPostCategoryOptions();
  }, []);

  useEffect(() => {
    return () => {
      if (isMounted) {
        resetState();
      }
    };
  }, [isMounted]);

  return (
    <>
      <Card>
        <CardTitle title="Thông tin bài viết" />
        <Form colon={false} labelCol={{ span: 3 }} wrapperCol={{ span: 20 }}>
          <Form.Item
            label="Tiêu đề"
            help={errorBasicState.title[0] && errorBasicState.title[0].get()}
            validateStatus={
              errorBasicState.title[0] && errorBasicState.title[0].get()
                ? "error"
                : ""
            }
          >
            <Input
              onChange={changePostTitle}
              value={postControlState.title.get()}
              placeholder="Tiêu đề bài viết"
            />
          </Form.Item>
          <Form.Item
            label="Danh mục"
            help={
              errorBasicState.post_category_ids[0] &&
              errorBasicState.post_category_ids[0].get()
            }
            validateStatus={
              errorBasicState.post_category_ids[0] &&
              errorBasicState.post_category_ids[0].get()
                ? "error"
                : ""
            }
          >
            <Select
              mode="multiple"
              allowClear
              onChange={changeCategory}
              value={postControlState.post_category_ids.get()}
              placeholder="Chọn danh mục"
              options={postCategoryOptions}
            />
          </Form.Item>
          <Form.Item
            label="Nội dung"
            help={
              errorBasicState.content[0] && errorBasicState.content[0].get()
            }
            validateStatus={
              errorBasicState.content[0] && errorBasicState.content[0].get()
                ? "error"
                : ""
            }
          >
            <Editor
              placeholder="Nội dung bài viết"
              value={postControlState.content.get()}
              handleChange={changePostContent}
            />
          </Form.Item>
        </Form>
      </Card>
      <Affix offsetBottom={0}>
        <Card style={{ marginTop: 16 }}>
          <Space>
            <Button onClick={cancelPostControl}>Hủy</Button>
            <Button type="primary" onClick={submitForm}>
              Xác nhận
            </Button>
          </Space>
        </Card>
      </Affix>
    </>
  );
};

export default memo(PostControl);
