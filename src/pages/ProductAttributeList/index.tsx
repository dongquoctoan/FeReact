import React, { useEffect, useState } from "react";
import CardTitle from "components/CardTitle";
import { Button, Card, Col, Form, Input, message, Row } from "antd";
import { useFormik } from "formik";
import { PlusOutlined } from "@ant-design/icons";
import { fetchProductAttributeList } from "pages/ProductAttributeList/store";
import { useHookstate } from "@hookstate/core";
import store from "pages/ProductAttributeList/store";
import TableProductAttributeList from "pages/ProductAttributeList/subcomponents/TableProductAttributeList";
import { useParams } from "react-router-dom";
import ModalControlProductAttribute from "pages/ProductAttributeList/subcomponents/ModalControlProductAttribute";
import {
  CreateProductAttributeData,
  EditProductAttributeData,
  ProductAttribute,
} from "constants/types/productAttribute.type";
import productAttributeApi from "apis/productAttribute";

const ProductAttributeList = () => {
  const { id: productCategoryId } = useParams();

  useEffect(() => {
    fetchProductAttributeList({ product_category_id: productCategoryId });
  }, []);

  const productAttributeListState = useHookstate(store);

  const formFilter = useFormik({
    initialValues: {
      name: "",
    },
    onSubmit: (data: any) => {
      fetchProductAttributeList({
        product_category_id: productCategoryId,
        name: data.name,
      });
    },
  });

  const changePage = (page: number, pageSize: number) => {
    const params = {
      ...(formFilter.values as any),
      page,
      limit: pageSize,
    };
    fetchProductAttributeList(params);
  };

  // add new attrubute
  const [isOpenModalAddProductAttribute, setIsOpenModalAddProductAttribute] =
    useState<boolean>(false);

  const addProductAttribute = async (data: CreateProductAttributeData) => {
    try {
      if (productCategoryId) {
        const productAttributeData = {
          ...data,
          product_category_id: productCategoryId,
        };
        await productAttributeApi.create(productAttributeData);
      }
      setIsOpenModalAddProductAttribute(false);
      fetchProductAttributeList({ product_category_id: productCategoryId });
    } catch (error: any) {
      message.error(error.response.data.error.message);
    }
  };

  // edit
  const [isOpenModalEditProductAttribute, setIsOpenModalEditProductAttribute] =
    useState<boolean>(false);
  const [productAttributeSelected, setProductAttributeSelected] =
    useState<ProductAttribute>({
      _id: "",
      name: "",
      product_category_id: "",
      values: [],
      status: "",
    });

  const clickSelectProductAttribute = (
    productAttributeSelected: ProductAttribute
  ) => {
    setIsOpenModalEditProductAttribute(true);
    setProductAttributeSelected(productAttributeSelected);
  };

  const editProductAttribute = async (data: any) => {
    try {
      if (productCategoryId) {
        const productAttributeData: EditProductAttributeData = {
          _id: productAttributeSelected._id,
          name: data.name,
          product_category_id: productCategoryId,
          values: data.values.map((item: string) => {
            return {
              value: item,
            };
          }),
        };
        await productAttributeApi.update(productAttributeData);
      }
      setIsOpenModalEditProductAttribute(false);
      fetchProductAttributeList({ product_category_id: productCategoryId });
    } catch (error: any) {
      message.error(error.response.data.error.message);
    }
  };

  // delete
  const handleDeleteProductAttribute = async (productAttributeId: string) => {
    try {
      await productAttributeApi.delete(productAttributeId);
      fetchProductAttributeList({ product_category_id: productCategoryId });
    } catch (error: any) {
      message.error(error.response.data.error.message);
    }
  };

  return (
    <div>
      <ModalControlProductAttribute
        visible={isOpenModalAddProductAttribute}
        onCancel={() => setIsOpenModalAddProductAttribute(false)}
        onSubmit={addProductAttribute}
        okText="Thêm"
      />
      <ModalControlProductAttribute
        visible={isOpenModalEditProductAttribute}
        onCancel={() => setIsOpenModalEditProductAttribute(false)}
        onSubmit={editProductAttribute}
        productAttributeSelected={productAttributeSelected}
        okText="Cập nhật"
      />
      <Card bordered={false}>
        <CardTitle
          title="Thuộc tính sản phẩm"
          subtitle="Tổng hợp các thuộc tính sản phẩm của danh mục sản phẩm"
        />

        <Form colon={false} onFinish={formFilter.submitForm}>
          <Row gutter={16}>
            <Col span={7}>
              <Form.Item label="Tìm kiếm">
                <Input
                  name="name"
                  value={formFilter.values.name}
                  onChange={formFilter.handleChange}
                  placeholder="Tên Thuộc Tính"
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
          onClick={() => setIsOpenModalAddProductAttribute(true)}
        >
          Tạo mới
        </Button>

        <TableProductAttributeList
          productAttributes={productAttributeListState.product_attributes.get()}
          loading={productAttributeListState.isFetchingProductAttributeList.get()}
          total={productAttributeListState.total.get()}
          pageSize={productAttributeListState.limit.get()}
          current={productAttributeListState.page.get()}
          onChangePage={changePage}
          onSelect={clickSelectProductAttribute}
          onDelete={handleDeleteProductAttribute}
        />
      </Card>
    </div>
  );
};

export default ProductAttributeList;
