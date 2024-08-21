import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Popconfirm, Space, Table, Tag } from "antd";
import { ColumnsType } from "antd/lib/table";
import Status from "components/Status";
import { Role } from "constants/types/role.type";
import { User } from "constants/types/user.type";
import { UsersState } from "pages/Users/hooks/useQueryUsers";
import React, { useMemo, FC } from "react";
import { formatDate } from "utils/date";
import styles from "pages/Users/Users.module.css";

type Props = {
  usersState: UsersState;
  onChangePage: (page: number, pageSize: number) => void;
  onClickEditUser: (user: User) => void;
  onConfirmDeleteUser: (userId: string) => void;
};

const TableUser: FC<Props> = ({
  usersState,
  onChangePage,
  onClickEditUser,
  onConfirmDeleteUser,
}) => {
  const columns: ColumnsType<any> = useMemo(
    () => [
      {
        title: "Người dùng",
        render: (_, user: User) => (
          <>
            <Space>
              <Avatar size="large" icon={<UserOutlined />} />
              <div>
                <div>{[user.first_name, user.last_name].join(" ")}</div>
                <span className={styles.username}>{user.username}</span>
              </div>
            </Space>
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
        title: "Thuộc nhóm",
        dataIndex: "roles",
        render: (roles: Array<Role>) => (
          <>
            <Space direction="vertical">
              {roles.map((role) => (
                <Tag key={role._id}>{role.description}</Tag>
              ))}
            </Space>
          </>
        ),
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
        dataIndex: "created_at",
        render: (created_at: string) => (
          <>
            <span>{formatDate(created_at)}</span>
          </>
        ),
      },
      {
        title: "Thao tác",
        render: (_, user) => (
          <>
            <Space direction="vertical">
              <Button
                size="small"
                type="link"
                onClick={() => onClickEditUser(user)}
              >
                Chỉnh sửa
              </Button>
              <Button size="small" type="link">
                Khóa
              </Button>
              <Popconfirm
                title="Xóa người dùng này?"
                onConfirm={() => onConfirmDeleteUser(user._id)}
              >
                <Button size="small" type="link" danger>
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
    <div>
      <Table
        size="small"
        bordered
        columns={columns}
        dataSource={usersState.users}
        pagination={{
          pageSize: usersState.limit,
          current: usersState.page,
          total: usersState.total,
          hideOnSinglePage: true,
          onChange: onChangePage,
        }}
        loading={usersState.isloadingGetAllUser}
      />
    </div>
  );
};

export default TableUser;
