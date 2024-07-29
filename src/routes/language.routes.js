import {Router, router} from "express";

const router = Router();

router.get("/",(request,response)=>{
    res.send("Leandro lo mas");
});

export default router;