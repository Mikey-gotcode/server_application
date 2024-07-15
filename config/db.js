const mongoose=require('mongoose')
const dotenv=require('dotenv')

dotenv.config()
const remoteDB='mongodb+srv://spidungu_barbosa:Mw@ng!X18@ma3cluster.x9epetw.mongodb.net/?retryWrites=true&w=majority&appName=MA3CLUSTER'
//const localDB='mongodb://localhost:27017/'


const connectDB=async()=>{
    try {
        await mongoose.connect(remoteDB)
        console.log('MongoDB connected')
    } catch (error) {
        console.error(error.message)
        process.exit(1)
    }
}

module.exports=connectDB