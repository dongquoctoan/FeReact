import { Card } from "antd";
import CardTitle from "components/CardTitle";
import { ErrorProductControl } from "components/ProductControl/hooks/useProductControl";
import FormAdvanced from "components/ProductControl/subcomponents/ProductSale/subcomponents/FormAdvanced";
import FormBasic from "components/ProductControl/subcomponents/ProductSale/subcomponents/FormBasic";
import { ProductModel, ProductVariation } from "constants/types/product.type";
import { isEmpty } from "lodash";
import React, { FC } from "react";

type Props = {
  variations: Array<ProductVariation>;
  models: Array<ProductModel>;
  errors: ErrorProductControl;
  onAddProductVariation: () => void;
  onRemoveProductVariation: (position: number) => void;
  onChangeProductVariation: (
    variation: ProductVariation,
    position: number
  ) => void;
  onChangeProductModel: (model: ProductModel, position: number) => void;
};
const ProductSale: FC<Props> = ({
  variations,
  models,
  onAddProductVariation,
  onRemoveProductVariation,
  onChangeProductVariation,
  onChangeProductModel,
  errors,
}) => {
  return (
    <Card>
      <CardTitle title="Thông tin bán hàng" />
      {isEmpty(variations) ? (
        <FormBasic
          models={models}
          onAddProductVariation={onAddProductVariation}
          onChangeProductModel={onChangeProductModel}
          errors={errors}
        />
      ) : (
        <FormAdvanced
          variations={variations}
          models={models}
          errors={errors}
          onAddProductVariation={onAddProductVariation}
          onRemoveProductVariation={onRemoveProductVariation}
          onChangeProductVariation={onChangeProductVariation}
          onChangeProductModel={onChangeProductModel}
        />
      )}
    </Card>
  );
};

export default React.memo(ProductSale);
