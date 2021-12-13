const express = require('express')
const router = express.Router()

const {getAllJobs,getJob,createJob,updateJob,deleteJob} = require('../controllers/jobs')
const auth = require('../middleware/authentication')

router.use(auth)
router.route('/').get(getAllJobs).post(createJob)
router.route('/:id').get(getJob).patch(updateJob).delete(deleteJob)

module.exports = router