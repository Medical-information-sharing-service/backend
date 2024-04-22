const port = 8000; //포트번호 설정
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const config = require("./config/key");
const cors = require("cors");
// const errorControllers = require("./controllers/error");

// const cookieParser = require("cookie-parser");

// const adminRoutes = require("./routes/admin");
// const boardRoutes = require("./routes/board");
const userRoutes = require("./routes/user");
const patientRoutes = require("./routes/patient");
const historyRoutes = require("./routes/history");

//admin bro
// const { adminBro, router } = require("./admin-config"); // 상대 경로에 주의하세요.
// const session = require("express-session");
// app.use(
//   session({
//     secret: "1234567", // 안전하고 강력한 시크릿 키로 교체해야 합니다
//     resave: false,
//     saveUninitialized: true,
//   })
// );

// //DB 설정
mongoose
  .connect(config.mongoURI, {
    // 몽고디비 연결 주소를 넣어주도록 한다.
    useNewUrlParser: true,
    useUnifiedTopology: true, //옵션 -> 에러를 막아준다.
  })
  .then(() => console.log("MongoDB Connected...")) // 연결될 경우에 던져주기
  .catch((err) => console.log(err)); //에러를 출력

// // CORS 문제 해결
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

//post를 사용할 수 있게
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(cookieParser());

// app.use(adminBro.options.rootPath, router);
// app.listen(1500, function () {
//   console.log("Listening to Port 1500");
// });

//router 목록
// app.use("/admin", adminRoutes);
// app.use("/board", boardRoutes);
app.use("/user", userRoutes);
app.use("/patient", patientRoutes);
app.use("/history", historyRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
