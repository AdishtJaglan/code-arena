import mongoose from "mongoose";

const AccountabilityPartnerRequestSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["Accepted", "Rejected", "Pending"],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const AccountabilityPartnerRequest = mongoose.model(
  "AccountabilityPartnerRequest",
  AccountabilityPartnerRequestSchema
);
export default AccountabilityPartnerRequest;
