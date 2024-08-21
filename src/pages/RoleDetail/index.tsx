import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Descriptions,
  message,
  Popconfirm,
  Space,
  Table,
  Tag,
} from "antd";
import { ColumnsType } from "antd/lib/table";
import permissionRoleApi from "apis/permissionRole";
import { roleApi } from "apis/role";
import CardTitle from "components/CardTitle";
import {
  GetAllPermissionRoleParams,
  PermissionRole,
} from "constants/types/permissionRole.type";
import { Role } from "constants/types/role.type";
import ModalAddPermission from "pages/RoleDetail/subcomponents/ModalAddPermission";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { formatDate } from "utils/date";
import styles from "pages/RoleDetail/RoleDetail.module.css";

const RoleDetail = () => {
  // start add permission
  const [visibleAddPermission, setVisibleAddPermission] =
    useState<boolean>(false);

  const handleOpenAddPermission = () => {
    setVisibleAddPermission(true);
  };

  const handleCloseAddPermission = () => {
    setVisibleAddPermission(false);
  };
  // end add permission

  // start get role detail
  const { id } = useParams();

  const [role, setRole] = useState<Role>();
  const [permissionRoleState, setPermissionRoleState] = useState({
    permissionRoles: [] as Array<PermissionRole>,
    page: 1,
    limit: 10,
    total: 0,
  });

  const handleGetRoleDetail = async () => {
    try {
      if (!id) return;
      const roleRes = await roleApi.getOne(id);
      setRole(roleRes.data.result);
    } catch (error: any) {
      message.error(error.response.data.error.message);
    }
  };

  const handleGetPermissionRoles = async (
    params?: GetAllPermissionRoleParams
  ) => {
    try {
      const _params = {
        ...params,
        page: params?.page ? params.page : permissionRoleState.page,
        limit: params?.limit ? params.limit : permissionRoleState.limit,
        role_id: id,
      };

      const permissionRolesRes = await permissionRoleApi.getAll(_params);
      const { docs, page, limit, totalDocs } = permissionRolesRes.data.result;
      setPermissionRoleState({
        permissionRoles: docs,
        page,
        limit,
        total: totalDocs,
      });
    } catch (error: any) {
      message.error(error.response.data.error.message);
    }
  };

  useEffect(() => {
    handleGetRoleDetail();
    handleGetPermissionRoles();
  }, []);
  // end get role detail

  const handleChangePage = (page: number, pageSize: number) => {
    const params = {
      page,
      limit: pageSize,
    };
    handleGetPermissionRoles(params);
  };

  const handleConfirmDeletePermissionRole = async (
    permissionRoleId: string
  ) => {
    try {
      await permissionRoleApi.delete(permissionRoleId);
      message.success("Xóa quyền khỏi nhóm thành công.");
      handleGetPermissionRoles();
    } catch (error: any) {
      message.error(error.response.data.error.message);
    }
  };

  const columns: ColumnsType<any> = useMemo(
    () => [
      {
        title: "Tên quyền",
        render: (_, permissionRole: PermissionRole) => (
          <span>{permissionRole.permission.name}</span>
        ),
      },
      {
        title: "Mã quyền",
        render: (_, permissionRole: PermissionRole) => (
          <span>{permissionRole.permission.code}</span>
        ),
      },
      {
        title: "Ngày thêm",
        render: () => <span>{formatDate(new Date())}</span>,
      },
      {
        title: "Thao tác",
        render: (_: any, permissionRole: PermissionRole) => (
          <>
            <Space direction="vertical">
              <Popconfirm
                title="Loại bỏ quyền này?"
                onConfirm={() =>
                  handleConfirmDeletePermissionRole(permissionRole._id)
                }
              >
                <Button danger type="link" size="small">
                  Xóa
                </Button>
              </Popconfirm>
            </Space>
          </>
        ),
      },
    ],
    []
  );

  return (
    <>
      {role && (
        <>
          <ModalAddPermission
            visible={visibleAddPermission}
            onCancel={handleCloseAddPermission}
            permissionIds={permissionRoleState.permissionRoles.map(
              (permissionRole) => permissionRole.permission_id
            )}
            roleId={role._id}
            onSuccess={handleGetPermissionRoles}
          />
          <div className={styles.wrapper}>
            <Card>
              <CardTitle
                title="Chi tiết nhóm người dùng"
                subtitle="Thông tin chi tiết về nhóm người dùng"
              />
              <Descriptions>
                <Descriptions.Item label="Tên nhóm">
                  {role.name}
                </Descriptions.Item>
                <Descriptions.Item label="Mô tả">
                  {role.description}
                </Descriptions.Item>
                <Descriptions.Item label="Mã nhóm">
                  {role.code}
                </Descriptions.Item>
                <Descriptions.Item label="Nhóm mặc định">
                  {role.is_default && <Tag color="success">Mặc định</Tag>}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày tạo">
                  {formatDate(role.created_at)}
                </Descriptions.Item>
              </Descriptions>
              <div className={styles.action}>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleOpenAddPermission}
                >
                  Thêm
                </Button>
              </div>
              <div>
                <Table
                  size="small"
                  bordered
                  columns={columns}
                  dataSource={permissionRoleState.permissionRoles}
                  pagination={{
                    pageSize: permissionRoleState.limit,
                    current: permissionRoleState.page,
                    total: permissionRoleState.total,
                    hideOnSinglePage: true,
                    onChange: handleChangePage,
                  }}
                />
              </div>
            </Card>
          </div>
        </>
      )}
    </>
  );
};

export default RoleDetail;
