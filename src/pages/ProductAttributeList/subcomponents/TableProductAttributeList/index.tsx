import { Button, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import Status from "components/Status";
import {
  ProductAttribute,
  ProductAttributeValue,
} from "constants/types/productAttribute.type";
import { FC, useMemo } from "react";

type Props = {
  productAttributes: Array<ProductAttribute>;
  loading: boolean;
  total: number;
  pageSize: number;
  current: number;
  onSelect: (productAttributeSelected: ProductAttribute) => void;
  onChangePage: (page: number, pageSize: number) => void;
  onDelete: (id: string) => void;
};

const TableProductAttributeList: FC<Props> = ({
  productAttributes,
  loading,
  total,
  pageSize,
  current,
  onSelect,
  onChangePage,
  onDelete,
}) => {
  const columns: ColumnsType<any> = useMemo(
    () => [
      {
        title: "Tên thuộc tính",
        dataIndex: "name",
        width: 300,
      },
      {
        title: "Giá trị",
        dataIndex: "values",
        render: (values: Array<ProductAttributeValue>) => (
          <>
            <>{values[0].value}</>
            {values.map(
              (productAttribute: ProductAttributeValue, index: number) => (
                <>
                  {index > 7 || index === 0 ? null : (
                    <>,&nbsp;{productAttribute.value}</>
                  )}
                </>
              )
            )}
            <span>{values.length > 7 && ",..."}</span>
          </>
        ),
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        width: 200,
        render: (status) => <Status status={status} />,
      },
      {
        title: "Thao tác",
        width: 150,
        render: (_, record) => {
          return (
            record.status != "deleted" && (
              <>
                <div>
                  <Button
                    type="link"
                    size="small"
                    onClick={() => onSelect(record)}
                  >
                    Sửa
                  </Button>
                </div>
                <div>
                  <Button
                    type="link"
                    size="small"
                    danger
                    onClick={() => onDelete(record._id)}
                  >
                    Xóa
                  </Button>
                </div>
              </>
            )
          );
        },
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
        dataSource={productAttributes}
        pagination={{
          size: "default",
          total,
          pageSize,
          current,
          hideOnSinglePage: true,
          onChange: onChangePage,
        }}
        loading={loading}
      />
    </div>
  );
};

export default TableProductAttributeList;
