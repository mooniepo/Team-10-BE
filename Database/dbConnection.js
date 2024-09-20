import mongoose from "mongoose";

export function dbConnection() {
  mongoose
    .connect("mongodb+srv://sarah01:sarahadmin123456@cluster0.6riev.mongodb.net/digistar?retryWrites=true&w=majority&appName=cluster0")
    .then(() => {
      console.log("DB Connected Succesfully");
    })
    .catch((error) => {
      console.log("DB Failed to connect", error);
    });
}


//Use this is postman https://ecommerce-backend-codv.onrender.com/api/v1/auth/signup

