import { EditOutlined } from "@ant-design/icons";
import { State, useHookstate } from "@hookstate/core";
import { Button, Card, Col, Popover, Row, Space, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import InputNumber from "components/InputNumber";
import productControlStore from "components/ProductControl/store";
import styles from "components/ProductControl/subcomponents/ProductSale/subcomponents/SettingInventory/SettingInventory.module.css";
import { Option } from "constants/types/common.type";
import { ProductInventory, ProductModel } from "constants/types/product.type";
import { FC, useEffect, useState } from "react";

type Props = {
  onChangeProductModel: (model: ProductModel, position: number) => void;
  model: ProductModel;
  modelPosition: number;
};

const SettingInventory: FC<Props> = ({
  onChangeProductModel,
  model,
  modelPosition,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const inventoriesState = useHookstate<Array<ProductInventory>>([]);

  // start init inventories
  const productControlState = useHookstate(productControlStore);

  const initInventories = () => {
    const warehouseSelection: Array<Option> = JSON.parse(
      JSON.stringify(productControlState.warehouseSelection.value)
    );
    const inventories = warehouseSelection.map((option) => ({
      warehouse_id: option.value,
      quantity: 0,
      warehouse: {
        name: option.label,
      },
    }));

    const newModel = {
      ...model,
      inventories,
    };

    onChangeProductModel(newModel, modelPosition);
  };

  useEffect(() => {
    if (!model.inventories.length) {
      initInventories();
    }
  }, [productControlState.warehouseSelection, model]);
  // end init inventories

  useEffect(() => {
    const inventories = JSON.parse(JSON.stringify(model.inventories));

    inventoriesState.set(inventories);
  }, [model, isOpen]);

  const changeQuantityInventory = (
    inventoryState: State<ProductInventory>,
    value: string
  ) => {
    inventoryState.quantity.set(Number(value));
  };

  const confirmChangeInventories = () => {
    const inventories = JSON.parse(JSON.stringify(inventoriesState.value));

    const newModel = {
      ...model,
      inventories,
    };

    onChangeProductModel(newModel, modelPosition);
    setIsOpen(false);
  };

  const columns: ColumnsType<any> = [
    {
      title: "Tên kho hàng",
      render: (inventoryState: State<ProductInventory>) => (
        <span>{inventoryState.warehouse.get()?.name}</span>
      ),
    },
    {
      title: "Kho hàng",
      render: (inventoryState: State<ProductInventory>) => (
        <InputNumber
          value={inventoryState.quantity.get().toString()}
          onChange={(value) => changeQuantityInventory(inventoryState, value)}
        />
      ),
      width: "50%",
    },
  ];

  const totalCalculated = inventoriesState.get().reduce((sum, inventory) => {
    return (sum = sum + inventory.quantity);
  }, 0);

  const totalConfirm = model.inventories.reduce((sum, inventory) => {
    return (sum = sum + inventory.quantity);
  }, 0);

  return (
    <Popover
      visible={isOpen}
      onVisibleChange={setIsOpen}
      content={
        <>
          <div className={styles.tableWrapper}>
            <Table
              columns={columns}
              dataSource={inventoriesState}
              bordered
              size="small"
              pagination={false}
              expandable={{
                showExpandColumn: false,
              }}
              rowKey={(item) => item.warehouse_id}
            />
          </div>
          <Card size="small">
            <Row justify="space-between">
              <Col span={8}>
                <span>Tổng số lượng tồn kho: {totalCalculated}</span>
              </Col>
              <Col span={16}>
                <Space className={styles.buttonGroup}>
                  <Button onClick={() => setIsOpen(false)}>Hủy</Button>
                  <Button type="primary" onClick={confirmChangeInventories}>
                    Xác nhận
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>
        </>
      }
      trigger="click"
      title="Thiết lập tồn kho cho các kho"
    >
      <span>{totalConfirm}</span>
      <Button type="link" size="small" icon={<EditOutlined />} />
    </Popover>
  );
};

export default SettingInventory;
