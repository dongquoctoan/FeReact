import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Card, DatePicker, Input, message, Space, Tabs } from "antd";
import { userApi } from "apis/user";
import CardTitle from "components/CardTitle";
import {
  CreateUserData,
  EditUserData,
  User as UserType,
} from "constants/types/user.type";
import { useFormik } from "formik";
import moment from "moment";
import useQueryUsers from "pages/Users/hooks/useQueryUsers";
import ModalControlUser from "pages/Users/subcomponents/ModalControlUser";
import TableUser from "pages/Users/subcomponents/TableUser";
import styles from "pages/Users/Users.module.css";
import { useState } from "react";

const Users = () => {
  const { usersState, handleGetUsers } = useQueryUsers();

  // start filter
  const formFilter = useFormik({
    initialValues: {
      last_name: "",
      email: "",
      phone: "",
      status: "",
      start_time: null,
      end_time: null,
    },
    onSubmit: (data: any) => {
      handleGetUsers(data);
    },
  });

  const handleChangeFilterDate = (dates: any, dateStrings: [any, any]) => {
    formFilter.setValues({
      ...formFilter.values,
      start_time: dateStrings[0],
      end_time: dateStrings[1],
    });
  };
  // end filter

  const handleChangePage = (page: number, pageSize: number) => {
    const params = {
      ...(formFilter.values as any),
      page,
      limit: pageSize,
    };
    handleGetUsers(params);
  };

  const changeFilterStatus = (status: string) => {
    const params: any = {
      ...formFilter.values,
      status,
    };
    handleGetUsers(params);
    formFilter.setFieldValue("status", status);
  };

  // start add new user
  const [visibleAddUser, setVisibleAddUser] = useState<boolean>(false);
  const [addUserError, setAddUserError] = useState<string>();

  const handleSubmitAddUser = async (userData: CreateUserData) => {
    try {
      await userApi.create(userData);
      message.success("Thêm mới người dùng thành công.");
      formFilter.submitForm();
      setVisibleAddUser(false);
    } catch (error: any) {
      setAddUserError(error.response.data.error.message);
    }
  };

  const closeModalAddUser = () => {
    setVisibleAddUser(false);
    setAddUserError(undefined);
  };

  // end add new user

  // start edit user
  const [visibleEditUser, setVisibleEditUser] = useState<boolean>(false);
  const [editUserError, setEditUserError] = useState<string>();
  const [userSelected, setUserSelected] = useState<UserType>();

  const handleOpenEditUser = (user: UserType) => {
    setUserSelected(user);
    setVisibleEditUser(true);
  };

  const handleSubmitEditUser = async (userData: EditUserData) => {
    try {
      if (!userSelected) return;
      await userApi.update(userSelected._id, userData);
      message.success("Cập nhật người dùng thành công.");
      formFilter.submitForm();
      setVisibleEditUser(false);
    } catch (error: any) {
      setEditUserError(error.response.data.error.message);
    }
  };
  // end edit user

  // start delete user
  const handleConfirmDeleteUser = async (userId: string) => {
    try {
      await userApi.delete(userId);
      message.success("Xóa người dùng thành công");
      const params = {
        ...(formFilter.values as any),
      };
      handleGetUsers(params);
    } catch (error: any) {
      message.error(error.response.data.error.message);
    }
  };
  // end delete user

  return (
    <>
      <ModalControlUser
        visible={visibleAddUser}
        onCancel={closeModalAddUser}
        okText="Thêm"
        onSubmit={handleSubmitAddUser}
        error={addUserError}
      />
      <ModalControlUser
        visible={visibleEditUser}
        onCancel={() => setVisibleEditUser(false)}
        user={userSelected}
        okText="Cập nhật"
        error={editUserError}
        onSubmit={handleSubmitEditUser}
        hidePassword={true}
      />
      <div className={styles.wrapper}>
        <Card bordered={false}>
          <CardTitle
            title="Quản lý người dùng"
            subtitle="Tổng hợp người dùng trong hệ thống không bao gồm khách hàng"
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
                placeholder="Tên người dùng"
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
                    moment(formFilter.values.start_time, "DD-MM-YYYY"),
                  formFilter.values.end_time &&
                    moment(formFilter.values.end_time, "DD-MM-YYYY"),
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
                onClick={() => setVisibleAddUser(true)}
              >
                Tạo mới
              </Button>
            </div>
          )}
          <TableUser
            usersState={usersState}
            onChangePage={handleChangePage}
            onClickEditUser={handleOpenEditUser}
            onConfirmDeleteUser={handleConfirmDeleteUser}
          />
        </Card>
      </div>
    </>
  );
};

export default Users;
