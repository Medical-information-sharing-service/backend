const express = require("express");
const usersController = require("../controllers/user");
const { auth } = require("../authMiddleware");

const router = express.Router();

// 회원가입
router.post("/join", usersController.postJoin);
/*
  method: post
  path: user/join
  req.body: {doctorName, password, licenseNumber, medicalInstitution}
  return: {isSuccess: true, message: "회원가입에 성공하였습니다."}

 */

// 로그인
router.post("/login", usersController.postLogin);
/*
  method: post
  path: user/login
  req.body: {licenseNumber, password}
  return: {
        message: "로그인에 성공하였습니다.",
        isSuccess: true,
        token,
      }
 */

// 로그아웃
router.get("/logout", auth, usersController.getLogout);
/*
  method: get
  path: user/logout
  return:{
    isSuccess: true,
    message: "로그아웃에 성공하였습니다.",
    }
 */

// 환자 개인 정보 가져오기
router.post("/patient/info", auth, usersController.getPatient);

// 환자에게 기록 열람 동의 요청
router.post("/agree", auth, usersController.postAgree);

/*
  method: post
  path: user/patient/info
  req.body: {patientId}
  return: {
      info,
      isSuccess: true,
      message: "프로필 정보 가져오기에 성공하였습니다.",
      token,
    }
 */

// 환자 정보 등록
// router.post("/patient", auth, usersController.postPatient);
/*
  method: post
  path: user/patient
  req.body: {patientId, name, gender, address}
  return: {
      isSuccess: true,
      message: "환자 정보 생성에 성공하였습니다.",
      token,
    }
 */
/* 
// 유저 확인
router.patch("/profile", auth, usersController.patchProfile);
*/
module.exports = router;
