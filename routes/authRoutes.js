const express = require("express");
const router = express.Router();
const passport = require("passport");
//import models
const Signup = require("../models/Signup");
router.get("/signingup", (req, res) => {
  res.render("signup");
});

// Signup POST route
router.post("/signingup", async (req, res) => {
  try {
    const { email, role, branch, username, password, confirmPassword } = req.body;

    // Check if user already exists
    const existingUser = await Signup.findOne({ email });
    if (existingUser) {
      return res.status(400).send("Not registered, email already in use");
    }

    // Basic server-side validation
    if (!email || !role || !username || !password) {
      return res.status(400).send("All required fields must be filled");
    }

    // Validate branch only if not Director
    if (role !== "Director" && (!branch || branch.trim() === "")) {
      return res.status(400).send("Branch is required for this role");
    }

    // Optional: Validate password confirmation
    if (password !== confirmPassword) {
      return res.status(400).send("Passwords do not match");
    }

    // Prepare user object (conditionally include branch)
    const userData = { email, role, username };
    if (branch) userData.branch = branch;

    const newUser = new Signup(userData);

    await Signup.register(newUser, password, (error) => {
      if (error) {
        throw error;
      }
      res.redirect("/login");
    });

    console.log("User registered:", newUser);
  } catch (error) {
    console.error("Signup error:", error);
    res.status(400).render("signup");
  }
});
//these are the routes which will help Director to register users in our system

//these are the routes which will help Director to register users in our system
router.post("/admin", async (req, res) => {
  try {
    const { email, role, branch, username, password, confirmPassword } = req.body;

    // Checks if user already exists
    const existingUser = await Signup.findOne({ email });
    if (existingUser) {
      return res.status(400).send("Not registered, email already in use");
    }

    // Basic server-side validation
    if (!email || !role || !username || !password) {
      return res.status(400).send("All required fields must be filled");
    }

    // Validate branch only if not Director
    if (role !== "Director" && (!branch || branch.trim() === "")) {
      return res.status(400).send("Branch is required for this role");
    }

    // Optional: Validate password confirmation
    if (password !== confirmPassword) {
      return res.status(400).send("Passwords do not match");
    }

    // Prepare user object (conditionally include branch)
    const userData = { email, role, username };
    if (branch) userData.branch = branch;

    const newUser = new Signup(userData);

    await Signup.register(newUser, password, (error) => {
      if (error) {
        throw error;
      }
      res.redirect("/userlist");
    });

    console.log("User registered:", newUser);
  } catch (error) {
    console.error("Signup error:", error);
    res.status(400).render("admin");
  }
});
router.post("/register", async (req, res) => {
  try {
    const { email, role, branch, username, password, confirmPassword } = req.body;

    // Checks if user already exists
    const existingUser = await Signup.findOne({ email });
    if (existingUser) {
      return res.status(400).send("Not registered, email already in use");
    }

    // Basic server-side validation
    if (!email || !role || !username || !password) {
      return res.status(400).send("All required fields must be filled");
    }

    // Validate branch only if not Director
    if (role !== "Director" && (!branch || branch.trim() === "")) {
      return res.status(400).send("Branch is required for this role");
    }

    // Optional: Validate password confirmation
    if (password !== confirmPassword) {
      return res.status(400).send("Passwords do not match");
    }

    // Prepare user object (conditionally include branch)
    const userData = { email, role, username };
    if (branch) userData.branch = branch;

    const newUser = new Signup(userData);

    await Signup.register(newUser, password, (error) => {
      if (error) {
        throw error;
      }
      res.redirect("/ProducesList");
    });

    console.log("User registered:", newUser);
  } catch (error) {
    console.error("Signup error:", error);
    res.status(400).render("adduser");
  }
});



//login
router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  (req, res) => {
    console.log(req.body);
    req.session.user = req.user;
    if (req.user.role === "Manager") {
      res.redirect("/manager-dashboard");
    } else if (req.user.role === "Director") {
      res.redirect("/directordash");
    } else if (req.user.role === "SalesAgent") {
      res.redirect("/agent-dashboard");
    }
  }
);

router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((error) => {
      if (error) {
        return res.status(500).send(error, "Error logging out");
      }
      res.redirect("/");
    });
  }
});

//routes to get all users in the system.
router.get("/userlist", async (req, res) => {  
  try {
    const user = await Signup.find().sort({ $natural: -1 });
    res.render("userlists", {
      signups: user,
    });
  } catch (error) {
    res.status(400).send("unable to find items in the db");
  }
});


module.exports = router;
