const { products, genres_detail, reviews_detail, reviews } = require('../models');
const { Op } = require('sequelize');

exports.getDetailProducts = async (req, res, next) => {
    try {
        const title = req.query.title;
        const author = req.query.author;
        const price = req.query.price;
        const genre = req.query.genre;

        let whereClause = {};

        if (title || author || price || genre) {
            whereClause = {
                [Op.and]: []
            };

            if (title) {
                whereClause[Op.and].push({
                    title_book: {
                        [Op.like]: `%${title}%`
                    }
                });
            }

            if (author) {
                whereClause[Op.and].push({
                    author: {
                        [Op.like]: `%${author}%`
                    }
                });
            }

            if (price) {
                whereClause[Op.and].push({
                    price: {
                        [Op.lte]: price
                    }
                });
            }
            if (genre) {
                whereClause[Op.and].push({
                    [Op.or]: [
                        {
                            genre_id: {
                                [Op.like]: `%${genre}%`
                            }
                        },
                        {
                            '$genre.genre_name$': {
                                [Op.like]: `%${genre}%`
                            }
                        }
                    ]
                });
            }
        }
        const getProducts = await products.findAll({
            where: whereClause,
            include: [
                {
                    model: genres_detail,
                    as: 'genre',
                    attributes: ['genre_id', 'genre_name']
                },
                {
                    model: reviews,
                    as: 'review',
                    attributes: ['review_id', 'avgRating'],
                    include: [
                        {
                            model: reviews_detail,
                            as: 'views',
                            attributes: ['rating', 'comment']
                        },
                    ]
                }
            ]
        });

        if (getProducts.length === 0) {
            return res.status(404).send({
                message: `No products found`
            });
        }

        res.status(200).send({
            message: 'Data retrieved',
            data: getProducts
        });
    } catch (error) {
        return res.status(500).send({
            error: error.message || 'Internal server error'
        });
    }
};

exports.getProductsList = async (req, res, next) => {

    try {
        const getProductDetail = await products.findAll({})

        res.status(200).send({
            message: 'Data retrieved',
            data: getProductDetail
        });

    } catch (error) {
        return res.status(500).send({
            error: error.message || 'Internal server error'
        });

    }
} 