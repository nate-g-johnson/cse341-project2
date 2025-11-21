const router = require('express').Router();

router.use('/', require('./swagger'));

router.get('/', (req, res) => {
    // #swagger.tags = ['Hello World']
    res.send('Products API - Welcome!');
});

router.use('/auth', require('./auth'));

router.use('/products', require('./products'));
router.use('/categories', require('./categories'));

module.exports = router;