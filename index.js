const express =  require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("welcome to node js restapi");
})
app.get("/students", async(req,res)=> {
    const studentData = await mongoose.find();
    if(!studentData) {
        res.status(200).{message: "Record not found! " };
    }
    res.status(200).json({ message: "Record not found! " });

} res.status(200).json(studentData);
} catch(error) {

}

})

app.listen(3000,async(error) => {
    if(error){
        console.log(error);
    }

    try{
 await mongose.connect("mongodb: //127.0.0.1.:27017/studentdb");
 console.assertlog("Connected to Database StudentDB");
 console.log("Server running on http://localhost:3000");
    } catch(error){

    }
})
