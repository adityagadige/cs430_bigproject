const express = require("express");
const router = express.Router();
const connect = require("../config/db");
const {
  isLoggedIn
} = require("../config/ensureAuth");

router.get("/viewContracts", isLoggedIn, (req, res) => {
  let query = "SELECT c.pharm_id, p.name as ppname, p.phone as pphone, c.start_date, c.end_date, c.text, c.supervisor, c.pharm_co_name, pc.phone FROM contract c, pharmacy p, pharm_co pc" +
    " where c.pharm_id = p.pharm_id and c.pharm_co_name = pc.name";
  connect.query(query, (error, results, fields) => {
    if (error) {
      console.log(error);
      req.flash('error_msg', 'Error loading page!');
      res.redirect("/home");
    } else
      res.render("viewContracts", {
        rows: results
      });
  });
});

router.route("/addContract")
  .get(isLoggedIn, (req, res) => {
    let query = "SELECT pharm_id FROM pharmacy; SELECT name FROM pharm_co";
    connect.query(query, (error, results, fields) => {
      if (error) {
        console.log(error);
        req.flash('error_msg', 'Error loading page!');
        res.redirect("/home");

      } else
        res.render("addContract", {
          rows: results
        });
    });
  })
  .post(isLoggedIn, (req, res) => {
    let query = "insert into contract(pharm_id,start_date,end_date,text,supervisor, pharm_co_name) values(?)";
    let values = [req.body.pharm_id, req.body.start_date, req.body.end_date, req.body.contract, req.body.sup_name, req.body.pharmco_name];
    connect.query(query, [values], (error, result) => {
      if (error) {
        console.log(error);
        req.flash('error_msg', 'Error adding contract!');
        res.redirect("./addContract");

      } else {
        console.log("1 record inserted into contract");
        req.flash('success_msg', 'Contract added successfully!');
        res.redirect("./addContract");
      }
    });
  });

router.route("/updateContract")
  .get(isLoggedIn, (req, res) => {
    let query = "SELECT * from contract";
    connect.query(query, (error, results, fields) => {
      if (error) {
        console.log(error);
        req.flash('error_msg', 'Error loading page!');
        res.redirect("/home");

      } else {
        res.render("updateContract", {
          rows: results
        });
      }
    });
  });

router.route("/updateContract1")
  .get(isLoggedIn, (req, res) => {
    let val = req.query.row_id.split("^^");
    let query = `SELECT * FROM contract where pharm_id='${val[0]}' and pharm_co_name ='${val[1]}'`;
    console.log(query);
    connect.query(query, (error, results, fields) => {
      if (error) {
        console.log(error);
        req.flash('error_msg', 'Error loading selected contract!');
        res.redirect("./updateContract");
      } else {
        res.render("updateContract1", {
          row: results
        });
      }
    });
  })
  .post(isLoggedIn, (req, res) => {
    let {
      pharm_id,
      pharm_co,
      sup_name,
      contract,
      start_date,
      end_date
    } = req.body;
    console.log(req.body);
    let query = `UPDATE contract SET supervisor='${sup_name}', text='${contract}', start_date='${start_date}', end_date='${end_date}' WHERE pharm_id='${pharm_id}' AND pharm_co_name='${pharm_co}'`;
    console.log(query);
    connect.query(query, (error, result) => {
      if (error) {
        console.log(error);
        req.flash('error_msg', 'Error updating contract!');
        res.redirect("./updateContract");
      } else {
        console.log(result);
        if (result.affectedRows == 0) {
          req.flash('error_msg', 'Error updating contract!');
          res.redirect("./updateContract");
        } else if (result.affectedRows == 1) {
          req.flash('success_msg', 'Contract supervisor successfully updated!');
          res.redirect("./updateContract");
        }
      }
    });
  });

router.route("/removeContract")
  .get(isLoggedIn, (req, res) => {
    let query = "SELECT * from contract";
    connect.query(query, (error, results, fields) => {
      if (error) {
        console.log(error);
        req.flash('error_msg', 'Error loading page!');
        res.redirect("/home");

      } else {
        res.render("removeContract", {
          rows: results
        });
      }
    });
  })
  .post(isLoggedIn, (req, res) => {
    let values = req.body.row_id.split("^^");
    let query = `Delete from contract where pharm_id ='${values[0]}'  and pharm_co_name ='${values[1]}' `;

    connect.query(query, (error, result) => {
      if (error) {
        console.log(error);
        req.flash('error_msg', 'Error Deleting Contract!');
        res.redirect("./removeContract");

      } else {
        if (result.affectedRows == 0) {
          req.flash('error_msg', 'Error Deleting Contract!');
          res.redirect("./removeContract");

        } else if (result.affectedRows == 1) {
          req.flash('success_msg', 'Contract delted successfully');
          res.redirect("./removeContract");

        }
      }
    });
  });


module.exports = router;
