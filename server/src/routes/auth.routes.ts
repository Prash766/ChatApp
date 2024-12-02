import { Router } from "express";
import { checkUser, loginUser, signUpUser, updateProfile } from "../controllers/auth.controller";
import { upload } from "../middlewares/multer.middleware";
import verifyJWT from "../middlewares/auth.middleware";

 const router = Router()

 router.route('/login').post( loginUser)
router.route('/signup').post(  upload.single('profileImage'), signUpUser)
router.route('/update-profile').post(verifyJWT, upload.single('profileImage') , updateProfile)
router.route('/me').get(verifyJWT,checkUser)

 export default router