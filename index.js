import express, { query } from "express"
import bodyParser  from "body-parser"
import bcrypt from "bcrypt"
import session from "express-session";
import pg from "pg"

const app=express()
const saltRounds=10
const PORT=3000
app.set('view engine', 'ejs');

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
app.use(session({
    secret: 'SECRETKET',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  // Set to true if using HTTPS
  }));

app.get("/",async (req,res)=>{
    const q=req.query.sort||null;
    const e=req.query.find||null;
    const email=req.session.userEmail
    const logout = req.query.logout || "false"; 
    const search=req.query.find
    if(search){
        try{
            const response=await db.query("SELECT * FROM books WHERE email=$1 AND title=$2",[email,search])
            res.render("index.ejs",{data:response.rows,logout})
        }
        catch(err){
            console.log(err)
        }
    }
    
    console.log(email)
    
    let sql = `
    SELECT books.*
    FROM books
    JOIN user_books ON books.isbn_id = user_books.book_id
    JOIN users ON user_books.user_id = users.email
    WHERE users.email = $1
`;
    let params=[email];
    // const ex=await db.query("CREATE TABLE IF NOT EXISTS books (id SERIAL PRIMARY KEY,isbn_id BIGINT NOT NULL,title TEXT,author TEXT,review TEXT,rating INTEGER,image TEXT);")
    if(e){
        sql+=" WHERE title=$2"
        params.push(e);
    }
    if(q){
        sql+=` ORDER BY ${q} DESC` 
    }
    
    try{
        const result=await db.query(sql,params);
        const resu=result.rows;
        res.render("index.ejs",{data:resu,logout:logout})
    }
    catch(err){
            console.log(err);
       }
})

app.get("/edit",async(req,res)=>{
    const isbn_id=req.query.isbn_getter;
    try{
        const response=await db.query("SELECT * FROM books WHERE isbn_id=$1",[isbn_id])
        const resu=response.rows;
      
        res.render("edit.ejs",{data:resu});
    }
    catch(err){
        console.log(err);
    }
    
})
app.get("/delete",async(req,res)=>{
    const isbn_id=req.query.isbn_info;
    try{
        await db.query("DELETE FROM user_books WHERE book_id=$1", [isbn_id]);
        await db.query("DELETE FROM books WHERE isbn_id=$1", [isbn_id]);
        res.redirect("/")
    }
    catch(err){
        console.log(err)
    }
})
app.get("/add-book",(req,res)=>{
    res.render("add-book.ejs")
})
app.get("/login",(req,res)=>{
    res.render("login.ejs")
})
app.get("/register",(req,res)=>{
    res.render("register.ejs")
})
app.get("/login",(req,res)=>{
    res.render("login.ejs");
})
app.get("/logout",(req,res)=>{
    req.session.userEmail = ""
    res.redirect("/?logout=true")
})
app.post("/login",async(req,res)=>{
    req.session.userEmail =req.body.username
    const email=req.body.username;
    const loginpassword=req.body.password;
    try{
        const response=await db.query("SELECT * FROM users WHERE email=$1",[email]);
        if(response.rows.length>0){
            const user = response.rows[0];
            const storedhashPassword = user.password;
            bcrypt.compare(loginpassword,storedhashPassword,(err,result)=>{
               if(err){
                console.log(err);
               }
               else{
                if(result){
                    res.redirect("/");
                  }
                  else{
                    console.log("Incorrect password");
                  }
               }
            })
        }
    }
    catch(err){
        console.log(err);
    }
    
})
app.post("/register",async(req,res)=>{
    const email=req.body.username;
    const password=req.body.password;
    try{
        const response=await db.query("SELECT * FROM users WHERE email=$1",[email]);
        if(response.rows.length>0){
            res.render("register.ejs", { message: "Email already exists. Try logging in!" });
        }
        else{
            bcrypt.hash(password,saltRounds,async(err,hash)=>{
                if(err){
                    console.log(err);
                }
                else{
                    req.session.userEmail = email;
                    
                    const result=await db.query("INSERT INTO users (email,password) VALUES($1, $2)",[email,hash])
                    res.redirect("/");
                }
            })
            
            
            
        }
    }
    catch(err){
        console.log(err)
    }
    
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
    const email=req.session.userEmail
    console.log(email)
    const image=`https://covers.openlibrary.org/b/isbn/${isbn_id}-L.jpg`
    
    try{
        const response=await db.query("INSERT INTO books (isbn_id,title,author,review,rating,image,email) VALUES ($1, $2, $3, $4, $5, $6, $7)",[isbn_id,title,author,review,rating,image,email])
        const re=await db.query("INSERT INTO user_books (user_id,book_id) VALUES ($1, $2)",[email,isbn_id])
        
    }catch(err){
        console.log(err);
    }
    res.redirect("/");
})

app.listen(PORT,(req,res)=>{
    console.log("App listening at port "+PORT)
})