module.exports = function (app) {
  const review = require("../controllers/reviewController");
  const jwtMiddleware = require("../../config/jwtMiddleware");

  // 1. 리뷰 등록
  app.post("/reviews/:shopId/:authorId", jwtMiddleware, review.postReview);
};
