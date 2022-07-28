const shopDao = require("../dao/shopDao");
const baseResponse = require("../../config/baseResponseStatus");
const { response, errResponse } = require("../../config/response");
const { pool } = require("../../config/database");
const schedule = require("node-schedule");

// 1. 전체 가게 조회
exports.getAllShop = async function (req, res) {
  const connection = await pool.getConnection(async (conn) => conn);
  const getAllShopResult = await shopDao.getAllShop(connection);
  connection.release();

  return res.send(response(baseResponse.SUCCESS, getAllShopResult));
};

// 2. 특정 가게 조회
exports.getShop = async function (req, res) {
  //path : shopId
  const shopId = req.params.shopId;

  const connection = await pool.getConnection(async (conn) => conn);
  const getAllShopResult = await shopDao.getShop(connection, shopId);
  connection.release();

  return res.send(response(baseResponse.SUCCESS, getAllShopResult));
};

// 3. 가게 등록
exports.postShop = async function (req, res) {
  /**
   * Body: shopType, location, shopLongitude, shopLatitude, shopDescription
   */
  const {
    shopType,
    location,
    shopLongitude,
    shopLatitude,
    shopDescription,
    date,
  } = req.body;

  // 필수 값 : 빈 값 체크
  if (!shopType) return res.send(response(baseResponse.SHOP_TYPE_EMPTY));
  if (!location) return res.send(response(baseResponse.LOCATION_EMPTY));
  if (!shopLongitude) return res.send(response(baseResponse.LONGITUDE_EMPTY));
  if (!shopLatitude) return res.send(response(baseResponse.LATITUDE_EMPTY));
  if (!shopDescription)
    return res.send(response(baseResponse.DESCRIPTION_EMPTY));

  //request의 body 값들에 대해서 철저한 검증 진행해야됨. 여기선 빈 값 체크만 수행
  const postShopParams = [
    shopType,
    location,
    shopLongitude,
    shopLatitude,
    shopDescription,
  ];

  const connection = await pool.getConnection(async (conn) => conn);
  const postShopResponse = await shopDao.postShop(connection, postShopParams);
  connection.release();

  const KSTDate = new Date(date);
  console.log("KST : ", KSTDate);
  const UTCDate = new Date(KSTDate + 9 * 60 * 60 * 1000);
  console.log("UTC : ", UTCDate);

  const timeCheck = schedule.scheduleJob("* * * * *", () => {
    const x = new Date(Date.now());
    console.log(x);
  });

  let cnt = 0;

  const job = schedule.scheduleJob(UTCDate, () => {
    console.log(location);

    console.log("else");
  });

  return res.send(response(baseResponse.SUCCESS));
};

// 4. 키워드 등록
exports.postKeyword = async function (req, res) {
  //Body: keywordContent , Path: shopId
  const { keywordContent } = req.body;
  const shopId = req.params.shopId;

  //request의 body 값들에 대해서 철저한 검증 진행해야됨. 여기선 빈 값 체크만 수행
  if (!keywordContent)
    return res.send(response(baseResponse.KEYWORD_CONTENT_EMPTY));

  const postKeywordParams = [shopId, keywordContent];

  const connection = await pool.getConnection(async (conn) => conn);
  const postKeywordResponse = await shopDao.postKeyword(
    connection,
    postKeywordParams
  );
  connection.release();
  return res.send(response(baseResponse.SUCCESS));
};

// 5. 키워드로 검색
exports.getShopWithKeyword = async function (req, res) {
  // query : keywordContent
  const keywordContent = req.params.keywordContent;
  if (!keywordContent) {
    return res.send(response(baseResponse.KEYWORD_CONTENT_EMPTY));
  }

  const connection = await pool.getConnection(async (conn) => conn);
  const getShopWithKeyword = await shopDao.getShopWithKeyword(
    connection,
    keywordContent
  );
  connection.release();

  return res.send(response(baseResponse.SUCCESS, getShopWithKeyword));
};
