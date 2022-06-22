import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import AuthRoute from "./routes/AuthRoute.js";
import UserRoute from "./routes/UserRoute.js";
import PostRoute from "./routes/postRoute.js";


const app = express();

// Middlewares
app.use(express.json({
  limit: '30mb', //Limit the size of http request in the body
  inflate: true
}));

app.use(express.urlencoded({
  limit: '30mb',
  inflate: true,
  extended: true
}));

mongoose.connect(process.env.MONGO_URI, {})
  .then( () => {
    app.listen(process.env.PORT, () => console.log(`Listening at ${process.env.PORT}`));
  })
  .catch((error) => console.log(error));

// usage of routers
app.use('/auth', AuthRoute);
app.use('/user', UserRoute);
app.use('/post', PostRoute);
