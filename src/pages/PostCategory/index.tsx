import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Card, DatePicker, Input, message, Space } from "antd";
import CardTitle from "components/CardTitle";
import { useFormik } from "formik";
import moment from "moment";
import useQueryPostCategories from "pages/PostCategory/hooks/useQueryPostCategories";
import styles from "pages/PostCategory/PostCategory.module.css";
import ModalControlPostCategory, {
  FormControlPostCategoryValue,
} from "pages/PostCategory/subcomponents/ModalControlPostCategory";
import TablePostCategory from "pages/PostCategory/subcomponents/TablePostCategory";
import { useState } from "react";
import { PostCategory } from "constants/types/postCategory.type";
import { postCategoryApi } from "apis/postCategory";

const PostCategories = () => {
  const { postCategoriesState, handleGetPostCategories } =
    useQueryPostCategories();

  // start filter
  const formFilter = useFormik({
    initialValues: {
      name: "",
      status: "",
      start_time: null,
      end_time: null,
    },
    onSubmit: (data: any) => {
      handleGetPostCategories(data);
    },
  });

  const handleChangeFilterDate = (dates: any, dateStrings: [any, any]) => {
    formFilter.setValues({
      ...formFilter.values,
      start_time: dateStrings[0],
      end_time: dateStrings[1],
    });
  };
  // end filter

  const handleChangePage = (page: number, pageSize: number) => {
    const params = {
      ...(formFilter.values as any),
      page,
      limit: pageSize,
    };
    handleGetPostCategories(params);
  };

  // start add new category
  const [visibleAddPostCategory, setVisibleAddPostCategory] =
    useState<boolean>(false);
  const [addPostCategoryError, setAddPostCategoryError] = useState<string>("");

  const handleCloseAddPostCategory = () => {
    setVisibleAddPostCategory(false);
    setAddPostCategoryError("");
  };

  const handleSubmitAddPostCategory = async (
    data: FormControlPostCategoryValue
  ) => {
    try {
      const { name, description } = data;
      await postCategoryApi.create({
        name,
        description,
      });
      message.success("Thêm mới danh mục tin tức thành công.");
      formFilter.submitForm();
      handleCloseAddPostCategory();
    } catch (error: any) {
      setAddPostCategoryError(error.response.data.error.message);
    }
  };
  // end add new category

  // start edit category
  const [visibleEditPostCategory, setVisibleEditPostCategory] =
    useState<boolean>(false);
  const [postCategorySelected, setPostCategorySelected] =
    useState<PostCategory>();
  const [editPostCategoryError, setEditPostCategoryError] =
    useState<string>("");

  const handleOpenEditPostCategory = (postCategory: PostCategory) => {
    setPostCategorySelected(postCategory);
    setVisibleEditPostCategory(true);
  };

  const handleCloseEditPostCategory = () => {
    setVisibleEditPostCategory(false);
    setEditPostCategoryError("");
  };

  const handleSubmitEditPostCategory = async (
    data: FormControlPostCategoryValue
  ) => {
    try {
      if (!postCategorySelected) return;
      const { name, description } = data;
      await postCategoryApi.update(postCategorySelected._id, {
        name,
        description,
      });
      message.success("Cập nhật danh mục tin tức thành công.");
      formFilter.submitForm();
      handleCloseEditPostCategory();
    } catch (error: any) {
      setEditPostCategoryError(error.response.data.error.message);
    }
  };
  // end edit category

  // start delete category
  const handleConfirmDeletePostCategory = async (postCategoryId: string) => {
    try {
      await postCategoryApi.delete(postCategoryId);
      message.success("Xóa danh mục tin tức thành công.");
      formFilter.submitForm();
    } catch (error: any) {
      message.error(error.response.data.error.message);
    }
  };
  // end delete category

  return (
    <>
      <ModalControlPostCategory
        visible={visibleAddPostCategory}
        onCancel={handleCloseAddPostCategory}
        onSubmit={handleSubmitAddPostCategory}
        error={addPostCategoryError}
        okText="Thêm"
      />
      <ModalControlPostCategory
        visible={visibleEditPostCategory}
        onCancel={handleCloseEditPostCategory}
        onSubmit={handleSubmitEditPostCategory}
        error={editPostCategoryError}
        category={postCategorySelected}
        okText="Cập nhật"
      />
      <div className={styles.wrapper}>
        <Card>
          <CardTitle
            title="Danh mục tin tức & sự kiện"
            subtitle="Tổng hợp danh mục tin tức & sự kiện của hệ thống"
          />
          <div className={styles.filter}>
            <Space>
              <Input
                placeholder="Tên danh mục"
                suffix={<SearchOutlined />}
                name="name"
                value={formFilter.values.name}
                onChange={formFilter.handleChange}
                allowClear
              />
              <DatePicker.RangePicker
                format="DD-MM-YYYY"
                value={[
                  formFilter.values.start_time &&
                    moment(formFilter.values.start_time, "DD-MM-YYYY"),
                  formFilter.values.end_time &&
                    moment(formFilter.values.end_time, "DD-MM-YYYY"),
                ]}
                onChange={handleChangeFilterDate}
              />
              <Button type="primary" onClick={formFilter.submitForm}>
                Tìm kiếm
              </Button>
            </Space>
          </div>
          <div className={styles.action}>
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={() => setVisibleAddPostCategory(true)}
            >
              Tạo mới
            </Button>
          </div>
          <TablePostCategory
            postCategoriesState={postCategoriesState}
            onChangePage={handleChangePage}
            onConfirmDeletePostCategory={handleConfirmDeletePostCategory}
            onClickEditPostCategory={handleOpenEditPostCategory}
          />
        </Card>
      </div>
    </>
  );
};

export default PostCategories;
