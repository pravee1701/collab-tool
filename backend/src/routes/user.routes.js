import express from 'express';
import passport from "passport";
import "../passport/index.js";
import { apiKeyValidation, userChangeCurrentPasswordValidator, userForgotPasswordValidator, userLoginValidator, userRegisterValidator, userResetForgottenPasswordValidator } from '../validators/user.validators.js';
import { validate } from '../validators/validate.js';
import { changeCurrentPassword, createApiKey, deleteApiKey, forgotPassword, getAllUsers, getCurrentUser, handleSocialLogin, listApiKeys, loginUser, logoutUser, refreshAccessToken, registerUser, resendEmailVerification, resetForgotPassword, verifyEmail } from '../controllers/user.controller.js';
import { authorize, protect } from '../middleware/auth.middleware.js';
import { UserRolesEnum } from '../constants.js';


const router = express.Router();


router.route("/register").post(userRegisterValidator, validate, registerUser);

router.route("/login").post(userLoginValidator, validate, loginUser);

router.route("/refresh-token").post(refreshAccessToken)

router.route("/verify-email/:verificationToken").get(verifyEmail);

router.route("/forgot-password")
    .post(userForgotPasswordValidator, validate, forgotPassword);

router.route("/reset-password/:resetToken")
    .post(userResetForgottenPasswordValidator, validate, resetForgotPassword);

// Secured routes

router.route("/logout").post(protect, logoutUser);

router.route("/current-user").get(protect, getCurrentUser);

router.route("/change-password")
    .post(
        protect,
        userChangeCurrentPasswordValidator,
        validate,
        changeCurrentPassword
    )

router.route("resend-email-verification")
    .post(
        protect,
        resendEmailVerification
    );

router.route("/getAllUsers").get(
    protect,
    authorize([UserRolesEnum.ADMIN]),
    getAllUsers
)

router.get('/api-keys', protect, listApiKeys);
router.post('/api-keys', protect, apiKeyValidation, validate, createApiKey);
router.delete('/api-keys/:id', protect, deleteApiKey);

// SSO routes

router.route("/google").get(
    passport.authenticate("google", {
        scope: ["profile", "email"],
    }),
    (req, res) => {
        res.send("redirecting to google...");
    }
);
router.route("/github").get(
    passport.authenticate("github/github", {
        scope: ["profile", "email"],
    }),
    (req, res) => {
        res.send("redirecting to github/github...");
    }
);

router.route("/google/callback")
    .get(passport.authenticate("google"),
    handleSocialLogin)

router.route("/github/callback")
    .get(passport.authenticate("github"),
    handleSocialLogin)

export default router;