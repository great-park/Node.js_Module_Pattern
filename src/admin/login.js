async function login() {
  const form = document.login_form;
  const email = form.email.value;
  const password = form.password.value;
  const chkEmail = checkValidEmail(email);
  const chkPw = checkValidPassword(password);

  if (chkEmail) {
    document.getElementById("alert_email").innerText = "";
    form.email.style.border = "2px solid";
    form.email.style.borderColor = "#00D000";
  } else {
    form.email.style.border = "2px solid";
    form.email.style.borderColor = "#FF0000";
    document.getElementById("alert_email").style.color = "#FF0000";
  }

  if (chkPw) {
    document.getElementById("alert_password").innerText = "";
    form.password.style.border = "2px solid";
    form.password.style.borderColor = "#00D000";
  } else {
    form.password.style.border = "2px solid";
    form.password.style.borderColor = "#FF0000";
    document.getElementById("alert_password").style.color = "#FF0000";
  }

  if (chkEmail && chkPw) {
    console.log("complete. form.submit();");
    const checkSignIn = await fetch("http://localhost:3000/admin/signIn", {
      method: "POST",
      body: JSON.stringify({
        adminId: email,
        adminPassword: password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        console.log(json.url);
        if (json.url != "false") {
          alert("로그인 성공");
          location.href = "/" + json.url;
        } else {
          alert("로그인 실패");
        }
      })
      .catch((error) => console.log(error));
  }
}

function checkValidEmail(email) {
  if (email == "") {
    document.getElementById("alert_email").innerText = "Please enter email.";
    //form.email.focus();
    return false;
  }

  const exptext = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;

  // "ㅁ@ㅁ.ㅁ" 이메일 형식 검사.
  if (exptext.test(email) === false) {
    document.getElementById("alert_email").innerText = "Email is not valid.";
    //form.email.select();
    return false;
  }

  return true;
}

function checkValidPassword(password) {
  if (password == "") {
    document.getElementById("alert_password").innerText =
      "Please enter password.";
    //form.password.focus();
    return false;
  }

  // String.prototype.search() :: 검색된 문자열 중에 첫 번째로 매치되는 것의 인덱스를 반환한다. 찾지 못하면 -1 을 반환한다.
  // number
  const num = password.search(/[0-9]/g);
  // alphabet
  const eng = password.search(/[a-z]/gi);
  // special characters
  const spe = password.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);

  if (password.length < 6) {
    // 최소 6문자.
    document.getElementById("alert_password").innerText =
      "Password must be at least 6 characters.";
    return false;
  } else if (password.search(/\s/) != -1) {
    // 공백 제거.
    document.getElementById("alert_password").innerText =
      "Please enter your password without spaces.";
    return false;
  } else if (num < 0 && eng < 0 && spe < 0) {
    // 한글과 같은 문자열 입력 방지.
    document.getElementById("alert_password").innerText =
      "Password is not valid.";
    return false;
  }

  return true;
}
