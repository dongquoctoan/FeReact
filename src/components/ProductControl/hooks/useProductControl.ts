import {
  Dimension,
  ProductModel,
  ProductVariation,
} from "constants/types/product.type";
import { useFormik } from "formik";
import { isEmpty } from "lodash";
import { useEffect } from "react";
import * as Yup from "yup";

export type ErrorProductControl =
  | {
      images?: string;
      videos?: string;
      name?: string;
      description?: string;
      product_category_id?: string;
      weight?: string;
    }
  | any;

export type ProductControlState = {
  // basic info
  images: Array<string>;
  videos: Array<string>;
  name: string;
  description: string;
  product_category_id: string;
  product_category_path: Array<string>;
  extension?: any;
  // sale info
  variations: Array<ProductVariation>;
  models: Array<ProductModel>;
  weight: number;
  dimension: Dimension;
  parent_sku: string;
};

export type ProductBasicData = {
  images?: Array<string>;
  videos?: Array<string>;
  name?: string;
  description?: string;
  product_category_id?: string;
  product_category_path?: Array<string>;
  isSubmitted?: boolean;
  extension?: any;
  weight?: number;
  dimension?: Dimension;
  parent_sku?: string;
};

const initialValues: ProductControlState = {
  images: [],
  videos: [],
  name: "",
  description: "",
  product_category_id: "",
  product_category_path: [],
  extension: {},
  variations: [],
  models: [
    {
      price: 0,
      inventories: [],
    },
  ],
  weight: 0,
  dimension: {
    width: 0,
    height: 0,
    length: 0,
  },
  parent_sku: "",
};

const formProductControlSchema = Yup.object().shape({
  name: Yup.string().trim().required("Tên sản phẩm không được để trống."),
  description: Yup.string()
    .trim()
    .required("Mô tả sản phẩm không được để trống."),
  product_category_id: Yup.string()
    .trim()
    .required("Danh mục sản phẩm không được để trống."),
  weight: Yup.number().required("Cân nặng không được để trống."),
  images: Yup.array().min(1, "Hình ảnh sản phẩm không được để trống."),
  variations: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().trim().required("Tên phân loại không được để trống."),
      options: Yup.array().of(
        Yup.string().required("Phân loại không được để trống.")
      ),
    })
  ),
});

const handleGenerateModels = (
  prevModels: Array<ProductModel>,
  nextVariations: Array<ProductVariation>
) => {
  if (isEmpty(nextVariations)) {
    return [
      {
        price: 0,
        inventories: [],
      },
    ];
  }

  let nextModels: Array<ProductModel> = [];

  for (const optionOne of nextVariations[0].options) {
    if (
      !nextVariations[1] ||
      (nextVariations[1] && isEmpty(nextVariations[1].options))
    ) {
      const model: ProductModel = {
        name: optionOne,
        sku: "",
        price: 0,
        inventories: [],
      };
      nextModels.push(model);
    } else {
      const models = (nextVariations[1].options || []).map((optionTwo) => {
        const model: ProductModel = {
          name: optionOne + "," + optionTwo,
          sku: "",
          price: 0,
          inventories: [],
        };
        return model;
      });

      nextModels = [...nextModels, ...models];
    }
  }

  for (let i = 0; i < nextModels.length; i++) {
    if (prevModels[i]) {
      const { price, sku, inventories } = prevModels[i];
      nextModels[i] = {
        ...prevModels[i],
        ...nextModels[i],
        sku,
        price,
        inventories,
      };
    }
  }

  return nextModels;
};

const useProductControl = (
  onSubmit: (data: ProductControlState) => void,
  initialState?: ProductControlState
) => {
  const formProductControl = useFormik({
    initialValues: initialValues,
    validationSchema: formProductControlSchema,
    validateOnChange: false,
    onSubmit: (data) => {
      onSubmit(data);
    },
  });

  useEffect(() => {
    if (initialState) {
      formProductControl.setValues(initialState);
    }
  }, [initialState]);

  const handleChangeProductBasic = (basicData: ProductBasicData) => {
    formProductControl.setValues((state) => ({ ...state, ...basicData }));
  };

  //   variations
  const handleAddProductVariation = () => {
    const newVariations = [...formProductControl.values.variations];
    const initVariation: ProductVariation = {
      name: "",
      options: [""],
      images: [],
    };
    newVariations.push(initVariation);
    const newModels = handleGenerateModels(
      [...formProductControl.values.models],
      newVariations
    );

    formProductControl.setValues((state) => ({
      ...state,
      variations: newVariations,
      models: newModels,
    }));
  };

  const handleRemoveProductVariation = (position: number) => {
    const newVariations = [...formProductControl.values.variations];
    newVariations.splice(position, 1);
    const newModels = handleGenerateModels(
      [...formProductControl.values.models],
      newVariations
    );

    formProductControl.setValues((state) => ({
      ...state,
      variations: newVariations,
      models: newModels,
    }));
  };

  const handleChangeProductVariation = (
    variation: ProductVariation,
    position: number
  ) => {
    const newVariations = [...formProductControl.values.variations];
    newVariations.splice(position, 1, variation);

    const newModels = handleGenerateModels(
      [...formProductControl.values.models],
      newVariations
    );

    formProductControl.setValues((state) => ({
      ...state,
      variations: newVariations,
      models: newModels,
    }));
  };

  const handleChangeProductModel = (model: ProductModel, position: number) => {
    const newModels = [...formProductControl.values.models];
    newModels.splice(position, 1, model);
    formProductControl.setValues((state) => ({
      ...state,
      models: newModels,
    }));
  };

  return {
    productControlState: formProductControl.values,
    errors: formProductControl.errors,
    handleChangeProductBasic,
    handleAddProductVariation,
    handleRemoveProductVariation,
    handleChangeProductVariation,
    handleChangeProductModel,
    handleSubmit: formProductControl.submitForm,
  };
};

export default useProductControl;
