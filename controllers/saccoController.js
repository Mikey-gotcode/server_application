const Sacco=require('../models/Sacco')
const bcrypt=require('bcrypt-nodejs')
const jwt=require('jsonwebtoken')
require('dotenv').config()
console.log("jwt secret:",process.env.JWT_SECRET);



exports.register=async(req,res)=>{
    const{saccoName,saccoOwner,email,phoneNumber,username,password}=req.body
    console.log(req.body)

    try {
        //create if-else that will handle records that already exist
      const hashedPassword=await bcrypt.hash(password,10)
      const newSacco=new Sacco({saccoName,saccoOwner,email,phoneNumber,username,password:hashedPassword})
      const savedVehicle=await newSacco.save()
      
      console.log("saved vehicle:",savedVehicle)
      res.status(200).json(savedVehicle)

    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

exports.login=async(req,res)=>{
    const secret=process.env.JWT_SECRET
    console.log("jwt",secret)

    // console.log(req.body.username)
    const{username,password}=req.body
    // console.log(username)
    try {
        const sacco=await Sacco.findOne({username})
        // console.log(sacco)
        if(!sacco) return res.status(400).json({message:"sacco not found"})
        const isMatch=await bcrypt.compare(password,sacco.password)
        // console.log(isMatch)
        if(!isMatch) return res.status(400).json({message:"invalid credentials"})
        console.log('jwt secret:',secret)
        const token=jwt.sign({id:sacco._id},secret,{expiresIn:"1h"})
        console.log(token)
        if(!token) return res.json("no token jenerated")

        return res.status(200).json({token,sacco})
    } catch (error) {
        console.log(error)
        res.status(500).json({error:error.message})
    }
}

exports.searchVehicle=async(req,res)=>{
    const{VehicleRegistration}=req.body

    try {
        const searchedVehicle=await Vehicle.find(VehicleRegistration)
        console.log(searchedVehicle)

        if(!searchedVehicle)return res.status(400).json({message:"Vehicle Not Found"})
        return res.status(200).json(searchedVehicle)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}