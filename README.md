# Team 10 Prototype Backend

This is the source code for Team 10's backend project web service, which is a rating and review feature prototype for an e-commerce website. Using Node.js and Express as the primary framework for building RESTful APIs, the project also incorporates MongoDB as the database, JWT for authentication, and Mongoose for data modeling

## dependencies

```bash
bcrypt: 5.1.1,
cors: 2.8.5,
dotenv: 16.3.1,
express: 4.18.2,
joi: 17.9.2,
jsonwebtoken: 9.0.2,
mongoose: 7.4.4,
morgan: 1.10.0,
multer: 1.4.5-lts.1,
nodemon: 3.0.2,
qrcode: 1.5.3,
slugify: 1.6.6,
stripe: 13.9.0,
uuid: 9.0.1
```

## Endpoints
| Route          | Method | Description                      |
| -------------- | ------ | -------------------------------- |
| `auth/signup`  | POST   | Sign up                          |
| `auth/signin`  | POST   | Sign in                          |
| `coupons`      | POST   | Add point to buyer               |
| `coupons`      | GET    | Get buyer points                 |
| `coupons`      | PUT    | Update buyer points              |
| `products`     | POST   | Add product                      |
| `products/:id` | GET    | Get product by product id        |
| `orders/:id`   | POST   | Add order by product id          |
| `orders/:id`   | GET    | Get order by order id            |
| `orders/:id`   | PUT    | Update order by order id         |
| `orders`       | GET    | Get all orders                   |
| `review/:id`   | POST   | Add review by product id         |
| `review/:id`   | PUT    | Update review by review id       |
| `review/:id`   | GET    | Get review by review id          |
| `comments/:id` | POST   | Add comment by review id         |
| `comments/:id` | PUT    | Update comment by comment id     |
| `comments/:id` | GET    | Get comment by comment id        |



