import express from "express"
import { getUser, createUser, deleteUser, editUser, editUsuario, listUsers } from "../controllers/user.js"

const router = express.Router()


router.post("/create", (createUser))
router.get("/find/:iduser", (getUser))
router.post("/delete/:iduser", (deleteUser))
router.post("/edit/:id", (editUser))
router.post("/editUser/:id", editUsuario)
router.get("/list", (listUsers))

export default router