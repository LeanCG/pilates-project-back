import express from "express"
import { createUser, deleteUser, editUser, editUsuario, infoUser, listUsers, appinventor } from "../controllers/user.js"

const router = express.Router()

router.post("/create", (createUser))
router.post("/delete/:id", (deleteUser))
router.post("/edit/:id", (editUser))
router.post("/editUser/:id", editUsuario)
router.get("/list", (listUsers))
router.get("/infoUser/:id", infoUser)
router.get("/appinventor/:id", appinventor)

export default router