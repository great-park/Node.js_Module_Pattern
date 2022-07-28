module.exports = {
  getAllShop,
  getShop,
  postShop,
  postKeyword,
  getShopWithKeyword,
};

// 1. 가게 전체 조회
async function getAllShop(connection) {
  const Query1 = `
    select * from Shop
                `;
  const row1 = await connection.query(Query1);
  const result = {
    shopInfo: row1[0],
  };
  return result;
}

// 2. 특정 가게 조회
async function getShop(connection, shopId) {
  const Query1 = `
      select * from Shop where shopId = ?
                  `;
  const Query2 = `
    select S.shopId ,A.authorId,authorName,reviewContent from Review
        inner join ReviewOfShop ROS on Review.reviewId = ROS.reviewId
        inner join Shop S on ROS.shopId = S.shopId
        inner join Author A on Review.authorId = A.authorId
        where ROS.shopId = ?;
                `;
  const row1 = await connection.query(Query1, shopId);
  const row2 = await connection.query(Query2, shopId);
  const result = {
    shopInfo: row1[0],
    review: row2[0],
  };
  return result;
}

// 3. 가게 등록
async function postShop(connection, postShopParams) {
  const Query = `
  INSERT INTO Shop(shopType,location,shopLongitude,shopLatitude,shopDescription) values(?,?,?,?,?);
                    `;
  const [Rows] = await connection.query(Query, postShopParams);
  return Rows;
}

// 4. 키워드 등록
async function postKeyword(connection, postKeywordParams) {
  const Query = `
    INSERT INTO Keyword(shopId, keywordContent) values(?,?);
                      `;
  const [Rows] = await connection.query(Query, postKeywordParams);
  return Rows;
}

// 5. 키워드로 가게 조회
async function getShopWithKeyword(connection, keywordContent) {
  const Query = `
    select distinct S.shopId, shopType, location, shopDescription, keywordContent from Shop S
    inner join Keyword K on S.shopId = K.shopId
    where INSTR(keywordContent, ?) > 0;
                    `;
  const [Rows] = await connection.query(Query, keywordContent);
  return Rows;
}
