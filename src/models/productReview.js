const Sequelize = require('sequelize')
const sequelize = require('../helpers/sequelize')
// const Products = require('./products')
// const Users = require('./users')

const ProductReview = sequelize.define('product_reviews', {
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'User Id must be fill'
      },
      isInt: {
        msg: 'User Id must be integer'
      },
      notNull: {
        msg: 'User Id must be fill'
      }
    }
    // references: {
    //   model: Users,
    //   key: 'id'
    // }
  },
  productId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Product Id must be fill'
      },
      isInt: {
        msg: 'Product Id must be integer'
      },
      notNull: {
        msg: 'Product Id must be fill'
      }
    }
    // references: {
    //   model: Products,
    //   key: 'id'
    // }
  },
  comment: {
    type: Sequelize.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Comment must be fill'
      },
      notNull: {
        msg: 'User Id must be fill'
      }
    }
  },
  parentId: {
    type: Sequelize.INTEGER,
    allowNull: true,
    validate: {
      isInt: {
        msg: 'Parent Id must be integer'
      }
    }
  }
})

ProductReview.belongsTo(require('./users'), {
  foreignKey: 'userId'
})
ProductReview.belongsTo(ProductReview, {
  as: 'replies',
  foreignKey: 'parentId'
})

module.exports = ProductReview
