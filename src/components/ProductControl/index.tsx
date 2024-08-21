import { Affix, Space } from "antd";
import useProductControl, {
  ProductControlState,
} from "components/ProductControl/hooks/useProductControl";
import styles from "components/ProductControl/ProductControl.module.css";
import ProductBasic from "components/ProductControl/subcomponents/ProductBasic";
import ProductDelivery from "components/ProductControl/subcomponents/ProductDelivery";
import ProductOther from "components/ProductControl/subcomponents/ProductOther";
import ProductSale from "components/ProductControl/subcomponents/ProductSale";
import { FC, memo, ReactNode, useEffect } from "react";
import { fetchWarehouseSelection } from "components/ProductControl/store";

type Props = {
  renderActions: (onSubmit: () => void) => ReactNode;
  onSubmit: (productData: ProductControlState) => void;
  initialProduct?: ProductControlState;
};

const ProductControl: FC<Props> = ({
  renderActions,
  onSubmit,
  initialProduct,
}) => {
  const {
    productControlState,
    errors,
    handleChangeProductBasic,
    handleAddProductVariation,
    handleChangeProductVariation,
    handleRemoveProductVariation,
    handleChangeProductModel,
    handleSubmit,
  } = useProductControl(onSubmit, initialProduct);

  useEffect(() => {
    fetchWarehouseSelection();
  }, []);

  return (
    <div className={styles.wrapper}>
      <Space direction="vertical" style={{ width: "100%" }}>
        <ProductBasic
          images={productControlState.images}
          videos={productControlState.videos}
          name={productControlState.name}
          description={productControlState.description}
          product_category_path={productControlState.product_category_path}
          errors={errors}
          onChange={handleChangeProductBasic}
        />
        <ProductSale
          variations={productControlState.variations}
          models={productControlState.models}
          errors={errors}
          onAddProductVariation={handleAddProductVariation}
          onRemoveProductVariation={handleRemoveProductVariation}
          onChangeProductVariation={handleChangeProductVariation}
          onChangeProductModel={handleChangeProductModel}
        />
        <ProductDelivery
          weight={productControlState.weight}
          dimension={productControlState.dimension}
          errors={errors}
          onChangeProductBasic={handleChangeProductBasic}
        />
        <ProductOther
          parent_sku={productControlState.parent_sku}
          onChangeProductBasic={handleChangeProductBasic}
        />
        <Affix offsetBottom={0}>
          <div className={styles.action}>{renderActions(handleSubmit)}</div>
        </Affix>
      </Space>
    </div>
  );
};

export default memo(ProductControl);
