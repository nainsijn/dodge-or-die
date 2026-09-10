const mongose = require("mongose");
const studentSchema=new mongose.Scheme(
    {
      sid: { type: Number, required: true,unique:true },
      sname: { type : String, minlength: 3},
      course: { type : String, default : "B.Tech" },
      marks: { type : Number, min: 0},
      branch: { type : String, default: "CSE" }

    }
);