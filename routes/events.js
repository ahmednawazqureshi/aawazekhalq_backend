const router = require('express').Router()
const Event = require('../models/Event')
const auth = require('../middleware/auth')

router.get('/', async (req,res)=>{
  const data = await Event.find().sort({date:1})
  res.json(data)
})

router.post('/', auth, async (req,res)=>{
  const data = await Event.create(req.body)
  res.json(data)
})

router.put('/:id', auth, async (req,res)=>{
  const data = await Event.findByIdAndUpdate(req.params.id, req.body, {new:true})
  res.json(data)
})

router.delete('/:id', auth, async (req,res)=>{
  await Event.findByIdAndDelete(req.params.id)
  res.json({ok:true})
})

module.exports = router
