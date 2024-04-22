const express = require("express");
const historiesController = require("../controllers/history");
const { auth } = require("../authMiddleware");
const router = express.Router();

// 환자 기록 생성
router.post("/creation", auth, historiesController.postHistory);
/*
  method: post
  path: /history
  req.body: {patientId, diagnosisCode, prognosis}
  return: {
      isSuccess: true,
      message: "환자 기록 생성에 성공하였습니다.",
      token,
    }
    
 */

// 환자 기록 가져오기
router.post("/record", auth, historiesController.getHistory);
/*
  method: post
  path: history/record
  req.body: {patientId}
  return: {
      history,
      isSuccess: true,
      message: "환자 기록 정보 발송",
      token,
    }
 */

module.exports = router;
