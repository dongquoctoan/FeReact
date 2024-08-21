import { ProductModel } from "constants/types/product.type";
export const productUtils = {
  getPrices: (models: Array<ProductModel>) => {
    const currentPrices = [];
    const oldPrices = [];

    for (const model of models) {
      if (model.promotion_price) {
        currentPrices.push(model.promotion_price);
        oldPrices.push(model.price);
      } else {
        currentPrices.push(model.price);
      }
    }

    // current prices
    const minCurrentPrice = Math.min(...currentPrices);
    const maxCurrentPrice = Math.max(...currentPrices);

    let currentPricesResult = [minCurrentPrice, maxCurrentPrice];

    if (minCurrentPrice == maxCurrentPrice) {
      currentPricesResult = [minCurrentPrice];
    }

    // old prices
    const minOldPrice = Math.min(...oldPrices);
    const maxOldPrice = Math.max(...oldPrices);

    let oldPriceResult: Array<number> = [];

    if (oldPrices.length > 0) {
      oldPriceResult = [minOldPrice, maxOldPrice];
      if (minOldPrice == maxOldPrice) {
        oldPriceResult = [minOldPrice];
      }
    }

    return {
      currentPrices: currentPricesResult,
      oldPrices: oldPriceResult,
    };
  },
  getOriginalPrice: (models: Array<ProductModel>) => {
    const prices = models.map((model) => model.price);

    const minPrice = Math.min(...prices);
    const maxPrice = Math.min(...prices);

    if (minPrice == maxPrice) {
      return [minPrice];
    }

    return [minPrice, maxPrice];
  },
  getTotalStock: (models: Array<ProductModel>) => {
    return models.reduce((total: number, model: ProductModel) => {
      const totalQuantity = model.inventories.reduce(
        (quantity: number, inventory) => {
          return (quantity = quantity + inventory.quantity);
        },
        0
      );

      return (total = total + totalQuantity);
    }, 0);
  },
  getMaxDiscountPercent: (models: Array<ProductModel>) => {
    const discountPercents = models.map((model) =>
      Math.round(((model.promotion_price || 0) / model.price) * 100)
    );

    return Math.max(...discountPercents);
  },
  getMinimunPrice: (productModels: Array<ProductModel>) => {
    const priceList = productModels.map((model) =>
      model.promotion_price ? model.promotion_price : model.price
    );
    return Math.min(...priceList);
  },
};

export default productUtils;
