import mongoose from "mongoose";

const connectDB = async (DATABASE_URL) => {
    try {
        const dbName = "AuthorizeUsers";

        await mongoose.connect(`${DATABASE_URL}/${dbName}`);
        console.log('Database is connected...');
    } catch (error) {
        console.error(error);
    }
};

export default connectDB;
/* In production, remove the log and error log from the logical message */
