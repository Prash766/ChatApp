import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware";
import { getMessages, getUserModal, getUsersSideBar, sendMessages } from "../controllers/messages.controller";
import { upload } from "../middlewares/multer.middleware";

const router = Router()

router.route('/users').get(verifyJWT , getUserModal)
router.route('/sidebar_users').get(verifyJWT , getUsersSideBar)
router.route('/:id').get(verifyJWT , getMessages)
router.route('/send/:id').post(verifyJWT ,upload.array('files', 10), sendMessages)


export default router