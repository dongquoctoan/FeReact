import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  DatePicker,
  Input,
  message,
  Popconfirm,
  Space,
  Tabs,
} from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import { customerApi } from "apis/customer";
import CardTitle from "components/CardTitle";
import Status from "components/Status";
import { Customer as CustomerType } from "constants/types/customer.type";
import { useFormik } from "formik";
import moment from "moment";
import styles from "pages/Customers/Customers.module.css";
import ModalAddNewCustomer from "pages/Customers/subcomponents/ModalAddNewCustomer";
import ModalChooseReasonLockCustomer from "pages/Customers/subcomponents/ModalChooseReasonLockCustomer";
import ModalDetailLockCustomer from "pages/Customers/subcomponents/ModalDetailReasonLockCustomer";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CUSTOMER_DETAIL } from "routes/route.constant";
import { formatDate } from "utils/date";
import { replaceParams } from "utils/route";
// convert to hookstate
import { useHookstate } from "@hookstate/core";
import customersStore, { fetchCustomerList } from "pages/Customers/store";

const Customers = () => {
  const navigate = useNavigate();
  // hookstate
  const customersState = useHookstate(customersStore);

  const [visibleAddCustomer, setVisibleAddCustomer] = useState<boolean>(false);

  useEffect(() => {
    fetchCustomerList();
  }, []);

  // start filter
  const formFilter = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      status: "",
      start_time: null,
      end_time: null,
    },
    onSubmit: (data: any) => {
      fetchCustomerList({ ...data, page: 1 });
    },
  });

  // start add new Customer
  const handleOpenAddNewCustomer = () => {
    setVisibleAddCustomer(true);
  };

  const handleCloseAddNewCustomer = () => {
    setVisibleAddCustomer(false);
  };
  // end add new Customer

  // start delete
  const handleConfirmDeleteCustomer = async (id: string) => {
    try {
      await customerApi.delete(id);
      message.success("Xóa tài khoản thành công!");

      const params = {
        ...(formFilter.values as any),
      };
      fetchCustomerList(params);
    } catch (error: any) {
      message.error(error.response.data.error.message);
    }
  };
  // end delete

  const handleChangeFilterDate = (dates: any, dateStrings: [any, any]) => {
    formFilter.setValues({
      ...formFilter.values,
      start_time: dateStrings[0],
      end_time: dateStrings[1],
    });
  };

  const changeFilterStatus = (status: string) => {
    const params: any = {
      ...formFilter.values,
      status,
    };
    fetchCustomerList(params);
    formFilter.setFieldValue("status", status);
  };
  // end filter

  // start lock customer
  const [visibleChooseReasonLockCustomer, setVisibleChooseReasonLockCustomer] =
    useState<boolean>(false);
  const [visibleDetailLockCustomer, setVisibleDetailLockCustomer] =
    useState<boolean>(false);

  const formLockCustomer = useFormik({
    initialValues: {
      user_id: "",
      user_lock_reason_code_id: "",
      content: "",
    },
    onSubmit: async (data) => {
      try {
        await customerApi.lock(data);
        message.success("Khóa tài khoản thành công");
        formFilter.submitForm();
        formLockCustomer.resetForm();
      } catch (error) {
        message.error("Khóa tài khoản không thành công");
      }
    },
  });

  const handleNextStepLockCustomer = () => {
    setVisibleChooseReasonLockCustomer(false);
    setVisibleDetailLockCustomer(true);
  };

  // Lock customer
  const handleCloseLockCustomer = () => {
    setVisibleChooseReasonLockCustomer(false);
  };

  const handleOpenLockCustomer = (id: string) => {
    formLockCustomer.setValues({
      ...formLockCustomer.values,
      user_id: id,
    });
    setVisibleChooseReasonLockCustomer(true);
  };
  // end Lock customer

  // start detail lock customer
  const handleCloseDetailLockCustomer = () => {
    setVisibleDetailLockCustomer(false);
  };

  const handleBackToChoseReason = () => {
    setVisibleDetailLockCustomer(false);
    setVisibleChooseReasonLockCustomer(true);
  };
  // end detail lock customer

  // end lock customer

  const handChangePage = (page: number, pageSize: number) => {
    const params = {
      ...(formFilter.values as any),
      page,
      limit: pageSize,
    };
    fetchCustomerList(params);
  };

  const columns: ColumnsType<CustomerType> = useMemo(
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
        title: "Trạng thái",
        dataIndex: "status",
        render: (status) => (
          <>
            <Status status={status} />
          </>
        ),
      },
      {
        title: "Ngày tạo",
        dataIndex: "start_time",
        render: (start_time) => (
          <>
            <span>{formatDate(start_time)}</span>
          </>
        ),
      },
      {
        title: "Thao tác",
        render: (_, customer: CustomerType) => (
          <>
            <Space direction="vertical">
              <Button
                size="small"
                type="link"
                onClick={() =>
                  navigate(replaceParams(CUSTOMER_DETAIL, [customer._id]))
                }
              >
                Chi tiết
              </Button>
              {customer.status != "locked" && (
                <Button
                  size="small"
                  type="link"
                  onClick={() => handleOpenLockCustomer(customer._id)}
                >
                  Khóa
                </Button>
              )}
              {customer.status != "deleted" && (
                <Popconfirm
                  title="Xóa tài khoản này?"
                  onConfirm={() => handleConfirmDeleteCustomer(customer._id)}
                >
                  <Button size="small" type="link" danger>
                    Xóa
                  </Button>
                </Popconfirm>
              )}
            </Space>
          </>
        ),
      },
    ],
    []
  );

  return (
    <>
      <ModalAddNewCustomer
        visible={visibleAddCustomer}
        onCancel={handleCloseAddNewCustomer}
        onSuccess={formFilter.submitForm}
      />
      <ModalChooseReasonLockCustomer
        visible={visibleChooseReasonLockCustomer}
        onCancel={handleCloseLockCustomer}
        reasonId={formLockCustomer.values.user_lock_reason_code_id}
        onChangeReasonId={formLockCustomer.handleChange}
        onNext={handleNextStepLockCustomer}
      />
      <ModalDetailLockCustomer
        visible={visibleDetailLockCustomer}
        onCancel={handleCloseDetailLockCustomer}
        reasonContent={formLockCustomer.values.content}
        onChangeReasonContent={formLockCustomer.handleChange}
        onBackChooseReason={handleBackToChoseReason}
        onSubmit={formLockCustomer.submitForm}
      />
      <div className={styles.wrapper}>
        <Card bordered={false}>
          <CardTitle
            title="Quản lý khách hàng"
            subtitle="Tổng hợp khách hàng trong hệ thống"
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
                placeholder="Tên khách hàng"
                suffix={<SearchOutlined />}
                name="last_name"
                value={formFilter.values.last_name}
                onChange={formFilter.handleChange}
                allowClear
              />
              <Input
                placeholder="Email"
                suffix={<SearchOutlined />}
                name="email"
                value={formFilter.values.email}
                onChange={formFilter.handleChange}
                allowClear
              />
              <Input
                placeholder="Số điện thoại"
                suffix={<SearchOutlined />}
                name="phone"
                value={formFilter.values.phone}
                onChange={formFilter.handleChange}
                allowClear
              />
              <DatePicker.RangePicker
                format="DD-MM-YYYY"
                value={[
                  formFilter.values.start_time &&
                    moment(formFilter.values.start_time, "DD-MM-YY"),
                  formFilter.values.end_time &&
                    moment(formFilter.values.end_time, "DD-MM-YY"),
                ]}
                onChange={handleChangeFilterDate}
              />
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
                onClick={handleOpenAddNewCustomer}
              >
                Tạo mới
              </Button>
            </div>
          )}

          <div>
            <Table
              size="small"
              bordered
              columns={columns}
              dataSource={customersState.customers.get()}
              pagination={{
                pageSize: customersState.limit.get(),
                current: customersState.page.get(),
                total: customersState.total.get(),
                hideOnSinglePage: true,
                onChange: handChangePage,
              }}
              loading={customersState.isLoadingGetAllCustomer.get()}
            />
          </div>
        </Card>
      </div>
    </>
  );
};

export default Customers;
