const express = require("express");
const path = require("path");
const uniqid = require("uniqid");
const reviewsRouter = express.Router();
const { writeReviews, getReviews, getMedia } = require("../../lib/utils");
const axios = require("axios"); //library to create http request (similar to browser's fetch). Can be used in FE & BE
const multer = require("multer");
const upload = multer({});
const { check, validationResult } = require("express-validator");

const reviewValidation = [
  check("comment").exists().withMessage("A review with text is required"),
  check("rate")
    .isFloat({ min: 1, max: 5 })
    .exists()
    .withMessage("Review with a number 1-5"),
];

//1. Get All reviews
reviewsRouter.get("/", async (req, res, next) => {
  try {
    let reviews = await getReviews();
    console.log(req.query);

    if (Object.keys(req.query).length > 0) {
      for (key in req.query) {
        reviews = reviews.filter(
          review => review[key].toString() === req.query[key].toString()
        );
        console.log(reviews);
      }
      res.send(reviews);
    } else {
      res.send(reviews);
    }
  } catch (error) {
    next(error);
  }
});

//Get specific review
reviewsRouter.get("/:reviewId", async (req, res, next) => {
  try {
    const reviews = await getReviews();
    const review = reviews.filter(review => review._id === req.params.reviewId);
    if (review.length > 0) {
      console.log(review);
      res.send(review);
    } else {
      const err = new Error();
      err.httpStatusCode = 404;
      next(err);
    }
  } catch (error) {
    next(error);
  }
});

//adding a review
reviewsRouter.post("/", reviewValidation, async (req, res, next) => {
  console.log(req.body);
  try {
    const errors = validationResult(req);
    const media = await getMedia();
    const exists = media.find(medium => medium.imdbID === req.body.elementId);
    console.log(exists, errors);
    if (errors.isEmpty()) {
      if (exists) {
        const reviews = await getReviews();
        const newReview = {
          ...req.body,
          createdAt: new Date(),
          _id: uniqid(),
        };
        reviews.push(newReview);
        writeReviews(reviews);
        res.status(201).send(newReview);
      }
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//editing a review

reviewsRouter.put("/:reviewId", reviewValidation, async (req, res, next) => {
  try {
    const reviews = await getReviews();

    const updatedReview = reviews.map(review =>
      review._id === req.params.reviewId
        ? {
            ...review,
            ...req.body,
            elementId: review.elementId,
            updatedAt: new Date(),
          }
        : review
    );
    writeReviews(updatedReview);
    res.send(updatedReview);
  } catch (error) {
    next(error);
  }
});

//deleting a review

reviewsRouter.delete("/:reviewId", async (req, res, next) => {
    try {
        const reviews = await getReviews();
        const filteredReviews = reviews.filter(
        review => review._id !== req.params.reviewId
      );
      writeReviews(filteredReviews);
      res.send("This review has been deleted");

    } catch (error) {
        console.log(error);
      next(error);
    }
  });


module.exports = reviewsRouter;
