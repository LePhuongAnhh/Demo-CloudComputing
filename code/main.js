var express = require('express')
var app = express()

const ObjectId = require('mongodb').ObjectId;

app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))


var MongoClient = require('mongodb').MongoClient
var url = 'mongodb+srv://phuonganh:phuonganh244@cluster0.55amjub.mongodb.net/test'






//**********index****************/
app.get('/index', async (req, res)=>{
    //1. kết nối đến server có địa chỉ trong url
    let server = await MongoClient.connect(url)
    //truy cập Database ATN
    let dbo = server.db("ATNToys")
    //get data
    let products = await dbo.collection('product').find().toArray()
    res.render('homepage', {'products':products})
})


//**************search***********//
app.post('/search', async(req, res)=>{
    let name = req.body.txtName 
    //1. kết nối đến server có địa chỉ trong url
    let server = await MongoClient.connect(url)
    //truy cập Database ATN
    let dbo = server.db("ATNToys")
    //get data
    let products = await dbo.collection('product').find({'name':new RegExp(name, 'i')}).toArray()
    res.render('homepage', {'products':products})
})


//**************Create***********//
app.post('/newProduct', async (req, res)=>{
    let name = req.body.txtName
    let price = req.body.txtPrice
    let picture = req.body.txtPicture
    let description = req.body.txtDescription
    
    if(name.length <= 5){
        res.render('newProduct',{'nameError': 'Name not less than five characters'})
        return
    }
    let product = {
        'name':name,
        'price':price,
        'picture':picture,
        'description':description
    }
    //1. kết nối đến server có địa chỉ trong url
    let server = await MongoClient.connect(url)
    //truy cập Database ATN
    let dbo = server.db("ATNToys")
    //insert product vào database
    await dbo.collection("product").insert(product)
    //quay lại trang home
    res.redirect('/homepage')
})
app.get('/insert', (req, res)=>{
    res.render("newProduct")
})

//***************Update*************/
app.get('/update/:_id', async (req, res) => {
    var id = req.params._id;
    var good_id = new ObjectId(id);
    let server = await MongoClient.connect(url) 
    let dbo = server.db("ATNToys")
    let products = await dbo.collection('product').find({ '_id': good_id}).limit(1).toArray()
    res.render('update', {'products': products[0]})
})
app.post('/edit/:_id', async (req, res) => {
    let name = req.body.txtName
    let price = req.body.txtPrice
    let picture = req.body.txtPicture
    let description = req.body.txtDescription
    var id = req.params._id;
    var good_id = new ObjectId(id);

    let server = await MongoClient.connect(url) 
    let dbo = server.db("ATNToys")
    await dbo.collection('product').updateOne({ '_id': good_id }, {$set:{'_id': good_id,'name': name, 'price': price, 'picture': picture, 'description': description}})
    res.redirect('/index')
})

//**************Delete**************/
app.get('/delete/:_id', async (req, res) => {
    //transform your param into an ObjectId
    var id = req.params._id;
    var id2 = new ObjectId(id);

    //1. kết nối đến server có địa chỉ trong url
    let server = await MongoClient.connect(url) // await là đợi công việc này hoàn thành mới làm công việc tiếp theo. 
    //phải có async mới dùng được await 
    //2. truy cập database ATNToys
    let dbo = server.db("ATNToys")
    await dbo.collection('product').deleteOne({'_id': id2})
    res.redirect('/index')
})
// app.get('/delete/:_id', async (req, res)=>{
//     //transform your param into an ObjectId
//     var id = req.params._id;
//     var id2 = new ObjectId(id);

//     //1. kết nối đến server có địa chỉ trong url
//     let server = await MongoClient.connect(url) // await là đợi công việc này hoàn thành mới làm công việc tiếp theo. 
//     //phải có async mới dùng được await 
//     //2. truy cập database ATNToys
//     let dbo = server.db("ATNToys")
//     let products = await dbo.collection('product').find({ '_id': id2}).limit(1).toArray()
//     res.render('delete', {'products': products[0]})
// })


const PORT = process.env.PORT || 5000
app.listen(PORT)
console.log('Running..................')