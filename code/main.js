var express = require('express')
var app = express()

const ObjectId = require('mongodb').ObjectId;

app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))


var MongoClient = require('mongodb').MongoClient
var url = 'mongodb+srv://phuonganh:phuonganh244@cluster0.55amjub.mongodb.net/test'


//***88888*******index****************/
app.get('/index', async (req, res)=>{
    let server = await MongoClient.connect(url)
    let dbo = server.db("ATNToys")
    let products = await dbo.collection('product').find().toArray()
    res.render('homepage', {'products':products})
})


//**************search***********//
app.post('/search', async(req, res)=>{
    let name = req.body.txtSame 
    let server = await MongoClient.connect(url)
    let dbo = server.db("ATNToys")
    let products = await dbo.collection('product').find({'name':new RegExp(name, 'i')}).toArray()
    res.render('homepage', {'products':products})
})


//**************Create***********//
app.get('/insert', (req, res)=>{
    res.render("newProduct")
})
app.post('/newProduct', async (req, res)=>{
    let name = req.body.txtName
    let price = req.body.txtPrice
    let picture = req.body.txtPicture
    let description = req.body.txtDescription
    
    if(name.length < 1){
        res.render('newProduct',{'nameError': 'Cannot be left blank'})
        return
    }


    let product = {
        'name':name,
        'price':price,
        'picture':picture,
        'description':description
    }

    let server = await MongoClient.connect(url)
    let dbo = server.db("ATNToys")
    await dbo.collection("product").insertOne(product)
    res.redirect('/index')   
})
// //eps kieeur thanhf objiect id
//laays ra id đặt vào đối tượng req trong thuộc tính params. trungf vs id treen url



//***************Update*************/
app.get('/update/:_id', async (req, res) => {
    var id = req.params._id;
    var id2 = new ObjectId(id);

    let server = await MongoClient.connect(url) 
    let dbo = server.db("ATNToys")
    let products = await dbo.collection('product').find({ '_id': id2}).limit(1).toArray()
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
    await dbo.collection("product").updateOne(product),
    {$set:{'_id': good_id,'name': name, 'price': price, 'picture': picture, 'description': description}}
    res.redirect('/index')
})

//**************Delete**************/
app.get('/delete/:_id', async (req, res) => {
    //transform your param into an ObjectId
    var id = req.params._id;
    var id2 = new ObjectId(id);

    let server = await MongoClient.connect(url) 
    let dbo = server.db("ATNToys")
    await dbo.collection('product').deleteOne({'_id': id2})
    res.redirect('/index')
})


const PORT = process.env.PORT || 8000
app.listen(PORT)
console.log('Running..................')
