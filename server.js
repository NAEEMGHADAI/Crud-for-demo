// server.js
const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const dotenv = require("dotenv").config();

const connectionString = process.env.MONGO_URI;
const app = express();

MongoClient.connect(connectionString, { useUnifiedTopology: true })
	.then((client) => {
		console.log("Connected to Database");
		const db = client.db("star-wars-quotes");
		const quotesCollection = db.collection("quotes");

		app.set("view engine", "ejs");
		app.use(express.urlencoded({ extended: true }));
		app.use(express.static("public"));
		app.use(express.json());

		app.get("/", (req, res) => {
			quotesCollection
				.find()
				.toArray()
				.then((result) => {
					console.log(result);
					res.render("index.ejs", { quotes: result });
				})
				.catch((err) => {
					console.log(err);
				});
		});

		app.post("/quotes", (req, res) => {
			quotesCollection
				.insertOne(req.body)
				.then((result) => {
					console.log(result);
					res.redirect("/");
				})
				.catch((err) => {
					console.log(err);
				});
			// console.log(req.body); //ask about body parser what does it do?
		});
		app.put("/quotes", (req, res) => {
			console.log(req.body);
			quotesCollection
				.findOneAndUpdate(
					{ name: "Yoda" },
					{
						$set: {
							name: req.body.name,
							quote: req.body.quote,
						},
					},
					{
						upsert: true,
					}
				)
				.then((result) => {
					console.log(result);
					res.json("Success");
				})
				.catch((err) => {
					console.log(err);
				});
		});

		app.delete("/quotes", (req, res) => {
			console.log(req.body);
			quotesCollection
				.deleteOne({ name: req.body.name })
				.then((result) => {
					console.log(result);
					if (result.deletedCount === 0) {
						res.json("No quote to delete");
					}
					res.json("Deleted Darth Vader's quote");
				})
				.catch((err) => {
					console.log(err);
				});
		});
		app.listen(3000, () => {
			console.log("listening on port 3000");
		});
	})
	.catch((err) => {
		console.log(err);
	});
