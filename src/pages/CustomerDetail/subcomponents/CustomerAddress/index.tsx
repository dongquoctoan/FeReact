import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Input,
  message,
  Popconfirm,
  Space,
  Tag,
  Table,
} from "antd";
import { ColumnsType } from "antd/lib/table";
import { customerApi } from "apis/customer";
import { customerAddressApi } from "apis/customerAddress";
import CardTitle from "components/CardTitle";
import { useFormik } from "formik";
import styles from "pages/Customers/Customers.module.css";
import { useEffect, useMemo, useRef, useState } from "react";
import ModalControl from "./subcomponents/Modalcontrol";
import useCustomerBasicInfo from "pages/CustomerDetail/hooks/useCustomerBasicInfo";
import { useParams } from "react-router-dom";
import {
  CreateCustomerAddressData,
  CustomerAddress as CustomerAddressType,
  UpdateCustomerAddressData,
} from "constants/types/customerAddress.type";

const CustomerAddress = () => {
  const { id } = useParams();

  const { addressList, getCustomerAddress } = useCustomerBasicInfo(id as any);

  const [visibleModal, setVisibleModal] = useState<boolean>(false);

  const currentAddressObj = useRef<any>(null);

  useEffect(() => {
    getCustomerAddress();
  }, []);

  // start filter
  const formFilter = useFormik({
    initialValues: {
      id: "",
      fullname: "",
      phone: "",
      email: "",
      address: "",
      is_default: null,
    },
    onSubmit: (data: any) => {
      // dispatch(getAllCustomerAddress(data));
    },
  });
  // end filter

  //   const handleChangePage = (page: number, pageSize: number) => {
  //     const params = {
  //       ...(formFilter.values as any),
  //       page,
  //       limit: pageSize,
  //     };
  //   };

  const columns: ColumnsType<any> = useMemo(
    () => [
      {
        title: "Tên người nhận",
        dataIndex: "name",
      },
      {
        title: "Số điện thoại",
        dataIndex: "phone",
      },
      {
        title: "Email",
        dataIndex: "email",
      },
      {
        title: "Địa chỉ",
        render: (_, record) => {
          const arr = [
            record.address_line,
            record.wards.name,
            record.districts.name,
            record.cities.name,
          ];
          return (
            <Space direction="vertical">
              {arr.join(", ")}
              {record.is_default ? <Tag color="success">Mặc định</Tag> : null}
            </Space>
          );
        },
      },
      {
        title: "Thao tác",
        render: (_, record) => (
          <>
            <Space direction="vertical">
              <Button
                size="small"
                type="link"
                onClick={() => handleOpenModalUpdate(record)}
              >
                Sửa
              </Button>
              <Button
                size="small"
                type="link"
                onClick={() => handleSetDefaultAddress(record)}
                disabled={record.is_default}
              >
                Thiết lập mặc định
              </Button>
              <Popconfirm
                title="Xóa địa chỉ này?"
                onConfirm={() => handleConfirmDeleteCustomerAddress(record._id)}
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

  const handleConfirmDeleteCustomerAddress = async (
    customerAddressId: string
  ) => {
    try {
      await customerAddressApi.delete(customerAddressId);
      message.success("Xóa địa chỉ thành công!");
      getCustomerAddress();
    } catch (error: any) {
      message.error(error.response.data.error.message);
    }
  };

  const handleSetDefaultAddress = async (data: CustomerAddressType) => {
    try {
      await customerAddressApi.update(data._id as any, {
        ...data,
        is_default: true,
      });
      message.success("Thiết lập mặc định thành công.");
      setVisibleModal(false);
      getCustomerAddress();
    } catch (error) {
      message.error("Thiết lập địa chỉ mặc định thất bại");
    }
  };

  const handleCreateAddress = async (data: CreateCustomerAddressData) => {
    try {
      await customerAddressApi.create({ ...data, user_id: id as any });
      message.success("Thêm mới địa chỉ KH thành công.");
      setVisibleModal(false);
      getCustomerAddress();
    } catch (error: any) {
      message.error(error.response.data.error.message);
    }
  };

  const handleUpdateAddress = async (data: UpdateCustomerAddressData) => {
    try {
      await customerAddressApi.update(currentAddressObj.current._id, data);
      message.success("Cập nhật địa chỉ KH thành công.");
      setVisibleModal(false);
      getCustomerAddress();
    } catch (error: any) {
      message.error(error.response.data.error.message);
    }
  };

  const handleOpenModalUpdate = (data: any) => {
    currentAddressObj.current = data;
    setVisibleModal(true);
  };

  const handleOpenModalCreate = () => {
    currentAddressObj.current = null;
    setVisibleModal(true);
  };

  return (
    <>
      <ModalControl
        visible={visibleModal}
        onCancel={() => setVisibleModal(false)}
        onSubmit={
          currentAddressObj.current ? handleUpdateAddress : handleCreateAddress
        }
        addressObj={currentAddressObj.current}
      />
      <div className={styles.wrapper}>
        <Card bordered={false}>
          <CardTitle title="Địa chỉ khách hàng" />
          {/* <div className={styles.filter}>
            <Space>
              <Input
                placeholder="Tên khách hàng"
                suffix={<SearchOutlined />}
                name="fullname"
                value={formFilter.values.fullname}
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
              <Input
                placeholder="Địa chỉ"
                suffix={<SearchOutlined />}
                name="address"
                value={formFilter.values.address}
                onChange={formFilter.handleChange}
                allowClear
              />
              <Button type="primary" onClick={formFilter.submitForm}>
                Tìm kiếm
              </Button>
            </Space>
          </div> */}
          <div className={styles.action}>
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={handleOpenModalCreate}
            >
              Tạo mới
            </Button>
          </div>
          <div>
            <Table
              size="small"
              bordered
              columns={columns}
              dataSource={addressList}
              pagination={false}
              //   pagination={{
              //     pageSize: limit,
              //     current: page,
              //     hideOnSinglePage: true,
              //     onChange: handleChangePage,
              //   }}
            />
          </div>
        </Card>
      </div>
    </>
  );
};

export default CustomerAddress;
