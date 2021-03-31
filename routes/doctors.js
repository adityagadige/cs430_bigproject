const express = require("express");
const router = express.Router();
const connect = require("../config/db");
const {
  isLoggedIn
} = require("../config/ensureAuth");


router.get("/viewDoc", isLoggedIn, (req, res) => {
  let status = req.query.status;
  if (status == 1) {
    //view Doctors
    let query = "SELECT * FROM doctor;";
    connect.query(query, (error, results, fields) => {
      if (error) {
        console.log(error);
        req.flash('error_msg', 'Error loading page!');
        res.redirect("/home");

      } else
        res.render("viewDoc", {
          rows: results,
          status: status
        });
    });
  } else if (status == 2) {
    let query = "SELECT p.ssn, p.name, p.birth_date, d.ssn as dssn, d.name as dname FROM pri_phy_patient p, doctor d where phy_ssn = d.ssn;";
    connect.query(query, (error, results, fields) => {
      if (error) {
        console.log(error);
        req.flash('error_msg', 'Error loading page!');
        res.redirect("/home");

      } else
        res.render("viewDoc", {
          rows: results,
          status: status
        });
    });
  }
});

router.route("/addDoc")
  .get(isLoggedIn, (req, res) => {
    res.render("addDoc");
  })
  .post(isLoggedIn, (req, res) => {
    let query = "insert into doctor(ssn,name,specialty,yearsOfExperience) values(?)";
    let values = [req.body.doc_ssn, req.body.doctor_name, req.body.spec, req.body.yearofexp];
    connect.query(query, [values], (error, result) => {
      if (error) {
        console.log(error);
        req.flash('error_msg', 'Error adding doctor!');
        res.redirect("./addDoc");

      } else {
        console.log("1 record inserted into Doctor");
        req.flash('success_msg', 'Doctor added successfully!');
        res.redirect("./addDoc");

      }
    });
  });

router.route("/removeDoc")
  .get(isLoggedIn, (req, res) => {
    let query = "SELECT * FROM doctor;";
    connect.query(query, (error, results, fields) => {
      if (error) {
        console.log(error);
        req.flash('error_msg', 'Error loading page!');
        res.redirect("/home");

      } else
        res.render("removeDoc", {
          rows: results
        });
    });
  })
  .post(isLoggedIn, (req, res) => {
    let post = {
      ssn: req.body.row_id
    };
    let query = "DELETE FROM doctor WHERE ?";
    connect.query(query, post, (error, result) => {
      if (error) {
        console.log(error);
        req.flash('error_msg', 'Error deleting doctor!');
        res.redirect("./removeDoc");

      } else {
        if (result.affectedRows == 0) {
          req.flash('error_msg', 'Error deleting doctor!');
          res.redirect("./removeDoc");

        } else if (result.affectedRows == 1) {
          req.flash('success_msg', 'Doctor deleted successfully!');
          res.redirect("./removeDoc");

        }
      }
    });
  });

module.exports = router;
