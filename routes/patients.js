const express = require("express");
const router = express.Router();
const connect = require("../config/db");
const {
  isLoggedIn
} = require("../config/ensureAuth");

router.get("/viewPatients", isLoggedIn, (req, res) => {
  let query = "SELECT * FROM pri_phy_patient";
  connect.query(query, (error, results, fields) => {
    if (error) {
      console.log(error);
      req.flash('error_msg', 'Error loading page!');
      res.redirect("/home");

    } else
      res.render("viewPatients", {
        rows: results
      });
  });
});

router.route("/addPatient")
  .get(isLoggedIn, (req, res) => {
    let query = "SELECT ssn FROM doctor";
    connect.query(query, (error, results, fields) => {
      if (error) {
        console.log(error);
        req.flash('error_msg', 'Error loading page!');
        res.redirect("/home");

      } else
        res.render("addPatient", {
          rows: results
        });
    });
  })
  .post(isLoggedIn, (req, res) => {
    let query = "insert into pri_phy_patient(ssn,name,birth_date,address,phy_ssn) values(?)";
    let values = [req.body.patient_ssn, req.body.patient_name, req.body.patient_dob, req.body.patient_address, req.body.phy_ssn];
    connect.query(query, [values], (error, result) => {
      if (error) {
        console.log(error);
        req.flash('error_msg', 'Error adding patient!');
        res.redirect("./addPatient");

      } else {
        console.log("1 record inserted into pri_phy_patient");
        req.flash('success_msg', 'Patient added successfully!');
        res.redirect("./addPatient");

      }
    });
  });

router.route("/removePatient")
  .get(isLoggedIn, (req, res) => {
    let query = "SELECT * FROM pri_phy_patient";
    connect.query(query, (error, results, fields) => {
      if (error) {
        console.log(error);
        req.flash('error_msg', 'Error loading page!');
        res.redirect("/home");

      } else
        res.render("removePatient", {
          rows: results
        });
    });
  })
  .post(isLoggedIn, (req, res) => {
    let post = {
      ssn: req.body.row_id
    };
    let query = "DELETE FROM pri_phy_patient WHERE ?";
    connect.query(query, post, (error, result) => {
      if (error) {
        console.log(error);
        req.flash('error_msg', 'Error deleting patient!');
        res.redirect("./removePatient");

      } else {
        if (result.affectedRows == 0) {
          req.flash('error_msg', 'Error deleting patient!');
          res.redirect("./removePatient");

        } else if (result.affectedRows == 1) {
          req.flash('success_msg', 'Patient deleted successfully');
          res.redirect("./removePatient");

        }
      }
    });
  });

module.exports = router;
