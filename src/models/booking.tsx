import mongoose, { Schema, models } from "mongoose";
import {BSONType} from "bson";

const bookingSchema = new Schema({
    studentNumber: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    devBooking: {
        type: Boolean,
        required: true,
    },
    podPreference: {
        type: Number,
        required: false,
    },
    eventId: {
        type: String,
        required: true,
    },
    icsUid: { 
        type: String,
        required: true,
    },
    }, {timestamps: true}
);

const Booking = models.Booking || mongoose.model('Booking', bookingSchema);
export default Booking;