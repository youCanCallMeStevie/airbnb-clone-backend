const express = require("express");
const fs = require("fs");
const path = require("path");
const uniqid = require("uniqid");
const multer = require("multer");
const cloudinary = require("cloudinary").v2
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { getReviews, getListings, writeListings } = require("../../lib/utils");
const { join } = require("path");
const { check, validationResult } = require("express-validator");
const listingValidation = [
   
  ];
const sgMail = require("@sendgrid/mail")

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "listings",
  },
});
const cloudinaryMulter = multer({ storage: storage });

const router = express.Router();


router.get("/", async (req, res, next) => {
  try {
    const catalogue = await getListings("listings.json");
    if (catalogue) {
      res.send(catalogue);
    } else
      res.send("404 - Nothing seems to be here. Try to post something first.");
  } catch (error) {
    console.log(error);
    next(error);
  }
});



module.exports = router;