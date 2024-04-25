const express = require("express");
const patientsController = require("../controllers/patient");
const { auth } = require("../authMiddleware");

const router = express.Router();

// 회원가입
router.post("/join", patientsController.postJoin);
/*
  method: post
  path: patient/join
  req.body: {patientId,
      name,
      gender,
      address,
      residentNumber,
      password,
      doctorList}
  return: {isSuccess: true, message: "회원가입에 성공하였습니다."}

 */

// 로그인
router.post("/login", patientsController.postLogin);
/*
  method: post
  path: patient/login
  req.body: {patientId, password}
  return: {
        message: "로그인에 성공하였습니다.",
        isSuccess: true,
        token,
      }
 */

// 정보 제공 여부 응답
router.post("/agree", auth, patientsController.postAgree);

// 동의 요청 리스트
router.get("/agree", auth, patientsController.getAgreeList);
module.exports = router;
