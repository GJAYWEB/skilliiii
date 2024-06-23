const mongoose = require('mongoose');

const  contactFormSchema = new mongoose.Schema({
    name: { type : String , required : true },
    email:{type:String, required:true},
    linkedIn: {type:String},
    phoneNumber:{type: String},
    comment:{type: String}
})

// Create model from schema
const contact_form = mongoose.model('resume_form_schema', contactFormSchema);

module.exports=contact_form;