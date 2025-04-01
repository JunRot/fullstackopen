const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.fzfaq.mongodb.net/phonebook?
retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const entriesSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Entry = mongoose.model('Phonebook_Entry', entriesSchema)

if (process.argv.length == 5) {
  const entry = new Entry({
    name: process.argv[3],
    number: process.argv[4],
  })

  entry.save().then(() => {
    console.log('New entry added!')
    mongoose.connection.close()
  })
}

if (process.argv.length == 4) {
  console.log('Missing number!')
  mongoose.connection.close()
}

if (process.argv.length == 3) {
  Entry.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(entry => {
      console.log(`${entry.name} ${entry.number}`)
    })
    mongoose.connection.close()
  })
}