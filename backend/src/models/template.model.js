import mongoose from "mongoose";

const TemplateSchema = new mongoose.Schema({
    name:   {type: String, required: true, default: "praveen"}
})

const Template = mongoose.model("Templates", TemplateSchema);

export default Template;