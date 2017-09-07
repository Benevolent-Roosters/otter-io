'use strict';
const express = require('express');
const router = express.Router();
const ProfileController = require('../controllers').Profiles;

router.route('/')
  .get(ProfileController.getAll)
  ;

router.route('/:id')
  .get(ProfileController.getOne)
  .put(ProfileController.update)
  ;

module.exports = router;
