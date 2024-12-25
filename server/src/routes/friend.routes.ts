import  {Router } from "express"
import verifyJWT from "../middlewares/auth.middleware"
import { acceptFriendRequest, rejectFriendRequest, sendRequest } from "../controllers/friend.controller"
const router = Router()


router.route("/accept-request").put(verifyJWT ,acceptFriendRequest )
router.route("/send-request").post(verifyJWT , sendRequest)
router.route("/reject-request").put(verifyJWT , rejectFriendRequest)


export default router