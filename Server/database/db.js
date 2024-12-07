// import mongoose from "mongoose";
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Explicitly specify the .env file path
dotenv.config({ path: './.env' });

// Log all environment variables to check if they're loaded correctly
console.log('All env variables:', process.env);

// Check if the Mongo URI is loaded
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error('Mongo URI is undefined. Check your .env file.');
  process.exit(1);
}
export const connectDb=async() => {

    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('\nDatabase Connected  !! DB HOST');
    }
    catch(error){
        console.log("Mongodb Connection error", error);
    }

}