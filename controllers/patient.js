const Patient = require("../models/patient.js");
const Doctor = require("../models/doctor.js");
const History = require("../models/history.js");
const config = require("../config/key.js");
const jwt = require("jsonwebtoken");

// 환자 회원가입 요청
exports.postJoin = async (req, res, next) => {
  try {
    const {
      patientId,
      name,
      gender,
      address,
      residentNumber,
      password,
      doctorList,
    } = req.body;

    // 이미 가입된 회원인지 확인
    const parent = await Patient.findOne({ patientId });
    if (parent) {
      res.status(404).json({
        isSuccess: false,
        message: "이미 등록된 환자입니다.",
      });
      return;
    }

    const doctor = await Doctor.findOne({ licenseNumber: doctorList });
    if (!doctor) {
      res.status(404).json({
        isSuccess: false,
        message: "해당 라이센스의 의사가 없습니다.",
      });
      return;
    }

    await doctor.updateOne({ patientList: patientId });

    await Patient.create({
      patientId,
      name,
      gender,
      address,
      residentNumber,
      password,
      doctorList,
    });

    res.status(200).json({
      isSuccess: true,
      message: "회원가입에 성공하였습니다.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ isSuccess: false, message: "서버 오류 발생" });
  }
};

// 로그인
exports.postLogin = async (req, res, next) => {
  try {
    const { patientId, password } = req.body;

    const patient = await Patient.findOne({ patientId });

    // 존재하지 않는 아이디
    if (!patient) {
      res.status(401).json({
        isSuccess: false,
        message: "가입되지 않은 환자입니다.",
      });
      return;
    }

    // 패스워드와 아이디가 다른 경우
    if (patient.password !== password) {
      res.status(403).json({
        isSuccess: false,
        message: "아이디 또는 패스워드가 잘못 되었습니다.",
      });
      return;
    }

    //  정상적인 로그인
    if (patient.password === password) {
      const key = config.JWT;
      // 받은 요청에서 db의 데이터를 가져온다 (로그인정보)
      const { patientId } = patient;
      const token = jwt.sign(
        {
          type: "JWT",
          patientId,
        },
        key,
        {
          issuer: "MedicalService",
        }
      );
      // res.cookie("token", token, { maxAge: 60 * 60 * 1000 });

      res.status(200).json({
        message: "로그인에 성공하였습니다.",
        isSuccess: true,
        token,
      });
      return;
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      isSuccess: false,
      message: "서버에서 오류가 발생하였습니다. 나중에 다시 시도하세요.",
    });
  }
};

// 로그 아웃
exports.getLogout = async (req, res, next) => {
  try {
    // cookie 지우기
    // res.clearCookie("token", req.cookies.token);
    res.json({
      isSuccess: true,
      message: "로그아웃에 성공하였습니다.",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      isSuccess: false,
      message: "서버에서 오류가 발생하였습니다. 나중에 다시 시도하세요.",
    });
  }
};

// 동의 요청 리스트
exports.getAgreeList = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];

  try {
    req.decoded = jwt.verify(token, config.JWT);
    const { patientId } = req.decoded;

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

    const { agreeList } = patient;

    res.json({
      agreeList,
      isSuccess: true,
      message: "환자 기록 동의 요청 리스트 보내기 완료",
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

// 동의 요청 응답
exports.postAgree = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];

  try {
    req.decoded = jwt.verify(token, config.JWT);
    const { patientId } = req.decoded;

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

    const { licenseNumber, answer } = req.body;

    if (answer === "Accept") {
      const doctor = await Doctor.findOne({ licenseNumber });

      // 의사에 환자 담기
      const isAlready = doctor.patientList.some((ele) => ele === patientId);

      if (!isAlready) {
        doctor.patientList.push(patientId);

        await doctor.save();
      } else {
        // 이미 등록된 환자일경우

        res.json({
          isSuccess: false,
          message: "이미 등록된 환자입니다.",
          token,
        });

        return;
      }

      // 환자에 의사 넣기
      patient.doctorList.push(licenseNumber);
      // agreeList에서 빼기
      patient.agreeList = patient.agreeList.filter((e) => e !== licenseNumber);

      await patient.save();

      res.json({
        isSuccess: true,
        message: "환자 기록 공유 동의 성공",
        token,
      });

      return;
    } else {
      // 취소하면

      // agreeList에서 빼기
      patient.agreeList = patient.agreeList.filter((e) => e !== licenseNumber);
      await patient.save();

      res.json({
        isSuccess: true,
        message: "환자가 기록 공유를 동의하지 않았습니다.",
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
