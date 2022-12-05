const Service = require('../models/service')
const { pick } = require('lodash')

const serviceController = {}

//for customers

serviceController.create = async (req, res) => {
    const body = pick(req.body, ['category', 'description', 'address', 'scheduledOn'])
    try {
        const service = new Service({...body, user : req.tokenData._id})
        const s = await service.save()
        res.json(s)
    } catch (error) {
        res.json(error)
    }
}

serviceController.customerList = async (req, res) => {
    try {
        const services = await Service.find({user : req.tokenData._id})
        res.json(services)
    } catch (error) {
        res.json(error)
    }
}

serviceController.customerUpdate = async (req, res) => {
    const id = req.params.id
    const body = req.body
    try {
        const service = await Service.findOneAndUpdate({_id : id, user : req.tokenData._id}, body, {new : true, runValidators : true})
        if(service){
            res.json(service)
        } else {
            res.json({
                notice : 'Bad request'          //if no service is found null is returned. this is to avoid it
            })
        }
    } catch (error) {
        res.json(error)
    }
}

serviceController.customerDelete = async (req, res) => {
    const id = req.params.id
    try {
        const service = await Service.findOneAndDelete({_id : id, user : req.tokenData._id})
        if(service){
            res.json(service)
        } else {
            res.json({
                notice : 'Bad request'
            })
        }
    } catch (error) {
        res.json(error)
    }
}

//for experts

serviceController.expertList =  async (req, res) => {
    const query = req.query
    if(query.category){
        try {
            const services = await Service.find({category : query.category, status : 'added'})
            res.json(services)
        } catch (error) {
            res.json(error)            
        }
    } else if(query.filterBy){
        try {
            const services = await Service.find({acceptedBy : req.tokenData._id, status : query.filterBy})
            res.json(services)
        } catch (error) {
            res.json(error)            
        }
    }
}

serviceController.expertUpdate = async (req, res) => {
    const id = req.params.id
    const query = req.query
    const billAmount = req.body.billAmount
    try {
    const service = await Service.findOneAndUpdate({_id : id, acceptedBy : req.tokenData._id}, {status : query.status, acceptedBy : req.tokenData._id, billAmount}, {new : true})
    if(service) {
        res.json(service)
    } else {
        res.json({
            notice : "Bad request"
        })
    }
    } catch (error) {
        res.json(error)
    }
}    


module.exports = serviceController