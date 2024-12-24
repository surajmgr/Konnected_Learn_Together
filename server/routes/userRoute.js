const express = require('express');
const user_route = express();
const user_controller = require('../controllers/userController');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../client/public/upload/avatar')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random()) + '-' + file.originalname
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
  
const upload = multer({ storage: storage })

user_route.get("/:username", user_controller.getProfile)
user_route.get("/settings/follow", user_controller.isFollowing)
user_route.post("/settings/follow", user_controller.doFollow)
user_route.delete("/settings/follow", user_controller.removeFollow)
user_route.get("/followings/:uid", user_controller.getFollowings)
user_route.get("/followers/:uid", user_controller.getFollowers)
user_route.post("/upload-avatar/1", upload.single('file'), user_controller.uploadAvatar)
user_route.post("/update/:username/:uid", user_controller.updateProfile)
user_route.get("/notifications/:uid", user_controller.getNotifications)
user_route.post("/notifications", user_controller.updateReadNotif)
user_route.post("/notifications/add", user_controller.addNotifications)
user_route.post("/update-balance", user_controller.updateBalance)
user_route.post("/update-coins", user_controller.updateCoins)
user_route.post("/transaction", user_controller.getBody)

module.exports = user_route;