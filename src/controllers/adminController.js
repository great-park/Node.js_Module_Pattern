const authorDao = require("../dao/authorDao");
const baseResponse = require("../../config/baseResponseStatus");
const { response, errResponse } = require("../../config/response");
const { pool } = require("../../config/database");
const secret_config = require("../../config/secret");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

// 2. 로그인
exports.signIn = async function (req, res) {
  const { email, password } = req.body;

  // 빈 값 체크
  if (!email) return res.send(response(baseResponse.LOGIN_ID_EMPTY));
  if (!password) return res.send(response(baseResponse.PASSWORD_EMPTY));

  // 1. 비밀번호 확인
  const connection = await pool.getConnection(async (conn) => conn);

  const hashedPassword = await crypto
    .createHash("sha512")
    .update(password)
    .digest("hex");
  const passwordParams = [email, hashedPassword];
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
