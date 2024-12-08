import { Router } from "express";
import { checkUser, loginUser, logOutUser, signUpUser, updateProfile, userInfo } from "../controllers/auth.controller";
import { upload } from "../middlewares/multer.middleware";
import verifyJWT from "../middlewares/auth.middleware";

 const router = Router()

 router.route('/login').post( loginUser)
router.route('/signup').post(  upload.single('profileImage'), signUpUser)
router.route('/update-profile').put(verifyJWT, upload.single('profileImage') , updateProfile)
router.route('/me').get(verifyJWT,checkUser)
router.route('/logout').get(verifyJWT , logOutUser)
router.route('/user').get(verifyJWT , userInfo)

 export default router