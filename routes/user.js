const express = require("express");
const usersController = require("../controllers/user");
const { auth } = require("../authMiddleware");

const router = express.Router();

// 회원가입
router.post("/join", usersController.postJoin);

// 로그인
router.post("/login", usersController.postLogin);

// 로그아웃
router.post("/logout", auth, usersController.postLogout);

// 환자 정보 등록
router.post("/patient", auth, usersController.postPatient);

// 환자 정보 가져오기
router.post("/patient/info", auth, usersController.getPatient);

// 환자 기록 생성
router.post("/history", auth, usersController.postHistory);

// 환자 기록 가져오기
router.post("/history/info", auth, usersController.getHistory);

/* 
// 유저 확인
// router.get("/usersall", usersController.findAllUser);
router.patch("/profile", auth, usersController.patchProfile);
*/
module.exports = router;
