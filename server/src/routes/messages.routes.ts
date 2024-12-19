import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware";
import { getMessages, getUserSidebar, sendMessages } from "../controllers/messages.controller";
import { upload } from "../middlewares/multer.middleware";

const router = Router()

router.route('/users').get(verifyJWT , getUserSidebar)
router.route('/:id').get(verifyJWT , getMessages)
router.route('/send/:id').post(verifyJWT ,upload.array('files', 10), sendMessages)


export default router