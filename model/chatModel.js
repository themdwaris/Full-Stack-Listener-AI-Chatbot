import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "ai"],
      required: true,
    },
    text: {
      type: String,

      default: "",
    },
    image: { type: String, default: null },
   
  },
  { timestamps: true },
);

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      default: "New chat",
    },
    messages: [messageSchema],
  },
  { timestamps: true },
);

const ChatModel = mongoose.models.Chat || mongoose.model("Chat", chatSchema);
export default ChatModel;
