const express = require('express');
export const router = express.Router();

import {showLogin, login, logout} from "../controllers/auth";

router.get('/login', showLogin);
router.post('/login', login);
router.get('/logout', logout);


