module.exports = function (app) {
  const shop = require("../controllers/shopController");
  const jwtMiddleware = require("../../config/jwtMiddleware");

  // 1. 가게 전체 조회
  app.get("/shops", shop.getAllShop);

  // 2. 특정 가게 조회
  app.get("/shops/:shopId", shop.getShop);

  // 3. 가게 등록
  app.post("/shops", jwtMiddleware, shop.postShop);

  // 4. 가게의 키워드 등록
  app.post("/shops/:shopId/keywords", jwtMiddleware, shop.postKeyword);

  // 5. 키워드로 가게 검색
  app.get("/shops/keyword/:keywordContent", shop.getShopWithKeyword);
};
