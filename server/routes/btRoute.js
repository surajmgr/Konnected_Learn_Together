const express = require('express');
const bt_route = express();
const bt_controller = require('../controllers/btController');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../client/public/upload/cover')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random()) + '-' + file.originalname
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
  
const upload = multer({ storage: storage })

bt_route.get("/", bt_controller.getBooks)
bt_route.get("/:level", bt_controller.getBooksByLevel)
bt_route.get("/:name/:id", bt_controller.getBook)
bt_route.post("/add-book", bt_controller.addBook)
bt_route.post("/upload-cover", upload.single('file'), bt_controller.uploadCover)
bt_route.post("/server-verify-book/1", bt_controller.verifyBook)
bt_route.get("/getall/1/2", bt_controller.getAllBooks)

module.exports = bt_route;




