const express = require("express");
const router = express.Router();
const connect = require("../config/db");
const {
  isLoggedIn
} = require("../config/ensureAuth");
const _ = require("lodash");

router.get("/viewPatientPrescriptions", isLoggedIn, (req, res) => {
  let query = "SELECT s.ssn,r.name,s.pre_id,s.status,s.pre_date,s.phy_ssn,d.name,s.quantity,s.trade_name,s.pharm_co_name FROM pri_phy_patient r, prescription s, doctor d" +
    " WHERE r.ssn = s.ssn AND s.phy_ssn = d.ssn";
  connect.query(query, (error, results, fields) => {
    if (error) {
      console.log(error);
      req.flash('error_msg', 'Error loading page!');
      res.redirect("/home");

    } else
      res.render("viewPatientPrescriptions", {
        rows: results
      });
  });
});

router.get("/viewPrescriptions/:status", isLoggedIn, (req, res) => {
  let query = "";
  if (req.params.status === "pending") {
    query = "SELECT s.ssn,r.name,s.pre_id,s.status,s.drop_off_time,s.pick_up_time,s.pre_date,s.phy_ssn,d.name,s.quantity,s.trade_name,s.pharm_co_name FROM pri_phy_patient r, prescription s, doctor d " +
      "WHERE r.ssn = s.ssn AND s.phy_ssn = d.ssn AND s.status = 'PENDING'";
  } else if (req.params.status === "completed") {
    query = "SELECT s.ssn,r.name,s.pre_id,s.status,s.drop_off_time,s.pick_up_time,s.pre_date,s.phy_ssn,d.name,s.quantity,s.trade_name,s.pharm_co_name FROM pri_phy_patient r, prescription s, doctor d " +
      "WHERE r.ssn = s.ssn AND s.phy_ssn = d.ssn AND s.status = 'COMPLETED'";
  } else if (req.params.status === "readytogo") {
    query = "SELECT s.ssn,r.name,s.pre_id,s.status,s.drop_off_time,s.pick_up_time,s.pre_date,s.phy_ssn,d.name,s.quantity,s.trade_name,s.pharm_co_name FROM pri_phy_patient r, prescription s, doctor d " +
      "WHERE r.ssn = s.ssn AND s.phy_ssn = d.ssn AND s.status = 'READY TO GO'";
  } else if (req.params.status === "cancelled") {
    query = "SELECT s.ssn,r.name,s.pre_id,s.status,s.drop_off_time,s.pick_up_time,s.pre_date,s.phy_ssn,d.name,s.quantity,s.trade_name,s.pharm_co_name FROM pri_phy_patient r, prescription s, doctor d " +
      "WHERE r.ssn = s.ssn AND s.phy_ssn = d.ssn AND s.status = 'CANCELLED'";
  }
  connect.query(query, (error, results, fields) => {
    if (error) {
      console.log(error);
      req.flash('error_msg', 'Error loading page!');
      res.redirect("/home");

    } else
      res.render("viewPrescriptions", {
        rows: results
      });
  });
});


router.route("/addPrescription")
  .get(isLoggedIn, (req, res) => {
    let query = "SELECT trade_name FROM make_drug;SELECT ssn FROM pri_phy_patient; SELECT ssn AS phy_ssn FROM doctor";
    connect.query(query, (error, results, fields) => {
      if (error) {
        console.log(error);
        req.flash('error_msg', 'Error loading page!');
        res.redirect("/home");

      } else {
        res.render("addPrescription", {
          rows: results
        });
      }
    });
  })
  .post(isLoggedIn, (req, res) => {
    let query1 = "select pharm_co_name from make_drug where trade_name= ?";
    let query = "insert into prescription(pre_id,status,drop_off_time,pick_up_time,ssn,phy_ssn,pre_date,quantity,trade_name,pharm_co_name) values(?)";
    let value = req.body.trade_name;
    connect.query(query1, [value], (error, results, fields) => {
      if (error) {
        console.log(error);
        req.flash('error_msg', 'Error adding Prescription!');
        res.redirect("./addPrescription");

      } else {
        let presStatus = req.body.pres_status.normalize();
        let arr = [req.body.drop_time, req.body.pick_time];
        if (presStatus === 'CANCELLED' || presStatus === 'PENDING') {
          arr[0] = null;
          arr[1] = null;
        } else if (presStatus === 'COMPLETED' && arr[0] === '' && arr[1] === '') {
          // req.flash('error_msg', 'Please provide drop_off time and pick_up Time.');
          // res.redirect("./addPrescription");
          res.render("home", {
            success_msg: "",
            error_msg: "Error adding Prescription! Please provide drop_off time and pick_up Time."
          });

        } else if (presStatus === 'READY TO GO' && arr[0] !== '') {
          arr[1] = null;
        } else if (presStatus === 'READY TO GO' && arr[0] === '') {
          // req.flash('error_msg', 'Please provide drop_off time.');
          // res.redirect("./addPrescription");
          res.render("home", {
            success_msg: "",
            error_msg: "Error adding Prescription! Please provide drop_off time."
          });

        }

        let values = [req.body.pre_id, req.body.pres_status, arr[0], arr[1], req.body.patient_ssn, req.body.phy_ssn, req.body.pres_date, req.body.qnt, req.body.trade_name, results[0].pharm_co_name];
        connect.query(query, [values], (error, result) => {
          if (error) {
            console.log(error);
            res.render("home", {
              success_msg: "",
              error_msg: "Error adding Prescription!"
            });
            // req.flash('error_msg', 'Error adding Prescription!');
            // res.redirect("./addPrescription");

          } else {
            console.log("1 record inserted into prescription");
            req.flash('success_msg', 'Prescription added successfully!');
            res.redirect("./addPrescription");

          }
        });
      }
    });
  });

//Prescription Status after login
router.route("/viewPreStatus")
  .get(isLoggedIn, (req, res) => {
    res.render("viewPreStatus");
  })
  .post(isLoggedIn, (req, res) => {
    let pre_id = req.body.pre_id;
    let query = `SELECT * FROM goodhealthpharm.prescription where pre_id = ${pre_id}`;
    connect.query(query, (error, results, fields) => {
      if (error) {
        console.log(error);
        req.flash('error_msg', 'Error loading Patient Prescription!');
        res.redirect("./viewPreStatus");

      } else {
        if (_.isEmpty(results)) {
          req.flash('error_msg', 'Prescription not found! Enter valid prescription ID.');
          res.redirect("./viewPreStatus");

        } else {
          res.render("viewPreStatus1", {
            rows: results
          });
        }
      }
    });
  });

//Prescription Status before login - can be accessed from login page
  router.route("/viewPrescriptionStatus")
    .get((req, res) => {
      res.render("viewPrescriptionStatus");
    })
    .post((req, res) => {
      let pre_id = req.body.pre_id;
      let query = `SELECT * FROM goodhealthpharm.prescription where pre_id = ${pre_id}`;
      connect.query(query, (error, results, fields) => {
        if (error) {
          console.log(error);
          req.flash('error_msg', 'Error loading Patient Prescription!');
          res.redirect("./viewPrescriptionStatus");

        } else {
          if (_.isEmpty(results)) {
            req.flash('error_msg', 'Prescription not found! Enter valid prescription ID.');
            res.redirect("./viewPrescriptionStatus");

          } else {
            res.render("viewPrescriptionStatus1", {
              rows: results
            });
          }
        }
      });
    });

router.route("/removePrescription")
  .get(isLoggedIn, (req, res) => {
    let query = "SELECT * FROM prescription";
    connect.query(query, (error, results, fields) => {
      if (error) {
        console.log(error);
        req.flash('error_msg', 'Error loading page!');
        res.redirect("/home");

      } else
        res.render("removePrescription", {
          rows: results
        });
    });
  })
  .post(isLoggedIn, (req, res) => {
    let post = {
      pre_id: req.body.row_id
    };
    let query = "delete from prescription where ?";
    connect.query(query, post, (error, result) => {
      if (error) {
        console.log(error);
        req.flash('error_msg', 'Error Deleting prescription!');
        res.redirect("./removePrescription");

      } else {
        if (result.affectedRows == 0) {
          req.flash('error_msg', 'Error Deleting prescription!');
          res.redirect("./removePrescription");

        } else if (result.affectedRows == 1) {
          req.flash('success_msg', 'Prescription delted successfully');
          res.redirect("./removePrescription");

        }
      }
    });

  });


module.exports = router;
