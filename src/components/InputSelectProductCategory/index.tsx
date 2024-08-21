import { CloseCircleFilled } from "@ant-design/icons";
import { Input, InputProps } from "antd";
import ModalSelectProductCategory from "components/ModalSelectProductCategory";
import { RootState } from "configs/configureStore";
import { ProductCategoryOption } from "constants/types/common.type";
import { isEmpty } from "lodash";
import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";

type Props = Omit<InputProps, "onChange"> & {
  categoryIds: Array<string>;
  onChange: (categoryIds: Array<string>) => void;
};

const InputSelectProductCategory: FC<Props> = ({
  categoryIds,
  onChange,
  ...props
}) => {
  const [visibleSelectProductCategory, setVisibleSelectProductCategory] =
    useState<boolean>(false);
  const [categoriesSelected, setCategoriesSelected] = useState<
    Array<ProductCategoryOption>
  >([]);

  const { productCategoriesSelection } = useSelector(
    (state: RootState) => state.appSlice
  );

  const handleOpenSelectProductCategory = () => {
    setVisibleSelectProductCategory(true);
  };
  const handleCloseSelectProductCategory = () => {
    setVisibleSelectProductCategory(false);
  };

  const handleConfirmCategoriesSelected = (
    categories: Array<ProductCategoryOption>
  ) => {
    setCategoriesSelected(categories);
    onChange(categories.map((category) => category.value));
  };

  useEffect(() => {
    handleGetCategoriesSelected();
  }, [categoryIds]);

  const handleGetCategoriesSelected = async () => {
    if (!isEmpty(categoryIds)) {
      const categories = productCategoriesSelection.filter((category) =>
        categoryIds.includes(category.value)
      );
      setCategoriesSelected(categories);
    } else {
      setCategoriesSelected([]);
    }
  };

  const handleClearSelected = () => {
    setCategoriesSelected([]);
    onChange([]);
  };

  return (
    <>
      <ModalSelectProductCategory
        visible={visibleSelectProductCategory}
        onCancel={handleCloseSelectProductCategory}
        onComfirm={handleConfirmCategoriesSelected}
      />
      <Input
        {...props}
        readOnly
        onClick={handleOpenSelectProductCategory}
        value={categoriesSelected.map((category) => category.label).join(" > ")}
        suffix={
          !isEmpty(categoriesSelected) && (
            <CloseCircleFilled
              style={{ color: "rgba(0, 0, 0, 0.25)" }}
              onClick={handleClearSelected}
            />
          )
        }
      />
    </>
  );
};

export default InputSelectProductCategory;
