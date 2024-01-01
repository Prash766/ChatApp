import  {Router } from "express"
import verifyJWT from "../middlewares/auth.middleware"
import { acceptFriendRequest, pendingRequestList, rejectFriendRequest, sendRequest } from "../controllers/friend.controller"
const router = Router()


router.route("/accept-request").put(verifyJWT ,acceptFriendRequest )
router.route("/send-request").post(verifyJWT , sendRequest)
router.route("/reject-request").put(verifyJWT , rejectFriendRequest)
router.route("/pending-list").get(verifyJWT, pendingRequestList)


export default router