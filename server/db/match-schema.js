import mongoose from "mongoose";

const matchSchema = new mongoose.Schema({
  ID: { type: String, required: true, unique: true },
  accountIds: { type: Object, required: true },
  demoUrl: { type: String, required: true },
  matchResult: { type: Number, required: true },
  demoFileName: { type: String, required: true },
  kills: { type: Object, required: true },
  deaths: { type: Object, required: true },
  mvps: { type: Object, required: true },
  scores: { type: Object, required: true },
  teamScores: { type: Object, required: true },
  headshots: { type: Object, required: true },
  matchtime: { type: Number, required: true },
  accountId: { type: Number, required: true },
  parsedData: { type: Object, required: false }
});

export default matchSchema;