// const express = require('express');
// const { getAllTalkers } = require('./talkerUtils');
// const router = express.Router();

// router.get('/', (req, res) => res.status(200).json({message: "you are on /another."}));

// router.get('/talker', async (req, res) => {
//   const response = await getAllTalkers();
//   if(!response) {
//     return res.status(400).json([]);
//   }
//   return res.status(200).json(response);
// });

// module.exports = router;