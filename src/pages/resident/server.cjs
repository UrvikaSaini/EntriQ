const express=require('express');
const cors=require('cors');
const path=require('path');
const db = require('./db.cjs');
require('dotenv').config({path: path.join(__dirname,'info.env'),debug: true});

const visitorRoute=require("./visitor.cjs");
const residentRoute=require("./resident.cjs");
const visitorPassRoute=require("./visitorPass.cjs");
const visitorRequestRoute=require("./visitorRequest.cjs");

const app=express();
app.use(cors());
app.use(express.json());
app.use('/api/visitors',visitorRoute);
app.use('/api/resident',residentRoute);
app.use('/api/visitor_passes',visitorPassRoute);
app.use('/api/visitor_requests',visitorRequestRoute);

const Port=process.env.PORT|| 5000;
app.listen(Port,()=>{
    console.log(`Server Running Smoothly on Port ${Port}`);
});