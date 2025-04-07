import mongoose from "mongoose";

const uri = 'mongodb+srv://feres997:feres997@cluster0.peiowiq.mongodb.net/AL-bech-hotel';

const conn = mongoose.connect(uri)
.then(() => {
    console.log('database connect!');
})
.catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

export default conn;