import { Card, Tabs } from "antd";
import CardTitle from "components/CardTitle";
import React from "react";
import RequestBasicInfo from "pages/AffiliateRequestDetail/subcomponents/RequestBasicInfo";

const { TabPane } = Tabs;

const AffiliateRequestDetail: React.FunctionComponent = () => {
  return (
    <div>
      <Card>
        <CardTitle
          title="Chi tiết yêu cầu đăng kí tiếp thị liên kết"
          subtitle="Thông tin chi tiết về yêu cầu tiếp thị liên kết"
        />
        <Tabs>
          <TabPane tab="Thông tin cơ bản" key="BASIC">
            <RequestBasicInfo />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default AffiliateRequestDetail;
