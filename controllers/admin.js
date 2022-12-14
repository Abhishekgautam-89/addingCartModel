const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};


exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  // using sequelize
  req.user.createProduct({
    title: title,
    description: description,
    price: price,
    imageUrl: imageUrl
  })
   .then(result=>{
    console.log('Product Created')
    res.redirect('/admin/products')
  })  
  .catch(err=>console.log(error))
  // normal mysql method
  // const product = new Product(null, title, imageUrl, description, price);
  // product.save()
  // .then(()=>{res.redirect('/')})
  // .catch(err=>console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  // findById is not working
  req.user.getProducts({where:{id:prodId}})
  // Product.findByPk(prodId)  
  .then( products => {
    const product = products[0];
    console.log(product);
    if (!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    });
  })
  .catch(err=>console.log(err))
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  Product.findByPk(prodId)
  .then(product=>{
    product.title=updatedTitle;
    product.price=updatedPrice;
    product.imageUrl=updatedImageUrl;
    product.description=updatedDesc;
    return product.save();
    }
  )
  .then(product=>{
    console.log(product);
    res.redirect('/admin/products');
  })
  .catch(err=>console.log(err))  
};

exports.getProducts = (req, res, next) => {
  // Sequelize method
  req.user.getProducts()
  // Product.findAll()
  .then((products)=>{
    res.render('admin/products', {
    prods: products,
    pageTitle: 'Admin Products',
    path: '/admin/products'
    });
})
  .catch(err=>{console.log(err)})
  // MYSQL method
  // Product.fetchAll().then(([products])=>{
  //     res.render('admin/products', {
  //     prods: products,
  //     pageTitle: 'Admin Products',
  //     path: '/admin/products'
  //     });
  // })
  // .catch(err=>{
  //   console.log(err)
  // })
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  // sequelize method
  Product.destroy({where:{id:prodId}})
  .then(result=>{
      console.log('Product Deleted');
      res.redirect('/admin/products');})
      

    // Product.findAll({where:{id:prodId}})
    // .then(product=>{
    //   // console.log(product)
    //   return product.destroy();
    // })
    // .then(result=>{
    //   // console.log('Product Deleted');
    //   res.redirect('/admin/products');
    // })
   .catch(err=>console.log(err))
  // MYSQL method
  // Product.deleteById(prodId)
  // .then(()=>{
  //   res.redirect('/admin/products');
  // })
  // .catch(err=>console.log(err))  
};
