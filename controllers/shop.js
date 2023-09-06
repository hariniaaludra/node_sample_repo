const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.findAll().then(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  }).catch(err => console.log('Error', err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findByPk(prodId).then(product => {
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products'
    });
  }).catch(err => console.log('Error while finding single product>>>> ', err));
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    }).catch(err => console.log('Error', err));
}


exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(cart => {
      return cart
        .getProducts()
        .then(cartProducts => {
          res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            products: cartProducts
          })
        }).catch(err => {
          console.log('Error on getting prduct from cart ==> ', err);
        });
    }).catch(err => {
      console.log('Error on get cart==> ', err);
    });;
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fectchedCart;
  let newQuentity = 1;
  req.user.getCart()
    .then(cart => {
      fectchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(product => {
      let oldProduct;
      if (product.length > 0) {
        oldProduct = product[0];
      }
      if (oldProduct) {
        newQuentity = oldProduct.cartItem.quantity + 1;
        return oldProduct;
      }
      return Product.findByPk(prodId);
    })
    .then(product => {
      fectchedCart.addProduct(product, { through: { quantity: newQuentity } });
    })
    .then(item => {
      res.redirect('/cart');
    })
    .catch(err => console.log("==>", err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(product => {
      return product[0].cartItem.destroy();
    })
    .then(data => { res.redirect('/cart'); }
    )
    .catch(err => {
      console.log('====> ', err);
    });

};

exports.postOrder = (req, res, next) => {
  let fectchedCart;
  req.user.getCart()
    .then(cart => {
      fectchedCart = cart;
      return cart.getProducts();
    })
    .then(products => {
      return req.user
        .createOrder()
        .then(order => {
          return order.addProducts(
            products.map(
              product => {
                product.orderItem = { quantity: product.cartItem.quantity };
                return product;
              })
          );
        })
        .catch(err => {
          console.log("Error on 1st catch>>>>>>. ", err)
        });
    })
    .then(result => {
      return fectchedCart.setProducts(null);
    })
    .then(result => {
      return res.redirect('/orders');
    })
    .catch(err => {
      console.log("Error on 2nd catch>>>>>>. ", err)
    });
};

exports.getOrders = (req, res, next) => {

  req.user
    .getOrders({include:['products']})
    .then(orders => {
      
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders:orders
      });
    })
    .catch();


};


