const validationRules = {
  userid: /^[A-Za-z0-9]+$/, // 영어와 숫자
  userpw: /^[A-Za-z0-9]+$/, // /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, // 영어, 숫자, 특수문자
  username: /^[가-힣]+$/, // 한글
  rrnfront: /^[0-9]+$/, // 숫자
  rrnback: /^[0-9]+$/, // 숫자
  phone: /^[0-9]+$/, // 숫자
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // 이메일 형식
};

const validateInput = (username, value, formData) => {
  const errors = {
    userid: "",
    userpw: "",
    passwordConfirm: "",
    username: "",
    rrnfront: "",
    rrnback: "",
    email: "",
    phone: "",
  };

  switch (username) {
    case "userid":
      if (!validationRules.userid.test(value))
        errors.userid = "영어와 숫자만 입력하세요.";
      break;
    case "userpw":
      if (!validationRules.userpw.test(value))
        errors.userpw = "영어, 숫자, 특수문자를 포함하세요.";
      break;
    case "passwordConfirm":
      if (value && formData.userpw && value !== formData.userpw) {
        errors.passwordConfirm = "비밀번호가 일치하지 않습니다";
      } else if (value && formData.userpw && value === formData.userpw) {
        errors.passwordConfirm = "비밀번호가 일치합니다";
      }
      break;
    case "username":
      // 여기에 입력 값이 가-힣 또는 ㄱ-ㅣ일때를 전부 제외시킴.
      // 실제 회원가입 버튼 클릭 시 유효성 검사 자체에서는 가-힣 데이터가 아니면 통과되지 않음.
      if (value && !/^[가-힣\u3131-\u3163]*$/.test(value))
        errors.username = "한글만 입력하세요.";
      break;
    case "rrnfront":
      if (!validationRules.rrnfront.test(value) || value.length > 6)
        errors.rrnfront = "숫자 6자리 이하로 입력하세요.";
      break;
    case "rrnback":
      if (!validationRules.rrnback.test(value) || value.length > 7)
        errors.rrnback = "숫자 7자리 이하로 입력하세요.";
      break;
    case "phone":
      if (!validationRules.phone.test(value) || value.length !== 11)
        errors.phone = "숫자 11자리로 입력하세요.";
      break;
    case "email":
      if (value && !validationRules.email.test(value))
        errors.email = "유효한 이메일 형식이 아닙니다.";
      break;
  }

  return errors;
};

const validateFormData = (formData) => {
  const errors = {
    userid: "",
    userpw: "",
    passwordConfirm: "",
    username: "",
    rrnfront: "",
    rrnback: "",
    email: "",
    phone: "",
  };

  // 아이디
  if (!/^[A-Za-z0-9]{5,20}$/.test(formData.userid))
    errors.id = "영어와 숫자만 사용하여 5~20자 입력하세요.";

  // 비밀번호
  if (
    !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(
      formData.userpw
    )
  )
    errors.userpw = "영어, 숫자, 특수문자를 포함한 8~20자여야 합니다.";

  // 비밀번호 확인
  if (formData.userpw !== formData.passwordConfirm)
    errors.passwordConfirm = "비밀번호가 일치하지 않습니다.";

  // 이름
  if (!/^[가-힣]{2,10}$/.test(formData.username))
    errors.username = "한글로 2~10자 입력하세요.";

  // 이메일
  if (formData.email && !validationRules.email.test(formData.email))
    errors.email = "유효한 이메일 형식이 아닙니다.";

  // 전화번호
  if (formData.phone && formData.phone.length !== 11)
    errors.phone = "숫자 11자리로 입력하세요.";

  return errors;
};

export { validateInput, validateFormData };
