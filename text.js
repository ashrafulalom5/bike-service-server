 //post method for admin data;

 app.post("/addAdmin", (req, res) => {
    // const file = req.files.file;
    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;
    const newImg = req.files.file.data;
    const encImg = newImg.toString("base64");
    var image = {
      contentType: req.files.file.mimetype,
      size: req.files.file.size,
      img: Buffer.from(encImg, "base64"),
    };

    serviceCollection
      .insertOne({ title, description, image, price })
      .then((result) => {
        res.send(result.insertedCount > 0);
      });
  });

   //post method for set admin;
   app.post("/setAdmin", (req, res) => {
    const adminInfo = req.body;
    // console.log(adminInfo);
    adminCollection.insertOne(adminInfo)
    .then((result) => {
      console.log(result);
      res.send(result);
    });
  });


  //post method for user data;

  app.post("/placeService", (req, res) => {
    const status = req.body.status;
    const name = req.body.name;
    const email = req.body.email;
    const price = req.body.price;
    const service = req.body.service;
    const description = req.body.description;

    collection
      .insertOne({
        name,
        email,
        price,
        service,
        description,
        status,
      })
      .then((result) => {
        res.send(result.insertedCount > 0);
      });
  });

  //post method for review;
  app.post("/review", (req, res) => {
    const name = req.body.name;
    const newFile = req.body.newFile;
    const description = req.body.description;
    const designation = req.body.designation;
    const newImg = req.files.file.data;
    const encImg = newImg.toString("base64");
    var img = {
      contentType: req.files.file.mimetype,
      size: req.files.file.size,
      img: Buffer.from(encImg, "base64"),
    };
    reviewCollection
      .insertOne({ name, description, designation, img, newFile })
      .then((result) => {
        console.log(result);
        res.send(result);
      });
  });

 

  //get method for review
  app.get("/seeReview", (req, res) => {
    reviewCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/seeService", (req, res) => {
    serviceCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/seeParticularService", (req, res) => {
    const newUser = req.query.email;
    serviceCollection.find({ email: newUser }).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/seeAllService", (req, res) => {
    serviceCollection.find({}).toArray((err, documents) => {
     console.log(documents);
    });
  });

  app.get("/admin", (req, res) => {
    const email = req.query.email;

    adminCollection.find({ email }).toArray((err, collection) => {
      res.send(collection.length > 0);
    });
  });

  //patch method;
  app.patch("/updateSurviceById/:id", (req, res) => {
    serviceCollection
      .updateOne(
        { _id: ObjectID(req.params.id) },
        {
          $set: { status: req.body.status },
        }
      )
      .then((result) => {
        res.send(result.modifiedCount > 0);
      });
  });

  const calculateOrderAmount = (items) => {
    // Replace this constant with a calculation of the order's amount
    // Calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client
    return 1400;
  };

  app.post("/create-payment-intent", async (req, res) => {
    const { items } = req.body;
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(items),
      currency: "usd",
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  });