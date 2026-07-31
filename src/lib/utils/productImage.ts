import { ProductCollection } from "../enums/product.enum";
import { serverApi } from "../config";

/**
 * Backend har bir productCollection uchun alohida papkaga rasm saqlaydi:
 * uploads/products/{coffee|desserts|bread|drinks}/...
 * Eski (papka tizimidan oldingi) mahsulotlarda saqlangan yo'l bu andozaga
 * mos kelmasligi mumkin bo'lgani uchun, biz faqat fayl nomini olib,
 * papkani productCollection asosida qayta quramiz — bu har doim ishonchli.
 */
const PRODUCT_FOLDER_MAP: Record<string, string> = {
  [ProductCollection.DRINK]: "coffee",
  [ProductCollection.DESSERT]: "desserts",
  [ProductCollection.OTHER]: "bread",
  [ProductCollection.SALAD]: "drinks",
  [ProductCollection.DISH]: "coffee",
};

export const getProductImageUrl = (
  productCollection: ProductCollection,
  imagePath: string,
): string => {
  const folder = PRODUCT_FOLDER_MAP[productCollection] ?? "coffee";
  const filename = imagePath.split("/").pop();
  return `${serverApi}/uploads/products/${folder}/${filename}`;
};
