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

  req.user.createProduct({
    title: title,
    img_url: imageUrl,
    description: description,
    price: price
  }).then(result => {
    console.log("Product created");
    res.redirect('/admin/products')
  })
    .catch(err => console.log('/Controller/Admin.js create prod ===>  ', err));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  req.user.getProducts({ where: { id: prodId } })
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product
      });
    }).catch(err => console.log('Error while fectching one product in admin.js =====>', err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  Product.findByPk(prodId)
    .then(product => {
      product.title = updatedTitle;
      product.description = updatedDesc;
      product.img_url = updatedImageUrl;
      product.price = updatedPrice;
      return product.save();
    })
    .then(result => {
      console.log('Product updated');
      res.redirect('/admin/products');
    })
    .catch(err => console.log('Error while updating product in admin.js =====>', err));
};

exports.getProducts = (req, res, next) => {
  req.user.getProducts()
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    }).catch(err => console.log('Error while fectching all product in admin.js =====>', err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId)
    .then(product => {
      return product.destroy();
    }).then(result => {
      res.redirect('/admin/products');
    }).catch(err => {
      console.log('Error while deleting product ==> ', err)
    });
};
