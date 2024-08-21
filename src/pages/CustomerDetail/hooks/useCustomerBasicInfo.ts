import { message } from "antd";
import { customerApi } from "apis/customer";
import { customerAddressApi } from "apis/customerAddress";
import { Customer } from "constants/types/customer.type";
import { CustomerAddress } from "constants/types/customerAddress.type";
import { useEffect, useState } from "react";

const useCustomerBasicInfo = (customerId: string) => {
  const [customer, setCustomer] = useState<Customer>();
  const [addressList, setAddressList] = useState<Array<CustomerAddress>>([]);

  const handleGetCustomerDetail = async () => {
    try {
      if (customerId) {
        const customerRes = await customerApi.getOne(customerId);
        setCustomer(customerRes.data.result);
      }
    } catch (error: any) {
      message.error(error.response.data.error.message);
    }
  };

  const getCustomerAddress = async () => {
    try {
      if (customerId) {
        const res = await customerAddressApi.getAll(customerId);
        setAddressList(res.data.result);
      }
    } catch (error: any) {
      message.error(error.response.data.error.message);
    }
  };

  useEffect(() => {
    handleGetCustomerDetail();
    getCustomerAddress();
  }, []);

  return {
    customer,
    addressList,
    handleGetCustomerDetail,
    getCustomerAddress,
  };
};

export default useCustomerBasicInfo;
