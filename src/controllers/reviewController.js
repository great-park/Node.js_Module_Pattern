const reviewDao = require("../dao/reviewDao");
const baseResponse = require("../../config/baseResponseStatus");
const { response, errResponse } = require("../../config/response");
const { pool } = require("../../config/database");

// 1. 리뷰 등록
exports.postReview = async function (req, res) {
  // Body: reviewContent , Path : shopId, authorId
  const { reviewContent } = req.body;
  const shopId = req.params.shopId;
  const authorId = req.params.authorId;

  //request의 body 값들에 대해서 철저한 검증 진행해야됨. 여기선 빈 값 체크만 수행
  if (!reviewContent)
    return res.send(response(baseResponse.REVIEW_CONTENT_EMPTY));

  const connection = await pool.getConnection(async (conn) => conn);
  const postReview = await reviewDao.postReview(
    connection,
    authorId,
    reviewContent
  );

  const reviewId = postReview.insertId;
  const Review = await reviewDao.Review(connection, shopId, reviewId);
  connection.release();

  return res.send(response(baseResponse.SUCCESS));
};
