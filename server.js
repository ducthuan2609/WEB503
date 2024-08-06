//khởi tạo server
const express = require("express"); //require express
const mongoose = require("mongoose");
const multer = require("multer"); //upload file
const ProductController = require("./controllers/ProductController");
const AuthController = require("./controllers/AuthController");

const app = express();
const port = 3000;

//khai báo thông tin để upload file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

//khai báo sử dụng ejs
app.set("view engine", "ejs"); //khai báo view engine là ejs
app.set("views", "./views"); //khai báo thư mục chứ file giao diện
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect("mongodb://localhost:27017/wd18412")
  .then((result) => {
    //router dùng trên client
    app.get("/", ProductController.getHome);
    app.get("/list", ProductController.getList);
    app.get("/products-detail/:id", ProductController.detail);
    app.get("/create", ProductController.create);
    app.post("/save", upload.single("image"), ProductController.save);
    app.get("/edit/:id", ProductController.edit);
    app.post("/update/:id", upload.single("image"), ProductController.update);
    app.get("/delete/:id", ProductController.delete);

    // router dùng cho api
    app.get("/products", ProductController.apiGetList);
    app.get("/products/:id", ProductController.apiDetail);
    app.post("/products", upload.single("image"), ProductController.apiCreate);
    app.put(
      "/products/:id",
      upload.single("image"),
      ProductController.apiUpdate
    );
    app.delete("/products/:id", ProductController.apiDelete);

    // router đăng kí
    app.post("/register", AuthController.register);
    app.post("/login", AuthController.login);

    app.listen(port, () => {
      console.log(`running in port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
