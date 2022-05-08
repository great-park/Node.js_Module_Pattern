module.exports = {
  postAuthor,
  passwordCheck,
  getId,
};

// 1. 회원 가입
async function postAuthor(connection, postShopParams) {
  const Query = `
  INSERT INTO Author(loginId, password, authorName, phoneNumber) VALUES (?,?,?,?);
                      `;
  const [Rows] = await connection.query(Query, postShopParams);
  return Rows;
}

// 2. 비밀번호 확인
async function passwordCheck(connection, passwordParams) {
  const Query = `
    select authorId, password from Author where loginId = ? and password = ?;
                        `;
  const [Rows] = await connection.query(Query, passwordParams);
  return Rows;
}

// 3. id 가져오기
async function getId(connection, loginId) {
  const Query = `
      select authorId from Author where loginId = ?;
                          `;
  const [Rows] = await connection.query(Query, loginId);
  return Rows;
}
