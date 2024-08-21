import { Button, Card, Space } from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import CardTitle from "components/CardTitle";
import Status from "components/Status";
import { AffiliateCollaborator as AffiliateCollaboratorType } from "constants/types/affiliateRequest.type";
import styles from "pages/Customers/Customers.module.css";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  AFFILIATE_COLLABORATOR_DETAIL,
  AFFILIATE_COLLABORATOR_PAYMENT_HISTORY,
} from "routes/route.constant";
import { replaceParams } from "utils/route";
import { useHookstate } from "@hookstate/core";
import store, {
  getCollaboratorList,
} from "pages/AffiliateCollaboratorList/store";

const AffiliateCollaboratorList: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const collaboratorState = useHookstate(store);

  useEffect(() => {
    getCollaboratorList();
  }, []);

  const handChangePage = (page: number, pageSize: number) => {
    const params = {
      page,
      limit: pageSize,
    };
    getCollaboratorList(params);
  };

  const columns: ColumnsType<AffiliateCollaboratorType> = useMemo(
    () => [
      {
        title: "Tên khách hàng",
        dataIndex: "full_name",
        render: (text, record) => (
          <>
            {record.first_name} {record.last_name}
          </>
        ),
      },
      {
        title: "Email",
        dataIndex: "email",
      },
      {
        title: "Số điện thoại",
        dataIndex: "phone",
      },
      {
        title: "Trạng thái tài khoản",
        dataIndex: "status",
        render: (status) => (
          <>
            <Status status={status} />
          </>
        ),
      },
      {
        title: "Mã tiếp thị",
        dataIndex: "affiliate_code",
      },
      {
        title: "Thao tác",
        render: (_, collaborator: AffiliateCollaboratorType) => (
          <>
            <Space direction="vertical">
              <Button
                size="small"
                type="link"
                onClick={() =>
                  navigate(
                    replaceParams(AFFILIATE_COLLABORATOR_DETAIL, [
                      collaborator._id,
                    ])
                  )
                }
              >
                Doanh thu
              </Button>
              <Button
                size="small"
                type="link"
                onClick={() =>
                  navigate(
                    replaceParams(AFFILIATE_COLLABORATOR_PAYMENT_HISTORY, [
                      collaborator._id,
                    ])
                  )
                }
              >
                Lịch sử thanh toán
              </Button>
            </Space>
          </>
        ),
      },
    ],
    []
  );

  return (
    <div className={styles.wrapper}>
      <Card bordered={false}>
        <CardTitle
          title="Quản lý cộng tác viên"
          subtitle="Tổng hợp danh sách cộng tác viên"
        />
        <div>
          <Table
            size="small"
            bordered
            columns={columns}
            dataSource={collaboratorState.collaborators.get()}
            pagination={{
              pageSize: collaboratorState.limit.get(),
              current: collaboratorState.page.get(),
              hideOnSinglePage: true,
              onChange: handChangePage,
            }}
            loading={collaboratorState.isLoadingGetAllCollaborator.get()}
          />
        </div>
      </Card>
    </div>
  );
};

export default AffiliateCollaboratorList;
