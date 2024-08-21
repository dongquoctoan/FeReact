import { SearchOutlined } from "@ant-design/icons";
import { Button, Card, Input, Space, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import CardTitle from "components/CardTitle";
import { useFormik } from "formik";
import useQueryPermissions from "pages/Permissions/hooks/useQueryPermissions";
import { formatDate } from "utils/date";
import styles from "pages/Permissions/Permissions.module.css";

const columns: ColumnsType<any> = [
  {
    title: "Tên quyền",
    dataIndex: "name",
    render: (value: string) => <strong>{value}</strong>,
  },
  {
    title: "Mã quyền",
    dataIndex: "code",
  },
  {
    title: "Ngày tạo",
    dataIndex: "created_at",
    render: (value: string) => <span>{value ? formatDate(value) : null}</span>,
  },
  {
    title: "Cập nhật",
    dataIndex: "updated_at",
    render: (value: string) => <span>{value ? formatDate(value) : null}</span>,
  },
];

const Permissions = () => {
  const { permissionsState, handleGetPermissions } = useQueryPermissions();

  // start filter
  const formFilter = useFormik({
    initialValues: {
      name: "",
      code: "",
      group: "",
    },
    onSubmit: (data) => {
      handleGetPermissions(data);
    },
  });
  // end filter

  const handleChangePage = (page: number, pageSize: number) => {
    const params = {
      ...(formFilter.values as any),
      page,
      limit: pageSize,
    };
    handleGetPermissions(params);
  };

  return (
    <div className={styles.wrapper}>
      <Card bordered={false}>
        <CardTitle
          title="Quản lý quyền người dùng"
          subtitle="Tổng hợp quyền người dùng trong hệ thống"
        />
        <div className={styles.filter}>
          <Space>
            <Input
              placeholder="Tên quyền"
              suffix={<SearchOutlined />}
              name="name"
              value={formFilter.values.name}
              onChange={formFilter.handleChange}
              allowClear
            />
            <Input
              placeholder="Mã quyền"
              suffix={<SearchOutlined />}
              name="code"
              value={formFilter.values.code}
              onChange={formFilter.handleChange}
              allowClear
            />
            <Input
              placeholder="Nhóm quyền"
              suffix={<SearchOutlined />}
              name="group"
              value={formFilter.values.group}
              onChange={formFilter.handleChange}
              allowClear
            />
            <Button type="primary" onClick={formFilter.submitForm}>
              Tìm kiếm
            </Button>
          </Space>
        </div>
        <div>
          <Table
            columns={columns}
            size="small"
            bordered
            dataSource={permissionsState.permissions}
            pagination={{
              pageSize: permissionsState.limit,
              current: permissionsState.page,
              total: permissionsState.total,
              hideOnSinglePage: true,
              onChange: handleChangePage,
            }}
            loading={permissionsState.isLoadingGetAllPermission}
            rowKey={(row) => row._id}
          />
        </div>
      </Card>
    </div>
  );
};

export default Permissions;
