const Service = require("../models/serviceModel");
const Master = require('../models/masterModel');

exports.getAllMasters = async (req, res)=>{
    try{
        //Filtering
        const queryObj = {...req.query};
        const excludedFields = ["sort", "limit", "fields"];
        excludedFields.forEach(el=>delete queryObj[el]);


        //Advanced filtering

        let queryString = JSON.stringify(queryObj); //convert to string
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match=>`$${match}`) //add $sign to operator
        console.log(JSON.parse(queryString)) //console and parse string from query object

        let query = Master.find(JSON.parse(queryString))

        //Sorting 

        if(req.query.sort){
            const sortBy = req.query.sort.split(",").join(" ");
            query = query.sort(sortBy);
        }else{
            query = query.sort("-createdAt");
        }

        //Field limiting

        if(req.query.fields){
            const fields = req.query.fields.split(",").join(" ");
            query = query.select(fields);
        }

        //Execute query

        const masters = await query;
        res.status(200).json({
            status: "success",
            results: masters.length,
            data:{
                masters
            }
        })
    }catch(error){
        console.log(error)
    }
    }

exports.createMaster = async (req, res) =>{
try {
    const { service } = req.body;
    const serviceName = req.body.service
    const existingService = await Service.findOne({name: serviceName});

    if (!existingService) {
        return res.status(400).json({
            status: 'fail',
            message: 'Service does not exist'
        });
    }

    const master = await Master.create(req.body);
    res.status(201).json({
        status: 'success',
        data: master
    });
} catch (err) {
    res.status(400).json({
        status: 'fail',
        message: err.message
    });
}
};

exports.getMasterById = async (req, res)=>{
    const master = await Master.findById(req.params.id).populate("service");
    if(!master){
        return res.status(404).json({
            status: "failed",
            message: "Invalid id"
        })
    }
    res.status(200).json({
        status: "success",
        data:{
            master
        }
    })
}

exports.updateMaster = async (req, res)=>{
    try{
        const master = await Master.findByIdAndUpdate(req.params.id, req.body,{
            new:true,
            runValidators:true
    });
    res.status(200).json({
        status: "success",
        data:{
            master: "Updated"
        }
    })
    } catch(error){
        res.status(404).json({
            status: "fail",
            message: error
        })
    }
    
}

exports.deleteMaster = async (req, res)=>{
    try{
        await Master.findByIdAndDelete(req.params.id)
    }catch(error){
        console.log(error)
    }
    res.status(200).json({
        status: "success",
        data:{
            master: null
        }
    })
}