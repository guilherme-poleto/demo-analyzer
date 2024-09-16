import mongoose from "mongoose";
import matchSchema from "./match-schema.js";

class DBConnection {
    Match = mongoose.model("matches", matchSchema);
    constructor(dbUrl) {
        mongoose
            .connect(dbUrl)
            .then(() => {
                console.log("Connected to MongoDB");
            })
            .catch((err) => {
                console.error("Error while connecting to MongoDB", err);
            });
    }

    async saveNewMatches(matchesList) {
        try {
            await this.Match.insertMany(matchesList, { ordered: false });
        } catch (error) {
            if (error.code === 11000) {
                console.log("Match already saved.");
            }
        }
    }

    deleteAllRecords() {
        return this.Match.deleteMany({});
    }

    getAllMatches() {
        return this.Match.find({}).sort({ matchtime: -1 });
    }

    getMatchById(id) {
        return this.Match.findOne({ ID: id });
    }

    updateMatch(id, field) {
        return this.Match.updateOne(
            { ID: id },
            { $set: field }
        );
    }
}

export default DBConnection;
