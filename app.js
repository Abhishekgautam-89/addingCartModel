const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const User = require('./models/user')
const Product = require('./models/product')
const Cart = require('./models/cart')
const CartItem = require('./models/cart-item')

const errorController = require('./controllers/error');

const sequelize = require('./util/database');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const { ADDRGETNETWORKPARAMS } = require('dns');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

// app.post('/user', async (req, res, next)=>{
//     try{
//         const userName = req.body.name;
//         const email = req.body.email;
//         const phone = req.body.phone;

//         const data = User.create({ 
//             userName : userName,
//             email : email,
//             phone : phone
//         })
//         res.status(201).json({userDetails:data})
//     }
//     catch (err){ 
//     res.status(500).json({error:err})};    
// })

app.use((req, res, next)=>{
    User.findByPk(1)
    .then(user=>{
        req.user=user;
        next();
    })
    .catch(err=>{
        console.log(err)
    })
});

app.use(errorController.get404);

Product.belongsTo(User, {constraints: true, onDelete:'CASCADE'});
User.hasMany(Product); 
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, {through :CartItem});
Product.belongsToMany(Cart, {through :CartItem} );

sequelize
// .sync({force:true})
.sync()
.then (result=>{
    // return User.findAll({where:{id:1}})
    return User.findByPk(1);
})
.then((user)=>{
    if(!user){
        return User.create({name: 'akg', email:'test@test.com' })
    }
    return user    
})
.then((user)=>{
    // console.log(user) 
    return user.createCart();    
})
.then(cart=>{
    app.listen(3000);
})
.catch(err=>console.log(err))

