const moment = require('moment')
const express = require('express')
const app = express()
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const activities = require('../___mocks___/activities')

var users = [
  {
    email: 'this@ya.ru',
    password: '12345',
    name: 'this',
    surname: 'this'
  }
]

app.use(express.static('dist'))

app.listen(8090, () => console.log('Listening on port 8090!'))

app.post('/api/user', upload.fields([{ name: 'email' }, { name: 'password'}, { name: 'name'}, { name: 'surname'}]), (req, res) => {
  console.log(req.body)
  if(!req.body.email || !req.body.password || !req.body.name || !req.body.surname)
    res.status(400).send({message: 'Parameters are not correct'})
  let user = users.find(u => u.email === req.body.email)
  if(user != null){
    res.status(409).send({message: 'User with the email already exists'})
  }
  else{
    users.push({
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
      surname: req.body.surname
    })
    res.status(200).send({message: 'Success'})
  }
})

app.post('/api/login', upload.fields([{ name: 'email' }, { name: 'password'}]), (req, res) => {
  console.log(req.body)
  if(!req.body.email || !req.body.password)
    res.status(400).send({message: 'Parameters are not correct'})
  let user = users.find(u => u.email === req.body.email)
  if(user != null){
    if(user.password === req.body.password) {
      res.status(200).send({message: 'Success'})
    }
    else
      res.status(401).send({message: 'Credentials provided are incorrect'})
  }
  else{
    res.status(404).send({message: 'User was not found'})
  }
})

app.post('/api/logout', (req, res) => {
  console.log(req.body)
  res.status(200).send({message: 'Success'})
})

app.get('/api/activity', (req, res) => {
  // console.log(req.query)
  // res.send(activities)
  let acts = activities.activities.filter(a => moment(a.start_time, 'YYYY-MM-DD hh:mm:ss').isAfter(moment('2018-10-27', 'YYYY-MM-DD')))
  res.send({message: 'Success', activities: acts})

})

module.exports = app
