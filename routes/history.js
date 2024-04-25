const express = require("express");
const historiesController = require("../controllers/history");
const { auth } = require("../authMiddleware");
const router = express.Router();

//////의사///////

// 환자 기록 생성
router.post("/creation", auth, historiesController.postHistory);

// 의사가 환자의 모든 기록 가져오기
router.get("/doctor/records", auth, historiesController.getAllHistory);

//////환자///////

// 환자가 history 개별 id를 통해 기록 가져오기
router.post("/patient/record", auth, historiesController.getHistory);

// 환자가 history 모든 기록 가져오기
router.get("/patient/records", auth, historiesController.getHistoryList);

module.exports = router;
