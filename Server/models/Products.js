import mongoose from "mongoose";

const productsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    price: {
        type: Number,
        required: true,
    },

    sale: {
        type: Boolean,
        default: false,
    },

    salePrice: Number,

    stock: {
        type: Number,
        default: 0,
    },

    categories: [String],
    tags: [String],
    imgFolder: String,
}, {
    timestamps: true
});

export default mongoose.model("Products", productsSchema);

