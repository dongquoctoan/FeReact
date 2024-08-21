import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, message, Modal, Space, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import permissionApi from "apis/permission";
import permissionRoleApi from "apis/permissionRole";
import {
  GetPermissionsParams,
  Permission,
} from "constants/types/permission.type";
import { useFormik } from "formik";
import { isEmpty } from "lodash";
import styles from "pages/RoleDetail/subcomponents/ModalAddPermission/style.module.css";
import { FC, useEffect, useMemo, useState } from "react";

type ModalAddPermissionState = {
  permissions: Array<Permission>;
  page: number;
  limit: number;
  total: number;
  isLoadingGetAllPermission: boolean;
};

type Props = {
  visible: boolean;
  onCancel: () => void;
  permissionIds: Array<string>;
  roleId: string;
  onSuccess: () => void;
};

const ModalAddPermission: FC<Props> = ({
  visible,
  onCancel,
  permissionIds,
  roleId,
  onSuccess,
}) => {
  const [state, setState] = useState<ModalAddPermissionState>({
    permissions: [],
    page: 1,
    limit: 10,
    total: 0,
    isLoadingGetAllPermission: false,
  });

  const formFilter = useFormik({
    initialValues: {
      name: "",
      code: "",
    },
    onSubmit: (data) => {
      handleGetPermissions(data);
    },
  });

  const handleGetPermissions = async (params?: GetPermissionsParams) => {
    try {
      const permissionsRes = await permissionApi.getAll({
        page: state.page,
        limit: state.limit,
        ...params,
      });
      setState((state) => ({
        ...state,
        isLoadingGetAllPermission: true,
      }));
      const { docs, totalDocs, limit, page } = permissionsRes.data.result;
      setState({
        permissions: docs,
        page,
        limit,
        total: totalDocs,
        isLoadingGetAllPermission: false,
      });
    } catch (error) {
      setState((state) => ({
        ...state,
        isLoadingGetAllPermission: false,
      }));
    }
  };

  useEffect(() => {
    handleGetPermissions();
  }, []);

  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<string>>([]);
  const [existsPermissions, setExistsPermissions] = useState<Array<string>>([]);

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: Array<any>) => {
      setSelectedRowKeys(selectedRowKeys);
    },
    getCheckboxProps: (permission: Permission) => ({
      disabled: existsPermissions.includes(permission._id), // Column configuration not to be checked
    }),
  };

  useEffect(() => {
    if (visible) {
      setExistsPermissions(permissionIds);
    }
  }, [visible, permissionIds]);

  const handleChangePage = (page: number, pageSize: number) => {
    const params = {
      ...(formFilter.values as any),
      page,
      limit: pageSize,
    };
    handleGetPermissions(params);
  };

  const handleAddPermissions = async () => {
    try {
      await permissionRoleApi.create({
        role_id: roleId,
        permission_ids: selectedRowKeys,
      });
      message.success("Thêm quyền cho nhóm thành công.");
      onSuccess();
      onCancel();
    } catch (error: any) {
      message.error(error.response.data.error.message);
    }
  };

  const columns: ColumnsType<any> = useMemo(
    () => [
      {
        title: "Tên quyền",
        dataIndex: "name",
      },
      {
        title: "Mã quyền",
        dataIndex: "code",
      },
    ],
    []
  );

  return (
    <div className={styles.wrapper}>
      <Modal
        visible={visible}
        onCancel={onCancel}
        okText="Xác nhận"
        closable={false}
        width={640}
        onOk={handleAddPermissions}
        okButtonProps={{
          disabled: isEmpty(selectedRowKeys),
        }}
      >
        <div>
          <Space>
            <Input
              placeholder="Tên quyền"
              suffix={<SearchOutlined />}
              allowClear
              name="name"
              value={formFilter.values.name}
              onChange={formFilter.handleChange}
            />
            <Input
              placeholder="Mã quyền"
              suffix={<SearchOutlined />}
              allowClear
              name="code"
              value={formFilter.values.code}
              onChange={formFilter.handleChange}
            />
            <Button type="primary" onClick={formFilter.submitForm}>
              Tìm kiếm
            </Button>
          </Space>
        </div>
        <div className={styles.table}>
          <Table
            size="small"
            bordered
            columns={columns}
            rowSelection={{
              type: "checkbox",
              ...rowSelection,
            }}
            dataSource={state.permissions}
            pagination={{
              pageSize: state.limit,
              current: state.page,
              total: state.total,
              hideOnSinglePage: true,
              onChange: handleChangePage,
            }}
            loading={state.isLoadingGetAllPermission}
            rowKey={(row) => row._id}
          />
        </div>
      </Modal>
    </div>
  );
};

export default ModalAddPermission;
