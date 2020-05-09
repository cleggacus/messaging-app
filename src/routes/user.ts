import express from "express";
import multer from 'multer';
const router = express.Router();

import {register, login, getNotifications, SearchUser, remove, getPublic, updatePicture, updateStatus, validateUsername, updateTheme, getUserInfo, logOut, follow, isFollowing} from '../controllers/user';
import auth from '../middleware/auth';

const development = process.env.NODE_ENV !== 'production';

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './pictures');
  }
});

const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});


router.post("/getpublic", getPublic);
router.post("/register", register);
router.post("/login", login);
router.post("/validateUsername", validateUsername);
router.get("/logout", logOut);
router.post("/SearchUser", SearchUser);
router.get("/remove", auth, remove);
router.post("/updateTheme", auth, updateTheme);
router.post("/updateStatus", auth, updateStatus);
router.post("/follow", auth, follow);
router.post("/isFollowing", auth, isFollowing);
router.post("/updatePicture", auth, upload.single('picture'), updatePicture);
router.get("/getUserInfo", auth, getUserInfo);
router.get("/getNotifications", auth, getNotifications);

router.get("/auth", auth, (req: any, res: any, next: any) => {
  res.status(200).json({
    message: "user is authorized"
  });
})

export default router;