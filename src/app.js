
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import jwt from "jsonwebtoken";
import mongoose from 'mongoose';
import config from '../config';
import { UserSchema } from "./models/user";
import bcryptjs from "bcryptjs";
import {PostSchema} from "./models/post"


const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.listen(3001, () => {
    console.log("We're Online @ Port 3001!");
});



 mongoose
    .connect(config.MONGODB_URI)
    .then(() => console.log('Database Connected !'))
    .catch((err) => console.log('Error connecting!', err));


function verifyToken(req, res, next) {
    // Get Auth Header
    const bearerHeader = req.headers.authorization;

    if (typeof bearerHeader !== "undefined" || bearerHeader !== null) {
    // Split at space get token
        const bearer = bearerHeader.split(" ");

        const bearerToken = bearer[1];

        req.token = bearerToken;
        next();
    } else {
    // Forbidden
        res.sendStatus(403);
    }
}


app.post("/register", function(req, res, next){
    const {username, password} = req.body;

    const query = UserSchema.where({ username });

    console.log("registering...", username, password);
    
    query.findOne((err, user) => {
        if (user) {
        res.send({ message: "User Already Exists" });
        } else {
        bcryptjs.hash(password, 10, (err, hash) => {
            const token = jwt.sign({ username }, config.SESSION_SECRET);

            const User = new UserSchema({
            username,
            password: hash,
            token,
            }).save();
        });
        res.send({ username });
        }
    });
})


app.post("/login", function(req,res,next){
    const {username, password} = req.body;

    console.log("logging in...",username, password);

    const query = UserSchema.where({ username });

    query.findOne((err, user) => {
      if (user) {
        bcryptjs.compare(password, user.password).then((data) => {
          if (data) {
            const token = jwt.sign({ user }, config.SESSION_SECRET, {
              audience: username,
            });
  
            res.send({ token, ok: true, username });
          } else {
            res.send({ ok: false, message: "Incorrect Password" });
          }
        });
      }
      if (user == null) {
        res.send({ ok: false, message: "User Does Not Exist" });
      }
    });
})

app.get("/get-posts/:username", verifyToken, function(req,res,next){
    const username = req.params.username;
    var todos = [];
    jwt.verify(
        req.token,
        "asdfasdf",
        { audience: username },
        (err, auth) => {
            if (err) {
                res.sendStatus(403);
            } else {
                const query = PostSchema.find({ username: username });
                query.exec((err, docs) => {
                    if (docs) {
                    
                        res.send({ ok: true, docs });
                    } else {
                    
                        res.send({ ok: false });
                    }
                });        
               
            }
        }
    );
});

app.post("/create-post", verifyToken, function(req, res, next){
    const {description, dueDate, status, username} = req.body;
   

    jwt.verify(
        req.token,
        "asdfasdf",
        { audience: username },
        (err, auth) => {
            if (err) {
                console.log(err);
                res.sendStatus(403);
            } else {
                try{
                 
                    const post =  new PostSchema({
                        description,
                        username,
                        dueDate,
                        status
                      }).save()

                    console.log("post created...");
        
                    res.send({ok: true});
                }catch(err){
                    console.log(err);
                    res.send({ok: false});
                }
            }
        }
    );
});