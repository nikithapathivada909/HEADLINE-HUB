const {Client} = require('pg')

const client = new Client({
  host:"localhost",
  user:'postgres',
  port:5432,
  password:"rahul",
  database:"Headline_hub"
})

client.connect()

client.query(`Select * from users`,(err,res) => {
  if(err){
    console.log(err)
  }else{
    console.log(res.rows)
  }
  client.end;
})