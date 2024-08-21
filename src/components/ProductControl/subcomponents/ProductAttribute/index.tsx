import { Card, Col, Form, Input, Row } from "antd";
import CardTitle from "components/CardTitle";
import { RootState } from "configs/configureStore";
import {
  ProductExtensionItem,
  SettingProductCategory,
} from "constants/types/settingProductCategory.type";
import React, { ChangeEvent, useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { isEmpty } from "lodash";

const ProductDetailInfo = () => {
  const dispatch = useDispatch();

  // const { product_category_id, extension } = useSelector((state: RootState) => {
  //   const data = state.productInfoSlice;
  //   return {
  //     product_category_id: data.product_category_id,
  //     extension: data.extension,
  //   };
  // }, shallowEqual);

  return (
    <>
      {/* {isEmpty(productExtensions) ? null : (
        <Card>
          <CardTitle
            title="Thông tin chi tiết"
            subtitle="Bổ sung các thông tin về thuộc tính, tính năng sản phẩm"
          />
          <Form labelWrap labelCol={{ span: 6 }} colon={false}>
            <Row gutter={24}>
              {productExtensions.map((productExtension) => (
                <Col key={productExtension.key} span={8}>
                  <Form.Item label={productExtension.label}>
                    <Input
                      name={productExtension.key}
                      value={extension[productExtension.key]}
                      placeholder="Nhập vào"
                      onChange={handleExtensionChange}
                    />
                  </Form.Item>
                </Col>
              ))}
            </Row>
          </Form>
        </Card>
      )} */}
    </>
  );
};

export default React.memo(ProductDetailInfo);
