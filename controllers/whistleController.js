const mongoose= require('mongoose')
const Whistle=require('')


mongoose.connect('mongodb://localhost:27017/',{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>{
    console.log('database connection successfull')

})

exports.whistle=async(req,res)=>{
    console.log(req.body)
    const{coordinates}=req.body

    try {
        const whistle=new Whistle({coordinates})
        const savedWhistleLocation=await whistle.save()
        console.log(savedWhistleLocation)
    } catch (error) {
        res.status(500).json({error:error.message})
        
    }
}