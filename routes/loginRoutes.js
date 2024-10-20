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
router.get('/facturacion', (req,res)=>{
    res.render('facturacion')
});
router.get('/caja_registry', (req,res) => {
    res.render('caja_register')
});

router.get('/routine', (req,res)=>{
    res.render('table_routine')
});

router.get('/add_exercise', (req,res)=>{
    res.render('add_exercise')
});

router.get('/edit_routine/:id', (req,res)=>{
    res.render('edit_routine')
});

export default router;