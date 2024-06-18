import express, { query } from "express"
import bodyParser  from "body-parser"

import pg from "pg"
const app=express()

const PORT=3000

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:true}))
const db=new pg.Client({
    user:'postgres',
    host:'localhost',
    database:'book',
    password:"redhawk",
    port:5432
})
db.connect();


app.get("/",async (req,res)=>{
    const q=req.query.sort||null;
    const e=req.query.find||null;
    let sql="SELECT * FROM BOOKS";
    let params=[];
    const ex=await db.query("CREATE TABLE IF NOT EXISTS books (id SERIAL PRIMARY KEY,isbn_id BIGINT NOT NULL,title TEXT,author TEXT,review TEXT,rating INTEGER,image TEXT);")
    if(e){
        sql+=" WHERE title=$1"
        params.push(e);
    }
    if(q){
        sql+=` ORDER BY ${q} DESC` 
    }
    
    try{
        const result=await db.query(sql,params);
        const resu=result.rows;
        res.render("index.ejs",{data:resu})
    }
    catch(err){
            console.log(err);
       }
})
app.get("/add-book",(req,res)=>{
    res.render("add-book.ejs")
})
app.get("/edit",async(req,res)=>{
    const isbn_id=req.query.isbn_getter;
    try{
        const response=await db.query("SELECT * FROM books WHERE isbn_id=$1",[isbn_id])
        const resu=response.rows;
        console.log(resu)
        res.render("edit.ejs",{data:resu});
    }
    catch(err){
        console.log(err);
    }
    
})
app.get("/delete",async(req,res)=>{
    const isbn_id=req.query.isbn_info;
    try{
        const response=await db.query("DELETE FROM books WHERE isbn_id=$1",[isbn_id]);
        res.redirect("/")
    }
    catch(err){
        console.log(err)
    }
})
app.get("/login",(req,res)=>{
    res.render("login.ejs")
})
app.get("/register",(req,res)=>{
    res.render("register.ejs")
})
app.post("/edit",async(req,res)=>{
    const isbn_id=req.body.isbn_id
    
    const title=req.body.title
    
    const author=req.body.author
   
    const review=req.body.review
    
    const rating=req.body.rating
    
    const image=`https://covers.openlibrary.org/b/isbn/${isbn_id}-L.jpg`
    try{
        
        const response=await db.query("UPDATE books SET title=$1,author=$2,review=$3,rating=$4 WHERE isbn_id=$5",[title,author,review,rating,isbn_id])
    }catch(err){
        console.log(err);
    }
    res.redirect("/")
})
app.post("/add-book",async(req,res)=>{
    
    const isbn_id=req.body.isbn_id
    const title=req.body.title
    const author=req.body.author
    const review=req.body.review
    const rating=req.body.rating
    
    const image=`https://covers.openlibrary.org/b/isbn/${isbn_id}-L.jpg`
    
    try{
        
        const response=await db.query("INSERT INTO books (isbn_id,title,author,review,rating,image) VALUES ($1, $2, $3, $4, $5, $6)",[isbn_id,title,author,review,rating,image])
    }catch(err){
        console.log(err);
    }
    res.redirect("/")
})

app.listen(PORT,(req,res)=>{
    console.log("App listening at port "+PORT)
})