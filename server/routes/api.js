const express = require('express');

const router = new express.Router();

router.get('/welcome', (req, res) => {
  res.status(200).json({
    message: "You're authorized to see this secret."
  });
});

module.exports = router;