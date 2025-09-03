const mongoose = require("mongoose");
const crypto = require("crypto");

const invitationSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      select: false, // don’t return token by default (security)
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    role: {
      type: String,
      enum: ["employee", "manager", "admin"],
      default: "employee",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL index: auto-delete after expiresAt
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    usedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    usedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// 🔑 Helper: Generate & hash token
invitationSchema.methods.setToken = function () {
  const rawToken = crypto.randomBytes(32).toString("hex");
  this.token = crypto.createHash("sha256").update(rawToken).digest("hex");
  return rawToken; // return raw token so you can send it in link
};

// 🔍 Helper: Compare token
invitationSchema.statics.findByToken = async function (rawToken) {
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
  return this.findOne({ token: hashedToken });
};

module.exports = mongoose.model("Invitation", invitationSchema);
