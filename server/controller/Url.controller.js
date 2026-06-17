const url = require("../models/Url.model");
const { nanoid } = require("nanoid");

// route to create a short URL

exports.createShortUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ error: "Original URL is required" });
    }

    try {
      new URL(originalUrl);
    } catch (error) {
      return res.status(400).json({ error: "Invalid original URL" });
    }

    let shortId;
    let exists = true;

    while (exists) {
      shortId = nanoid(8);
      exists = await url.findOne({ shortUrl: shortId });
    }

    const newurl = await url.create({
      originalUrl,
      shortUrl: shortId,
      clicks: 0,
    });

    const shortUrl = `${req.protocol}://${req.get("host")}/${shortId}`;

    res.status(201).json({
      originalUrl: newurl.originalUrl,
      shortUrl: shortUrl,
      
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.redirectUrl = async (req, res) => {
  try {
    const { shortId } = req.params;
    const foundurl = await url.findOne({ shortUrl: shortId });

    if (!foundurl) {
      return res.status(404).json({ error: "URL not found" });
    }

    foundurl.clicks += 1;
    await foundurl.save();

    return res.redirect(foundurl.originalUrl);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
