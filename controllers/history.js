const Patient = require("../models/patient.js");
const Doctor = require("../models/doctor.js");
const History = require("../models/history.js");
const config = require("../config/key.js");
const jwt = require("jsonwebtoken");

// 환자 기록 가져오기
exports.getHistory = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];

  try {
    req.decoded = jwt.verify(token, config.JWT);
    const { licenseNumber } = req.decoded;
    const doctor = await Doctor.findOne({ licenseNumber });
    if (!doctor) {
      res.status(404).json({
        isSuccess: false,
        message: "유저 정보가 없습니다.",
        token,
      });
      return;
    }

    const { patientId } = req.body;
    // 환자 유무 확인
    const patient = await Patient.findOne({ patientId });
    if (!patient) {
      res.status(404).json({
        isSuccess: false,
        message: "환자 정보가 없습니다.",
        token,
      });

      return;
    }

    const isAuthority = patient.doctorList.some((ele) => ele === licenseNumber);

    if (isAuthority) {
      const history = await History.find({ patientId });

      res.json({
        history,
        isSuccess: true,
        message: "환자 기록 정보 가져오기 성공",
        token,
      });

      return;
    } else {
      res.json({
        isSuccess: false,
        message: "환자 기록 열람 권한이 없습니다.",
        token,
      });

      return;
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      isSuccess: false,
      message: "서버 오류 발생",
      token,
    });
  }
};

// 환자 기록 생성하기
exports.postHistory = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];

  try {
    req.decoded = jwt.verify(token, config.JWT);
    const { licenseNumber } = req.decoded;
    const doctor = await Doctor.findOne({ licenseNumber });
    // 의사 유무 확인
    if (!doctor) {
      res.status(404).json({
        isSuccess: false,
        message: "유저 정보가 없습니다.",
        token,
      });

      return;
    }

    const { patientId, diagnosisCode, prognosis } = req.body;

    // 환자 유무 확인
    const patient = await Patient.findOne({ patientId });
    if (!patient) {
      res.status(404).json({
        isSuccess: false,
        message: "환자 정보가 없습니다.",
        token,
      });

      return;
    }

    const isAuthority = patient.doctorList.some((ele) => ele === licenseNumber);

    if (isAuthority) {
      await History.create({
        patientId,
        licenseNumber,
        diagnosisCode,
        prognosis,
      });
    } else {
      res.json({
        isSuccess: false,
        message: "환자 기록 생성 권한이 없습니다.",
        token,
      });

      return;
    }

    res.json({
      isSuccess: true,
      message: "환자 기록 생성에 성공하였습니다.",
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      isSuccess: false,
      message: "서버 오류 발생",
      token,
    });
  }
};
