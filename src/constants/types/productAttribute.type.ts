export type GetProductAttributeListParams = {
  page?: number;
  limit?: number;
  name?: string;
  product_category_id?: string;
};

export type ProductAttributeValue = {
  _id?: string;
  value: string;
  product_attribute_id?: string;
};

export type ProductAttribute = {
  _id: string;
  name: string;
  product_category_id: string;
  values: Array<ProductAttributeValue>;
  status: string;
};

export type CreateProductAttributeData = {
  name: string;
  product_category_id: string;
  values: Array<string>;
};

export type EditProductAttributeData = {
  _id: string;
  name: string;
  product_category_id: string;
  values: Array<{ value: string }>;
};
