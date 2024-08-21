import { useHookstate } from "@hookstate/core";
import { Button, Popconfirm, Space, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import Status from "components/Status";
import { Role } from "constants/types/role.type";
import rolesStore from "pages/Roles/store";
import { FC, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ROLE_DETAIL } from "routes/route.constant";
import { formatDate } from "utils/date";
import { replaceParams } from "utils/route";

type Props = {
  onChangePage: (page: number, pageSize: number) => void;
  onClickEditRole: (role: Role) => void;
  onConfirmDeleteRole: (roleId: string) => void;
};

const TableRole: FC<Props> = ({
  onChangePage,
  onClickEditRole,
  onConfirmDeleteRole,
}) => {
  const rolesState = useHookstate(rolesStore);

  const navigate = useNavigate();

  const columns: ColumnsType<any> = useMemo(
    () => [
      {
        title: "Mã nhóm",
        dataIndex: "code",
      },
      {
        title: "Tên nhóm",
        dataIndex: "name",
      },
      {
        title: "Mô tả",
        dataIndex: "description",
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
        key: "start_time",
        render: (created_at) => (
          <>
            <span>{formatDate(created_at)}</span>
          </>
        ),
      },
      {
        title: "Thao tác",
        render: (_, role: Role) => (
          <>
            <Space direction="vertical">
              {role.code !== "admin" && (
                <Button
                  size="small"
                  type="link"
                  onClick={() => onClickEditRole(role)}
                >
                  Chỉnh sửa
                </Button>
              )}
              <Button
                size="small"
                type="link"
                onClick={() => navigate(replaceParams(ROLE_DETAIL, [role._id]))}
              >
                Chi tiết
              </Button>
              {!["admin", "customer"].includes(role.code) && (
                <Popconfirm
                  title="Xóa nhóm quyền dùng này?"
                  onConfirm={() => onConfirmDeleteRole(role._id)}
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
    <div>
      <Table
        columns={columns}
        size="small"
        bordered
        dataSource={rolesState.roles.get()}
        pagination={{
          pageSize: rolesState.limit.get(),
          current: rolesState.page.get(),
          total: rolesState.total.get(),
          hideOnSinglePage: true,
          onChange: onChangePage,
        }}
        loading={rolesState.isLoadingGetAllRole.get()}
      />
    </div>
  );
};

export default TableRole;
