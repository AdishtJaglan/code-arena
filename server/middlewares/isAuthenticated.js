import passport from "../config/passport.js";

export default passport.authenticate("jwt", { session: false });
