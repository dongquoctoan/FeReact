import { Button, Card, message, Popconfirm, Space } from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import { affiliateApi } from "apis/affiliate";
import CardTitle from "components/CardTitle";
import Status from "components/Status";
import { AffiliateRequest as AffiliateRequestType } from "constants/types/affiliateRequest.type";
import styles from "pages/Customers/Customers.module.css";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AFFILIATE_REQUEST_DETAIL } from "routes/route.constant";
import { replaceParams } from "utils/route";
import { useHookstate } from "@hookstate/core";
import store, {
  getAffiliateRequestList,
} from "pages/AffiliateRequestList/store";

const AffiliateRequestList = () => {
  const navigate = useNavigate();
  const requestsState = useHookstate(store);

  useEffect(() => {
    getAffiliateRequestList();
  }, []);

  const handleConfirmRequest = async (affiliateRequestId: string) => {
    try {
      await affiliateApi.confirmRequestList(affiliateRequestId);
      message.success("Chấp nhận yêu cầu thành công!");
      getAffiliateRequestList();
    } catch (error: any) {
      message.error(error.response.data.error.message);
    }
  };

  const handleRefuseRequest = async (affiliateRequestId: string) => {
    try {
      await affiliateApi.refuseRequestList(affiliateRequestId);
      message.success("Từ chối yêu cầu thành công!");
      getAffiliateRequestList();
    } catch (error: any) {
      message.error(error.response.data.error.message);
    }
  };

  const handChangePage = (page: number, pageSize: number) => {
    const params = {
      page,
      limit: pageSize,
    };
    getAffiliateRequestList(params);
  };

  const columns: ColumnsType<AffiliateRequestType> = useMemo(
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
        title: "Trạng thái yêu cầu",
        dataIndex: "affiliate_status",
        render: (affiliate_status) => (
          <>
            <Status status={affiliate_status} />
          </>
        ),
      },
      {
        title: "Thao tác",
        render: (_, request: AffiliateRequestType) => (
          <>
            <Space direction="vertical">
              <Button
                size="small"
                type="link"
                onClick={() =>
                  navigate(
                    replaceParams(AFFILIATE_REQUEST_DETAIL, [request._id])
                  )
                }
              >
                Chi tiết
              </Button>
              {request.affiliate_status != "WAITING_CONFIRM" ? (
                <></>
              ) : (
                <>
                  <Popconfirm
                    title="Chấp nhận yêu cầu này?"
                    onConfirm={() => handleConfirmRequest(request._id)}
                  >
                    <Button size="small" type="link">
                      Chấp nhận
                    </Button>
                  </Popconfirm>
                  <Popconfirm
                    title="Từ chối yêu cầu này?"
                    onConfirm={() => handleRefuseRequest(request._id)}
                  >
                    <Button size="small" type="link" danger>
                      Từ chối
                    </Button>
                  </Popconfirm>
                </>
              )}
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
          title="Quản lý yêu cầu tiếp thị liên kết"
          subtitle="Tổng hợp yêu cầu tiếp thị liên kết"
        />
        <div>
          <Table
            size="small"
            bordered
            columns={columns}
            dataSource={requestsState.requests.get()}
            pagination={{
              pageSize: requestsState.limit.get(),
              current: requestsState.page.get(),
              total: requestsState.total.get(),
              hideOnSinglePage: true,
              onChange: handChangePage,
            }}
            loading={requestsState.isLoadingGetAllRequest.get()}
          />
        </div>
      </Card>
    </div>
  );
};

export default AffiliateRequestList;
