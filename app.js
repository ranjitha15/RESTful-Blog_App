var express = require('express');
var app = express();
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/blog');

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

//DEFINE BLOGSCHEMA
var blogSchema = new mongoose.Schema({
    title:String,
    image:String,
    body: String,
    created: {type: Date, default: Date.now}
});
//COMPILE BLOGSCHEMA TO A MODEL
var Blog = mongoose.model("Blog",blogSchema);
//RESTFUL ROUTES

app.get('/',function(req,res){
    res.redirect('/blogs');
});
//INDEX ROUTE
app.get('/blogs',function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log(err);
        }else{
            res.render("index",{blogs:blogs});
        }
    });
});
//NEW BLOG FORM
app.get("/blogs/new",function(req,res){
    res.render("new");
});
//CREATE BLOG & SUBMIT
app.post('/blogs',function(req,res){

    Blog.create(req.body.blog,function(err,newBlog){
        if(err){
            res.render("new");
        }else{
            res.redirect("/blogs");
        }
    });
});
//SHOW BLOGS
app.get('/blogs/:id',function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show",{blog:foundBlog});
        }
    });

});
//EDIT BLOGS
app.get('/blogs/:id/edit',function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit",{blog:foundBlog});
        }
    });
});
//UPDATE BLOG
app.put('/blogs/:id',function(req,res){
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/"+ req.params.id);

        }
    });
});
//DELETE BLOG
app.delete('/blogs/:id',function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err,deleteBlog){
        if(err){
            res.redirect('/blogs');
        }else{
            res.redirect("/blogs");
        }
    });
});
app.listen(8080,function(req,res){
    console.log("Server is running");
});
