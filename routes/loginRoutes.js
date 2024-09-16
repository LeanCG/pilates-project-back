import Router from 'express';

const router = Router();

router.get('/', (req,res)=>{
    res.render('login')
});
router.get('/home', (req,res)=>{
    res.render('home')
});
router.get('/users', (req,res)=>{
    res.render('table_users')
});
router.get('/registry', (req,res)=>{
    res.render('register')
});


export default router;