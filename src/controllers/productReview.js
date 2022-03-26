const { inputValidator, nullDetector } = require('../helpers/requestHandler')
const { responseHandler } = require('../helpers/responseHandler')
const ProductReview = require('../models/productReview')
const Products = require('../models/products')
const Users = require('../models/users')

exports.createReview = async (req, res) => {
  try {
    const user = await Users.findByPk(req.body.userId)
    if (!user) {
      return responseHandler(res, 404, 'User not found')
    }
    const product = await Products.findByPk(req.body.productId)
    if (!product) {
      return responseHandler(res, 404, 'Product not found')
    }
    const pReview = await ProductReview.create(req.body)
    return responseHandler(res, 200, 'Review Created', pReview)
  } catch (err) {
    const error = err.errors.map(err => ({ field: err.path, message: err.message }))
    if (error) {
      return responseHandler(res, 500, 'Unexpected error', null, error)
    } else {
      return responseHandler(res, 500, 'Unexpected error')
    }
  }
}

exports.deleteReview = async (req, res) => {
  try {
    const review = await ProductReview.findByPk(req.params.id)
    if (!review) {
      return responseHandler(res, 404, 'Data not found')
    }
    await review.destroy()
    return responseHandler(res, 200, 'Review Deleted', review)
  } catch (err) {
    const error = err.errors.map(err => ({ field: err.path, message: err.message }))
    if (error) {
      return responseHandler(res, 500, 'Unexpected error', null, error)
    } else {
      return responseHandler(res, 500, 'Unexpected error')
    }
  }
}

exports.updateReview = async (req, res) => {
  try {
    const pReview = await ProductReview.findByPk(req.params.id)
    if (!pReview) {
      return responseHandler(res, 404, 'Data not found')
    }
    for (const key in req.body) {
      pReview[key] = req.body[key]
    }
    await pReview.save()
    return responseHandler(res, 200, 'Review Updated', pReview)
  } catch (err) {
    const error = err.errors.map(err => ({ field: err.path, message: err.message }))
    if (error) {
      return responseHandler(res, 500, 'Unexpected error', null, error)
    } else {
      return responseHandler(res, 500, 'Unexpected error')
    }
  }
}

exports.addReview = async (req, res) => {
  try {
    const { id: userId } = req.user

    const rules = {
      productId: 'required|number',
      comment: 'required|string',
      parentId: 'number'
    }

    const data = inputValidator(req.body, rules)

    const error = nullDetector(data, rules)
    if (error) {
      return responseHandler(res, 400, error)
    }

    const product = await Products.findByPk(data.productId)

    if (!product) {
      return responseHandler(res, 404, 'Product not found')
    }

    if (data.comment.length > 200) {
      return responseHandler(res, 400, 'Max comment length is 200')
    }

    if (data.parentId) {
      const parent = await ProductReview.findByPk(data.parentId)

      if (!parent) {
        return responseHandler(res, 404, 'Review not found')
      }
    }

    const review = await ProductReview.create({
      userId,
      ...data
    })

    const newReview = await ProductReview.findByPk(review.id, {
      attributes: {
        exclude: ['userId']
      },
      include: [
        {
          model: Users,
          attributes: ['id', 'name', 'image']
        }
      ]
    })

    return responseHandler(res, 200, 'Review Created', newReview)

    // return responseHandler(res, 200, 'Not implemented')
  } catch (err) {
    console.error(err)

    if (err.errors) {
      const error = err.errors.map(err => ({ field: err.path, message: err.message }))
      if (error) {
        return responseHandler(res, 500, 'Error while adding review', null, error)
      } else {
        return responseHandler(res, 500, 'Unexpected error')
      }
    } else {
      return responseHandler(res, 500, 'Error occured')
    }
  }
}

exports.getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params

    const product = await Products.findByPk(productId)

    if (!product) {
      return responseHandler(res, 404, 'Product not found')
    }

    const reviews = await ProductReview.findAll({
      where: {
        productId,
        parentId: null
      },
      attributes: ['id', 'userId', 'comment', 'createdAt'],
      include: [
        {
          model: Users,
          attributes: ['name', 'image']
        },
        {
          model: ProductReview,
          as: 'replies',
          attributes: ['id', 'userId', 'comment', 'createdAt']
        }
      ]
    })

    return responseHandler(res, 200, `Reviews for ${product.name}`, reviews)
  } catch (err) {
    console.error(err)

    if (err.errors) {
      const error = err.errors.map(err => ({ field: err.path, message: err.message }))
      if (error) {
        return responseHandler(res, 500, 'Error while getting reviews', null, error)
      } else {
        return responseHandler(res, 500, 'Unexpected error')
      }
    } else {
      return responseHandler(res, 500, 'Error occured while getting reviews')
    }
  }
}
