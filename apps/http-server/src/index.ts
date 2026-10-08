import prisma from "@package/db/prismaClient"
import express from "express"
import cors from "cors"
//todo: add a jsonified 


const app = express()
app.use(express.json()); 
app.use(cors());
app.get("/", async (req,res)=>{
    const alltodos = await prisma.todo.findMany();
    res.json({
        alltodos
    })
})


app.post("/todos",async (req,res)=>{
    const tosavetodo = req.body.todos
    
    
    try{
        const databasesaving = await prisma.todo.createMany({
        data:tosavetodo //
        })
        
        res.status(200).json({
            message:"all the todos are saved",
            count: databasesaving.count
        })
    
    }

    catch(error){
        res.json({
            message:"error in savig the todos",
            error
        })
    }
    
    
    
})
//route for completing the todos
app.post("/check",(req,res)=>{
    res.json({
        
    })
})



app.listen(3000)