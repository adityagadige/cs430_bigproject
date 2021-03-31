module.exports={
  mongoURL: 'mongodb+srv://'+process.env.MONGO_USER+':'+process.env.MONGO_PWD+'@cluster0.cw25a.mongodb.net/'+process.env.MONGO_DB+'?retryWrites=true&w=majority'
}
