const Patient = require("../models/patient.js");
const Doctor = require("../models/doctor.js");
const History = require("../models/history.js");
const config = require("../config/key.js");
const jwt = require("jsonwebtoken");

// 환자 모든 기록 가져오기
exports.getAllHistory = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];

  try {
    req.decoded = jwt.verify(token, config.JWT);
    const { licenseNumber } = req.decoded;
    const doctor = await Doctor.findOne({ licenseNumber });
    if (!doctor) {
      res.status(404).json({
        isSuccess: false,
        message: "의사 정보가 없습니다.",
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
        message: "의사 정보가 없습니다.",
        token,
      });

      return;
    }

    const { patientId, diagnosisCode, prognosis, title, diagnosis } = req.body;

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
        title,
        diagnosis,
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

// 환자 인터페이스
// 환자가 환자의 기록의 개별 ID를 통해 가져오기
exports.getHistory = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];

  try {
    req.decoded = jwt.verify(token, config.JWT);
    const { patientId } = req.decoded;
    const patient = await Patient.findOne({ patientId });
    if (!patient) {
      res.status(404).json({
        isSuccess: false,
        message: "환자 정보가 없습니다.",
        token,
      });

      return;
    }

    const { historyId } = req.body;

    const history = await History.findOne({ _id: historyId });

    if (history) {
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
        message: "환자 기록 정보 가져오기 실패",
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

// 환자 인터페이스
// 환자가 환자의 기록의 개별 ID를 통해 가져오기
exports.getHistoryList = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];

  try {
    req.decoded = jwt.verify(token, config.JWT);
    const { patientId } = req.decoded;
    const patient = await Patient.findOne({ patientId });
    if (!patient) {
      res.status(404).json({
        isSuccess: false,
        message: "환자 정보가 없습니다.",
        token,
      });

      return;
    }

    const history = await History.find({ patientId });

    if (history) {
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
        message: "환자 기록 정보 가져오기 실패",
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

// 의사가 환자의 기록의 개별 ID를 통해 가져오기
exports.getonePatientHistory = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];

  try {
    req.decoded = jwt.verify(token, config.JWT);
    const { licenseNumber } = req.decoded;
    const doctor = await Doctor.findOne({ licenseNumber });
    if (!doctor) {
      res.status(404).json({
        isSuccess: false,
        message: "의사 정보가 없습니다.",
        token,
      });

      return;
    }

    const { historyId } = req.body;

    const history = await History.findOne({ _id: historyId });

    if (history) {
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
        message: "환자 기록 정보 가져오기 실패",
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
