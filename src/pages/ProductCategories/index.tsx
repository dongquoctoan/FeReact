import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  DatePicker,
  Input,
  message,
  Space,
  Tabs,
  Tooltip,
} from "antd";
import { productCategoryApi } from "apis/productCategory";
import CardTitle from "components/CardTitle";
import InputNumber from "components/InputNumber";
import { ProductCategory as ProductCategoryType } from "constants/types/productCategory.type";
import { useFormik } from "formik";
import moment from "moment";
import { getSelectionProductCategories } from "pages/App/store/appSlice";
import useQueryProductCategories from "pages/ProductCategories/hooks/useQueryProductCategories";
import styles from "pages/ProductCategories/ProductCategories.module.css";
import ModalControlProdCategory, {
  FormControlProdCategoryValue,
} from "pages/ProductCategories/subcomponents/ModalControlProdCategory";
import TableProductCategory from "pages/ProductCategories/subcomponents/TableProductCategory";
import { useState } from "react";
import { useDispatch } from "react-redux";

const ProductCategories = () => {
  const dispatch = useDispatch();
  const { productCategoriesState, handleGetProductCategories } =
    useQueryProductCategories();

  // start filter
  const formFilter = useFormik({
    initialValues: {
      name: "",
      status: "actived",
      start_time: null,
      end_time: null,
      affiliate_percent_collaborator: null as number | null,
      affiliate_percent_customer: null as number | null,
    },
    onSubmit: (data: any) => {
      handleGetProductCategories(data);
    },
  });

  const handleChangeAffiliatePercentCollaborator = (value: any) => {
    formFilter.setFieldValue(
      "affiliate_percent_collaborator",
      value ? Number(value) : null
    );
  };
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
    handleGetProductCategories(params);
  };

  const changeFilterStatus = (status: string) => {
    const params: any = {
      ...formFilter.values,
      status,
    };
    handleGetProductCategories(params);
    formFilter.setFieldValue("status", status);
  };

  // start add new category
  const [visibleAddProdCategory, setVisibleAddProdCategory] =
    useState<boolean>(false);
  const [addProdCategoryError, setAddProdCategoryError] = useState<string>("");

  const handleCloseAddProdCategory = () => {
    setVisibleAddProdCategory(false);
    setAddProdCategoryError("");
  };

  const handleSubmitAddProdCategory = async (
    data: FormControlProdCategoryValue
  ) => {
    try {
      const {
        name,
        description,
        parent_category_ids,
        image,
        affiliate_percent_customer,
        affiliate_percent_collaborator,
      } = data;
      const parentCaterogyId =
        parent_category_ids[parent_category_ids.length - 1];
      await productCategoryApi.create({
        name,
        description,
        image,
        parent_category_id: parentCaterogyId,
        parent_category_path: parent_category_ids,
        affiliate_percent_customer,
        affiliate_percent_collaborator,
      });
      message.success("Thêm mới danh mục sản phẩm thành công.");
      formFilter.submitForm();
      handleCloseAddProdCategory();
      dispatch(getSelectionProductCategories());
    } catch (error: any) {
      setAddProdCategoryError(error.response.data.error.message);
    }
  };
  // end add new category

  // start edit category
  const [visibleEditProdCategory, setVisibleEditProdCategory] =
    useState<boolean>(false);
  const [prodCategorySelected, setProdCategorySelected] =
    useState<ProductCategoryType>();
  const [editProdCategoryError, setEditProdCategoryError] =
    useState<string>("");

  const handleOpenEditProdCategory = (productCategory: ProductCategoryType) => {
    setProdCategorySelected(productCategory);
    setVisibleEditProdCategory(true);
  };

  const handleCloseEditProdCategory = () => {
    setVisibleEditProdCategory(false);
    setEditProdCategoryError("");
  };

  const handleSubmitEditProductCategory = async (
    data: FormControlProdCategoryValue
  ) => {
    try {
      if (!prodCategorySelected) return;
      const {
        name,
        description,
        parent_category_ids,
        image,
        affiliate_percent_collaborator,
        affiliate_percent_customer,
      } = data;
      const parentCaterogyId =
        parent_category_ids[parent_category_ids.length - 1];
      await productCategoryApi.update(prodCategorySelected._id, {
        name,
        description,
        image,
        parent_category_id: parentCaterogyId,
        parent_category_path: parent_category_ids,
        affiliate_percent_collaborator,
        affiliate_percent_customer,
      });
      message.success("Cập nhật danh mục sản phẩm thành công.");
      formFilter.submitForm();
      handleCloseEditProdCategory();
      dispatch(getSelectionProductCategories());
    } catch (error: any) {
      setEditProdCategoryError(error.response.data.error.message);
    }
  };
  // end edit category

  // start delete category
  const handleConfirmDeleteProductCategory = async (
    productCategoryId: string
  ) => {
    try {
      await productCategoryApi.delete(productCategoryId);
      message.success("Xóa danh mục sản phẩm thành công.");
      formFilter.submitForm();
    } catch (error: any) {
      message.error(error.response.data.error.message);
    }
  };
  // end delete category

  return (
    <>
      <ModalControlProdCategory
        visible={visibleAddProdCategory}
        onCancel={handleCloseAddProdCategory}
        onSubmit={handleSubmitAddProdCategory}
        error={addProdCategoryError}
        okText="Thêm"
      />
      <ModalControlProdCategory
        visible={visibleEditProdCategory}
        onCancel={handleCloseEditProdCategory}
        onSubmit={handleSubmitEditProductCategory}
        error={editProdCategoryError}
        category={prodCategorySelected}
        okText="Cập nhật"
      />
      <div className={styles.wrapper}>
        <Card>
          <CardTitle
            title="Danh mục sản phẩm"
            subtitle="Tổng hợp danh mục sản phẩm của hệ thống"
          />
          <Tabs
            activeKey={formFilter.values.status}
            onChange={changeFilterStatus}
          >
            <Tabs.TabPane tab="Tất cả" key="" />
            <Tabs.TabPane tab="Đã kích hoạt" key="actived" />
            <Tabs.TabPane tab="Chưa kích hoạt" key="unactived" />
            <Tabs.TabPane tab="Đã khóa" key="locked" />
            <Tabs.TabPane tab="Đã xóa" key="deleted" />
          </Tabs>
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
              <Tooltip title="Lọc các bản ghi có hoa hồng tối thiểu">
                <InputNumber
                  placeholder="% hoa hồng (VD: 5)"
                  name="affiliate_percent"
                  value={
                    formFilter.values.affiliate_percent_collaborator
                      ? formFilter.values.affiliate_percent_collaborator.toString()
                      : ""
                  }
                  onChange={handleChangeAffiliatePercentCollaborator}
                  addonAfter="%"
                  allowNegative={false}
                />
              </Tooltip>

              <Button type="primary" onClick={formFilter.submitForm}>
                Tìm kiếm
              </Button>
            </Space>
          </div>
          {formFilter.values.status !== "deleted" && (
            <div className={styles.action}>
              <Button
                icon={<PlusOutlined />}
                type="primary"
                onClick={() => setVisibleAddProdCategory(true)}
              >
                Tạo mới
              </Button>
            </div>
          )}
          <TableProductCategory
            productCategoriesState={productCategoriesState}
            onChangePage={handleChangePage}
            onConfirmDeleteProdCategory={handleConfirmDeleteProductCategory}
            onClickEditProdCategory={handleOpenEditProdCategory}
          />
        </Card>
      </div>
    </>
  );
};

export default ProductCategories;
