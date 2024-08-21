import React, { useCallback } from "react";
import { Avatar, Dropdown, Menu, message } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import authApi from "apis/auth";
import { useDispatch } from "react-redux";
import { logout } from "pages/App/store/appSlice";
import styles from "pages/App/subcomponents/MainLayout/subcomponents/Header/style.module.css";
import mainLogo from "assets/images/logo.png";

const Header = () => {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await authApi.logout();
      dispatch(logout());
    } catch (error) {
      message.error("Đăng xuất không thành công. Vui lòng thử lại.");
    }
  };

  const menu = useCallback(
    () => (
      <Menu>
        <Menu.Item icon={<LogoutOutlined />} onClick={handleLogout}>
          Đăng xuất
        </Menu.Item>
      </Menu>
    ),
    []
  );

  return (
    <header className={styles.wrapper}>
      <span className={styles.logo}>
        <img src={mainLogo} alt="logo" />
      </span>
      <div className={styles.menu}>
        <span>
          <Dropdown overlay={menu}>
            <Avatar />
          </Dropdown>
        </span>
      </div>
    </header>
  );
};

export default Header;
