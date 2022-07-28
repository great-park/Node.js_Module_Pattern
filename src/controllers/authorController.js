const authorDao = require("../dao/authorDao");
const baseResponse = require("../../config/baseResponseStatus");
const { response, errResponse } = require("../../config/response");
const { pool } = require("../../config/database");
const secret_config = require("../../config/secret");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
// 1. 회원가입
exports.postAuthor = async function (req, res) {
  /**
   * Body: loginId, password, authorName, phoneNumber
   */
  const { loginId, password, authorName, phoneNumber } = req.body;

  // 필수 값 : 빈 값 체크
  if (!loginId) return res.send(response(baseResponse.LOGIN_ID_EMPTY));
  if (!password) return res.send(response(baseResponse.PASSWORD_EMPTY));
  if (!authorName) return res.send(response(baseResponse.AUTHOR_NAME_EMPTY));
  if (!phoneNumber) return res.send(response(baseResponse.PHONE_NUMBER_EMPTY));

  // 비밀번호 암호화
  const hashedPassword = await crypto
    .createHash("sha512")
    .update(password)
    .digest("hex");

  //request의 body 값들에 대해서 철저한 검증 진행해야됨. 여기선 빈 값 체크만 수행
  const postAuthorParams = [loginId, hashedPassword, authorName, phoneNumber];

  const connection = await pool.getConnection(async (conn) => conn);
  const postAuthor = await authorDao.postAuthor(connection, postAuthorParams);
  connection.release();

  return res.send(response(baseResponse.SUCCESS));
};

// 2. 로그인
exports.signIn = async function (req, res) {
  const { loginId, password } = req.body;

  // 빈 값 체크
  if (!loginId) return res.send(response(baseResponse.LOGIN_ID_EMPTY));
  if (!password) return res.send(response(baseResponse.PASSWORD_EMPTY));

  // 1. 비밀번호 확인
  const connection = await pool.getConnection(async (conn) => conn);

  const hashedPassword = await crypto
    .createHash("sha512")
    .update(password)
    .digest("hex");
  const passwordParams = [loginId, hashedPassword];
  const passwordRows = await authorDao.passwordCheck(
    connection,
    passwordParams
  );

  if (passwordRows[0].password !== hashedPassword) {
    return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
  }

  // 2. authorId 가져오기
  const authorInfoRows = await authorDao.getId(connection, loginId);
  connection.release();

  //토큰 생성
  let token = await jwt.sign(
    {
      authorId: authorInfoRows[0].authorId,
    },
    secret_config.jwtsecret,
    {
      expiresIn: "365d",
      subject: "User",
    }
  );

  const result = response(baseResponse.SUCCESS, {
    jwt: token,
    authodId: authorInfoRows[0].authorId,
  });

  return res.send(result);
};
