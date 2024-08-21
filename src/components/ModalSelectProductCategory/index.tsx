import { RightOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { RootState } from "configs/configureStore";
import { ProductCategoryOption } from "constants/types/common.type";
import { isEmpty } from "lodash";
import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "components/ModalSelectProductCategory/ModalSelectProductCategory.module.css";

type Props = {
  visible: boolean;
  onCancel: () => void;
  onComfirm: (categories: Array<ProductCategoryOption>) => void;
};

const ModalSelectProductCategory: FC<Props> = ({
  onComfirm,
  onCancel,
  visible,
}) => {
  const [categoriesSelector, setCategoriesSelector] = useState<
    Array<Array<ProductCategoryOption>>
  >([[], [], []]);

  const [categoriesSelected, setCategoriesSelected] = useState<
    Array<ProductCategoryOption>
  >([]);

  const { productCategoriesSelection } = useSelector(
    (state: RootState) => state.appSlice
  );

  useEffect(() => {
    handleGetProductCategories(0);
  }, [productCategoriesSelection]);

  const handleGetProductCategories = (
    position: number,
    parentCategoryId?: string
  ) => {
    // find in local
    const categories = productCategoriesSelection.filter(
      (category) => category.parent_category_id == parentCategoryId
    );
    const newCategoriesSelector = [...categoriesSelector];
    newCategoriesSelector.splice(position, 1, categories);
    setCategoriesSelector(newCategoriesSelector);
    // eslint-disable-next-line no-empty
  };

  const handleSelectCategory = (
    category: ProductCategoryOption,
    position: number
  ) => {
    handleGetProductCategories(position + 1, category.value);
    const newCategoriesSelected = [...categoriesSelected];
    newCategoriesSelected.splice(position, newCategoriesSelected.length);
    newCategoriesSelected.push(category);
    setCategoriesSelected(newCategoriesSelected);
  };

  const handleConfirmCategoriesSelected = () => {
    onComfirm(categoriesSelected);
    onCancel();
  };

  useEffect(() => {
    if (!visible) {
      setCategoriesSelected([]);
    }
  }, [visible]);

  return (
    <div className={styles.wrapper}>
      <Modal
        visible={visible}
        bodyStyle={{ backgroundColor: "#FAFAFA" }}
        closable={false}
        width={950}
        okText="Xác nhận"
        title="Chọn danh mục"
        onOk={handleConfirmCategoriesSelected}
        onCancel={onCancel}
        zIndex={99999}
      >
        <div className={styles.tree}>
          {categoriesSelector.map((categories, index: number) => (
            <div key={index} className={styles.list}>
              {categories.map((category) => {
                const classes = [styles.item];
                categoriesSelected
                  .map((category) => category.value)
                  .includes(category.value) && classes.push(styles.selected);
                return (
                  <div
                    key={category.value}
                    className={classes.join(" ")}
                    onClick={() => handleSelectCategory(category, index)}
                  >
                    {category.label}
                    {category.has_children && <RightOutlined />}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div>
          Đã chọn:&nbsp;
          {isEmpty(categoriesSelected) ? (
            "Chưa chọn danh mục"
          ) : (
            <span className={styles.selected}>
              {categoriesSelected.map((category) => category.label).join(" > ")}
            </span>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ModalSelectProductCategory;
