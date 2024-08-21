import {
  ShoppingOutlined,
  SolutionOutlined,
  TagOutlined,
  TeamOutlined,
  BankOutlined,
  CarryOutOutlined,
  PieChartOutlined,
  SendOutlined,
  BlockOutlined,
  CommentOutlined,
  UsergroupAddOutlined,
  VideoCameraOutlined
} from "@ant-design/icons";
import { Menu } from "antd";
import styles from "pages/App/subcomponents/MainLayout/subcomponents/SideBar/style.module.css";
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ADD_NEW_PRODUCT,
  DISCOUNT_LIST,
  LIST_CUSTOMER,
  LIST_FLASH_SALE,
  PERMISSION,
  PRODUCT,
  PRODUCT_CATEGORY,
  ROLE,
  USER,
  VOUCHER,
  WAREHOUSE,
  ORDER,
  DEFAULT,
  POST_CATEGORY,
  ADD_NEW_POST,
  POST,
  AFFILIATE_REQUEST_LIST,
  AFFILIATE_COLLABORATOR_LIST,
  LIVESTREAM_LIST,
  BANNER,
} from "routes/route.constant";

type SubMenuItem = {
  title: string;
  path: string;
};

type MenuItem = {
  title: string;
  key: string;
  icon?: ReactNode;
  submenus?: Array<SubMenuItem>;
  path?: string;
};

const menus: Array<MenuItem> = [
  {
    title: "Dashboard",
    key: "dashboard",
    path: DEFAULT,
    icon: <PieChartOutlined />,
  },
  {
    title: "Người Dùng",
    key: "user",
    icon: <TeamOutlined />,
    submenus: [
      {
        title: "Danh sách người dùng",
        path: USER,
      },
      {
        title: "Danh sách nhóm",
        path: ROLE,
      },
      {
        title: "Danh sách quyền",
        path: PERMISSION,
      },
    ],
  },
  {
    title: "Sản Phẩm",
    key: "product",
    icon: <ShoppingOutlined />,
    submenus: [
      {
        title: "Danh mục sản phẩm",
        path: PRODUCT_CATEGORY,
      },
      {
        title: "Danh sách sản phẩm",
        path: PRODUCT,
      },
      {
        title: "Thêm sản phẩm",
        path: ADD_NEW_PRODUCT,
      },
    ],
  },
  {
    title: "Khách Hàng",
    key: "custommer",
    icon: <SolutionOutlined />,
    submenus: [
      {
        title: "Danh sách khách hàng",
        path: LIST_CUSTOMER,
      },
    ],
  },
  {
    title: "Kênh Marketing",
    key: "marketing",
    icon: <TagOutlined />,
    submenus: [
      {
        title: "Flash Sale",
        path: LIST_FLASH_SALE,
      },
      {
        title: "Mã Giảm Giá",
        path: VOUCHER,
      },
      {
        title: "Khuyến Mãi",
        path: DISCOUNT_LIST,
      },
    ],
  },
  {
    title: "Kho Hàng",
    key: "warehouse",
    icon: <BankOutlined />,
    submenus: [
      {
        title: "Danh sách kho hàng",
        path: WAREHOUSE,
      },
    ],
  },
  {
    title: "Đơn Hàng",
    key: "order",
    icon: <CarryOutOutlined />,
    submenus: [
      {
        title: "Danh sách đơn hàng",
        path: ORDER,
      },
    ],
  },
  {
    title: "Bài viết",
    key: "posts",
    icon: <SendOutlined />,
    submenus: [
      {
        title: "Tất cả bài viết",
        path: POST,
      },
      {
        title: "Thêm mới",
        path: ADD_NEW_POST,
      },
      {
        title: "Danh mục bài viết",
        path: POST_CATEGORY,
      },
    ],
  },
  {
    title: "Livestream",
    key: "livestream",
    icon: <VideoCameraOutlined />,
    submenus: [
      {
        title: "Danh sách phiên livestream",
        path: LIVESTREAM_LIST,
      },
    ],
  },
  {
    title: "Banner Trang Chủ",
    key: "banners",
    icon: <BlockOutlined />,
    path: BANNER,
  },
  {
    title: "Chăm sóc khách hàng",
    key: "care-customer",
    icon: <CommentOutlined />,
    path: "#",
  },
  {
    title: "Tiếp Thị Liên Kết",
    key: "affiliate",
    icon: <UsergroupAddOutlined />,
    submenus: [
      {
        title: "Danh sách yêu cầu đăng ký",
        path: AFFILIATE_REQUEST_LIST,
      },
      {
        title: "Danh sách cộng tác viên",
        path: AFFILIATE_COLLABORATOR_LIST,
      },
    ],
  },
];

const SideBar = () => {
  return (
    <div>
      <div className={styles.wrapper}>
        <Menu style={{ width: 220, border: "none" }} mode="inline">
          {menus.map((menu) =>
            menu.submenus ? (
              <Menu.SubMenu key={menu.key} title={menu.title} icon={menu.icon}>
                {menu.submenus &&
                  menu.submenus.map((submenu) => (
                    <Menu.Item key={submenu.path}>
                      <Link to={submenu.path}>{submenu.title}</Link>
                    </Menu.Item>
                  ))}
              </Menu.SubMenu>
            ) : (
              <Menu.Item key={menu.key} icon={menu.icon}>
                <Link to={menu.path || "/"}>{menu.title}</Link>
              </Menu.Item>
            )
          )}
        </Menu>
      </div>
      <div style={{ width: 220 }} />
    </div>
  );
};

export default SideBar;
