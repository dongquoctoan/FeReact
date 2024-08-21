import { voucherApi } from "apis/voucher";
import { GetVoucherParams } from "constants/types/voucher.type";
import { useEffect, useState } from "react";

export type VouchersState = {
  vouchers: Array<any>;
  page: number;
  limit: number;
  total: number;
  isLoadingGetAllVoucher: boolean;
};

const initialState: VouchersState = {
  vouchers: [],
  page: 1,
  limit: 10,
  total: 0,
  isLoadingGetAllVoucher: false,
};

const useQueryVouchers = () => {
  const [vouchersState, setVouchersState] =
    useState<VouchersState>(initialState);

  const handleGetVouchers = async (params?: GetVoucherParams) => {
    try {
      setVouchersState((state) => ({ ...state, isLoadingGetAllVoucher: true }));
      const _params = {
        ...params,
        page: params?.page ? params.page : vouchersState.page,
        limit: params?.limit ? params.limit : vouchersState.limit,
      };

      const vouchersRes = await voucherApi.getAll(_params);
      setVouchersState((state) => ({
        ...state,
        vouchers: vouchersRes.data.result.docs,
        page: vouchersRes.data.result.page,
        limit: vouchersRes.data.result.limit,
        total: vouchersRes.data.result.totalDocs,
        isLoadingGetAllVoucher: false,
      }));
    } catch (error) {
      setVouchersState((state) => ({
        ...state,
        isLoadingGetAllVoucher: false,
      }));
    }
  };

  useEffect(() => {
    handleGetVouchers();
  }, []);

  return {
    vouchersState,
    handleGetVouchers,
  };
};

export default useQueryVouchers;
