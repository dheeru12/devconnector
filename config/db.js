const mongoose=require('mongoose');
const config=require('config');
const { ensureIndexes } = require('../models/User');
const db=config.get("mongouri");

const connectDB = async () => {
    try{
        await mongoose.connect(db,{
            useNewUrlParser:true,
            useUnifiedTopology: true,
            useCreateIndex:true
        });

        console.log('Mongo DB connected');
    }catch(err){
        console.error(err.message);
        //exit process when failure
        process.exit(1);
    }
}

module.exports = connectDB;
