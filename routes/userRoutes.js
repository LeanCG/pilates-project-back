import express from "express"
import { getUser, createUser, deleteUser } from "../controllers/user.js"

const router = express.Router()


router.post("/create", (createUser))
router.get("/find/:iduser", (getUser))
router.get("/delete/:iduser", (deleteUser))

export default router