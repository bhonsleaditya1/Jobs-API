require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();

//extra security packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')
const morgan = require('morgan')

const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')
const docs = YAML.load('./swagger-docs.yaml')

const authRouter  = require('./routes/auth')
const jobsRouter = require('./routes/jobs')
const connectDB  = require('./db/connect')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy',1)
app.use(
  rateLimiter({
    windowMs:15*60*1000,
    max:100
  })
)

app.use(express.json());
// extra packages
app.use(helmet())
app.use(cors())
app.use(xss())
app.use(morgan("combined"))


// routes
app.get('/', (req, res) => {
  res.send('<h1>Jobs API</h1><a href="/api-docs">Documentation</a>');
});

app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(docs))

app.use('/api/v1/jobs',jobsRouter)
app.use('/api/v1/auth',authRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
