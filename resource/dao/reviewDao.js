module.exports = {
  postReview,
  Review,
};

// 1. 리뷰 등록
async function postReview(connection, authodId, reviewContent) {
  const Query1 = `
  Insert into Review(authorId, reviewContent) VALUES (?,?);
                  `;
  const [Rows] = await connection.query(Query1, [authodId, reviewContent]);
  return Rows;
}
async function Review(connection, shopId, reviewId) {
  const Query1 = `
  INSERT INTO ReviewOfShop(shopId, reviewId) VALUES (?,?);
                    `;
  const [Rows] = await connection.query(Query1, [shopId, reviewId]);
  return Rows;
}
