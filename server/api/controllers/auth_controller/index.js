const User = require('../../../models/account_models/user');
const Role = require('../../../models/account_models/role');
const { check, validationResult, body } = require('express-validator');

exports.register_user = [
    [
        check('username').not().isEmpty(),
        check('password').not().isEmpty(),
        check('password2').not().isEmpty(),
        check('email').isEmail(),
        check('password').isLength({ min: 6 }),
        body('password2').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),
        body('email').custom(value => {
            return User.findUserByEmail(value).then(user => {
                if (user) {
                    return Promise.reject('E-mail already in use');
                }
            });
        })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        Role.get_id_by_role(await User.getCount() === 0 ? 'super_admin' : 'guest').then(role_id => {
            const new_user = new User({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                role: role_id
            });
            new_user.save().then(() => {
                res.status(201).json({
                    message: `User with username ${req.body.username} has been created`,
                });
            });
        })
            .catch(err => {
                res.status(500).json({
                    message: 'Some internal error occurred',
                    err_msg: err
                });
            });
    }
];

exports.login_user = (req, res) => {
    res.status(200).json({
        token: req.user
    });
};