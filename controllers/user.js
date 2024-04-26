const Patient = require("../models/patient.js");
const Doctor = require("../models/doctor.js");
const History = require("../models/history.js");
const config = require("../config/key.js");
const jwt = require("jsonwebtoken");

// 의사 회원가입 요청
exports.postJoin = async (req, res, next) => {
  try {
    const {
      doctorName,
      password,
      licenseNumber,
      medicalInstitution,
      diagnosisCode,
    } = req.body;

    // 이미 가입된 회원인지 확인
    const doctor = await Doctor.findOne({ licenseNumber });
    if (doctor) {
      res.status(404).json({
        isSuccess: false,
        message: "이미 등록된 의사입니다.",
      });
      return;
    }

    await Doctor.create({
      doctorName,
      licenseNumber,
      medicalInstitution,
      password,
      diagnosisCode,
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
    const { licenseNumber, password } = req.body;

    console.log(licenseNumber, password);

    const doctor = await Doctor.findOne({ licenseNumber });

    // 존재하지 않는 아이디
    if (!doctor) {
      res.status(401).json({
        isSuccess: false,
        message: "가입되지 않은 사용자입니다.",
      });
      return;
    }

    // 패스워드와 아이디가 다른 경우
    if (doctor.password !== password) {
      res.status(403).json({
        isSuccess: false,
        message: "아이디 또는 패스워드가 잘못 되었습니다.",
      });
      return;
    }

    //  정상적인 로그인
    if (doctor.password === password) {
      const key = config.JWT;
      // 받은 요청에서 db의 데이터를 가져온다 (로그인정보)
      const { licenseNumber, password } = doctor;
      const token = jwt.sign(
        {
          type: "JWT",
          licenseNumber,
          password,
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

// 환자 정보 가져오기
exports.getPatient = async (req, res, next) => {
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
    const patient = await Patient.findOne({ patientId });

    if (!patient) {
      res.status(404).json({
        isSuccess: false,
        message: "환자 정보가 없습니다.",
        token,
      });

      return;
    }

    const { gender, address, name } = patient;

    const info = { patientId, gender, address, name };
    res.json({
      info,
      isSuccess: true,
      message: "프로필 정보 가져오기에 성공하였습니다.",
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

// 환자에게 기록 열람 동의 요청
exports.postAgree = async (req, res, next) => {
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
    const patient = await Patient.findOne({ patientId });

    if (!patient) {
      res.status(404).json({
        isSuccess: false,
        message: "환자 정보가 없습니다.",
        token,
      });

      return;
    }

    const isAlready = doctor.patientList.some((ele) => ele === patientId);

    // 의사의 환자 리스트에 이미 있는 환자인지
    if (isAlready) {
      res.json({
        isSuccess: false,
        message: "이미 등록된 환자입니다.",
        token,
      });

      return;
    } else {
      // agreeList에 이미 있는 의사라면 배열의 맨 끝 인덱스로 빼기
      let { agreeList } = patient;
      agreeList = agreeList.filter((e) => e !== licenseNumber);
      agreeList.push(licenseNumber);

      await patient.updateOne({ agreeList });

      res.json({
        isSuccess: true,
        message: "동의 요청에 성공하였습니다.",
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

// 환자 정보 등록
/* exports.postPatient = async (req, res, next) => {
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

    const { patientId, name, gender, address } = req.body;

    await Patient.create({ patientId, name, gender, address });

    res.json({
      isSuccess: true,
      message: "환자 정보 생성에 성공하였습니다.",
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
}; */
