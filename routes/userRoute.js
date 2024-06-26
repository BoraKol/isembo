const express = require('express')
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const { body } = require('express-validator'); 
const User = require('../models/User');

const router = express.Router();

router.route('/signup').post(
    [
        
        body('name').not().isEmpty().withMessage('Please Enter Your Name '),

        body('email').isEmail().withMessage('Please Enter Valid Email').custom((userEmail)=>{
            return User.findOne({ email: userEmail}).then(user=>{
                if(user){
                    return Promise.reject('Email is already exists!');
                }
            })
        }),
        body('password').not().isEmpty().withMessage('Please Enter a Password'),
    ],

        authController.createUser); // http://localhost:3000/users/signup

router.route('/login').post(authController.loginUser);
router.route('/logout').get(authController.logoutUser);
router.route('/dashboard').get(authMiddleware,authController.getDashboardPage); // http://localhost:3000/users/dashboard
router.route('/inbox').get(authMiddleware,authController.getInboxPage); // http://localhost:3000/users/inbox
router.route('/:id').delete(authController.deleteUser);
router.route('/:id').put(authController.updateUserRole);
router.route('/profile').get(authMiddleware,authController.getProfilePage);
router.route('/:id').put(authController.updateUserProfile);

module.exports = router;