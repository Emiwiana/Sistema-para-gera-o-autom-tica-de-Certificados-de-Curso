const express = require('express');
export const router = express.Router();

import {showLogin} from "../controllers/auth/authController";
import {logout} from "../controllers/auth/authController";

router.get('/login', showLogin);
router.get('/logout', logout);


