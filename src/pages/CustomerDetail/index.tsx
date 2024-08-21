import { Card, Tabs } from "antd";
import CardTitle from "components/CardTitle";
import React from "react";
import CustomerBasicInfo from "pages/CustomerDetail/subcomponents/CustomerBasicInfo";
import CustomerAddress from "pages/CustomerDetail/subcomponents/CustomerAddress";

const { TabPane } = Tabs;

const CustomerDetail = () => {
  return (
    <div>
      <Card>
        <CardTitle
          title="Chi tiết khách hàng"
          subtitle="Thông tin chi tiết về khách hàng"
        />
        <Tabs>
          <TabPane tab="Thông tin cơ bản" key="BASIC">
            <CustomerBasicInfo />
          </TabPane>
          <TabPane tab="Địa chỉ" key="ADDRESS">
            <CustomerAddress />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default CustomerDetail;
