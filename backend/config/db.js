import mongoose from 'mongoose';

export const connectDB=async()=>{
    await mongoose.connect(
        'mongodb+srv://hrishikeshsarma4444:Hrishi2004@cluster0.tgppk.mongodb.net/food-del'
    ).then(()=>{ console.log('DB connected')});

}