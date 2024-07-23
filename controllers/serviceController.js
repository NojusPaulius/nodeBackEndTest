const Service = require("../models/serviceModel");

exports.getAllServices = async (req, res) => {
    try {
        // Filtering
        const queryObj = { ...req.query };
        const excludedFields = ["sort", "limit", "fields"];
        excludedFields.forEach(el => delete queryObj[el]);

        // Advanced filtering
        let queryString = JSON.stringify(queryObj); // Convert to string
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`); // Add $ sign to operators
        console.log(JSON.parse(queryString)); // Console and parse string from query object

        let query = Service.find(JSON.parse(queryString)); // Use Service model for querying

        // Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(",").join(" ");
            query = query.sort(sortBy);
        } else {
            query = query.sort("-createdAt"); // Default sorting
        }

        // Field limiting
        if (req.query.fields) {
            const fields = req.query.fields.split(",").join(" ");
            query = query.select(fields);
        }

        // Execute query
        const services = await query; // Fetch services from the database
        res.status(200).json({
            status: "success",
            results: services.length, // Include number of services found
            data: {
                services // Return the fetched services
            }
        });
    } catch (error) {
        console.log(error); // Log error for debugging
        res.status(500).json({
            status: "fail",
            message: error.message // Send error message in the response
        });
    }
};

exports.createService = async (req, res)=> {
    try{

        const newService = await Service.create(req.body);

        res.status(201).json({
            status: "success",
            message: "New service created",
            data: {newService}
        })
    }catch(error){
        res.status(400).json({
            status: "failed",
            message: error.message
        })
    }
}

exports.getServiceById = async (req, res)=>{
    const service = await Service.findById(req.params.id);
    if(!service){
        return res.status(404).json({
            status: "failed",
            message: "Invalid id"
        })
    }
    res.status(200).json({
        status: "success",
        data:{
            service
        }
    })
}

exports.updateService = async (req, res)=>{
    try{
        const service = await Service.findByIdAndUpdate(req.params.id, req.body,{
            new:true,
            runValidators:true
    });
    res.status(200).json({
        status: "success",
        data:{
            service: "Updated"
        }
    })
    } catch(error){
        res.status(404).json({
            status: "fail",
            message: error
        })
    }
    
}

exports.deleteService = async (req, res)=>{
    try{
        await Service.findByIdAndDelete(req.params.id)
    }catch(error){
        console.log(error)
    }
    res.status(200).json({
        status: "success",
        data:{
            service: null
        }
    })
}