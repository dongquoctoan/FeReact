import { useHookstate } from "@hookstate/core";
import { Button, Card, message } from "antd";
import { warehouseApi } from "apis/warehouse";
import CardTitle from "components/CardTitle";
import {
  CreateWarehouseData,
  UpdateWarehouseData,
  Warehouse as WarehouseType,
} from "constants/types/warehouse.type";
import warehouseStore, { fetchWWarehouse } from "pages/Warehouse/store";
import { FilterWarehouse } from "pages/Warehouse/subcomponents/FilterWarehouse";
import ModalControlWarehouse from "pages/Warehouse/subcomponents/ModalControl";
import WarehouseTable from "pages/Warehouse/subcomponents/WarehouseTable";
import styles from "pages/Warehouse/Warehouse.module.css";
import { FC, useCallback, useEffect, useRef, useState } from "react";

const Warehouse: FC = () => {
  const warehouseState = useHookstate(warehouseStore);
  const [activeTabKey, setActiveTabKey] = useState<string>("");
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const currentWarehouse = useRef<WarehouseType | any>(null);

  useEffect(() => {
    fetchWWarehouse();
  }, []);

  const handleOnPageChange = (page: number, pageSize: number) => {
    const params = {
      page,
      limit: pageSize,
    };
    fetchWWarehouse(params);
  };
  const handleConfirmDeleteWarehouse = async (warehouseId: string) => {
    try {
      await warehouseApi.delete(warehouseId);
      message.success("Xóa kho hàng thành công!");
      fetchWWarehouse();
    } catch (error) {
      message.error("Xóa kho hàng không thành công!");
    }
  };

  const handleCreateWarehouse = async (data: CreateWarehouseData) => {
    try {
      await warehouseApi.create(data);
      message.success("Thêm mới kho hàng thành công.");
      setIsOpenModal(false);
      fetchWWarehouse();
    } catch (error: any) {
      message.error(error.response.data.error.message);
    }
  };

  const handleUpdateWarehouse = async (data: UpdateWarehouseData) => {
    try {
      await warehouseApi.update(currentWarehouse.current._id, data);
      message.success("Cập nhật kho hàng thành công.");
      setIsOpenModal(false);
      fetchWWarehouse();
    } catch (error: any) {
      message.error(error.response.data.error.message);
    }
  };

  const handleOpenModalUpdate = (data: WarehouseType) => {
    currentWarehouse.current = data;
    setIsOpenModal(true);
  };

  const handleOpenModalCreate = () => {
    currentWarehouse.current = null;
    setIsOpenModal(true);
  };

  const onFilter = useCallback((data: any) => {
    fetchWWarehouse(data);
  }, []);
  
  return (
    <>
      <Card bordered={false}>
        <CardTitle
          title="Quản lý kho hàng"
          subtitle="Tổng hợp các kho hàng của hệ thống"
        />
        <FilterWarehouse
          onFilter={onFilter}
          setActiveTabKey={setActiveTabKey}
        />
        {activeTabKey !== "deleted" && (
          <div className={styles.action}>
            <Button type="primary" onClick={handleOpenModalCreate}>
              Tạo mới
            </Button>
          </div>
        )}
        <WarehouseTable
          data={warehouseState.warehouses.get()}
          limit={warehouseState.limit.get()}
          page={warehouseState.page.get()}
          total={warehouseState.total.get()}
          loading={warehouseState.isLoadingGetAllWarehouse.get()}
          handleChangePage={handleOnPageChange}
          handleDeleteWarehouse={handleConfirmDeleteWarehouse}
          handleOpenModalUpdate={handleOpenModalUpdate}
        />
      </Card>
      <ModalControlWarehouse
        isOpen={isOpenModal}
        onCancel={() => setIsOpenModal(false)}
        onSubmit={
          currentWarehouse.current
            ? handleUpdateWarehouse
            : handleCreateWarehouse
        }
        warehouse={currentWarehouse.current}
      />
    </>
  );
};

export default Warehouse;
