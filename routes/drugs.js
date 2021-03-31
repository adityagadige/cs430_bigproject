const express = require("express");
const router = express.Router();
const connect = require("../config/db");
const {
  isLoggedIn
} = require("../config/ensureAuth");

router.get("/viewDrugs",isLoggedIn, (req, res) => {
  let status = req.query.status;
  if (status == 1) {
    let query = "SELECT  trade_name, pharm_co_name, phone, formula FROM make_drug, pharm_co WHERE pharm_co_name = name";
    connect.query(query, (error, results, fields) => {
      if (error) {
        console.log(error);
        req.flash('error_msg', 'Error loading page!');
        res.redirect("/home");

      } else
        res.render("viewDrugs", {
          rows: results,
          status: status
        });
    });
  } else if (status == 2) {
    let query = "SELECT s.pharm_id, p.name, p.phone AS p_phone, s.trade_name,s.pharm_co_name, c.phone AS c_phone FROM sell s, pharmacy p, pharm_co c WHERE s.pharm_id = p.pharm_id AND s.pharm_co_name = c.name;";
    connect.query(query, (error, results, fields) => {
      if (error) {
        console.log(error);
        req.flash('error_msg', 'Error loading page!');
        res.redirect("/home");

      } else
        res.render("viewDrugs", {
          rows: results,
          status: status
        });
    });
  }
});

router.get("/viewDrugsbyPrice",isLoggedIn, (req, res) => {
  let status = req.query.status;
  if (status == 1) {
    //Max Price
    let query = "select pharm_co_name, trade_name, price from sell where price = (select max(price) from sell)";
    connect.query(query, (error, results, fields) => {
      if (error){
      console.log(error);
      req.flash('error_msg', 'Error loading page!');
      res.redirect("/home");
      }
      else
        res.render("viewDrugsbyPrice", {
          rows: results,
          status: status
        });
    });
  } else if (status == 2) {
    //Min Price
    let query = "select pharm_co_name, trade_name, price from sell where price = (select min(price) from sell)";
    connect.query(query, (error, results, fields) => {
      if (error){
      console.log(error);
      req.flash('error_msg', 'Error loading page!');
      res.redirect("/home");
      }
      else
        res.render("viewDrugsbyPrice", {
          rows: results,
          status: status
        });
    });
  } else if (status == 3) {
    let query = "select  s1.trade_name, s1.pharm_id, p1.name, p1.phone, s2.pharm_id as ppharm_id, p2.name as pname, p2.phone as pphone from sell s1, sell s2, pharmacy p1, pharmacy p2" +
      " where s1.pharm_id < s2.pharm_id and s1.trade_name = s2.trade_name and p1.pharm_id = s1.pharm_id and p2.pharm_id = s2.pharm_id";
    connect.query(query, (error, results, fields) => {
      if (error){
      console.log(error);
      req.flash('error_msg', 'Error loading page!');
      res.redirect("/home");
      }
      else
        res.render("viewDrugsbyPrice", {
          rows: results,
          status: status
        });
    });
  }
});

module.exports = router;
