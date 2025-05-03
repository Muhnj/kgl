const express = require('express');
const router = express.Router();
const connectEnsureLogin = require('connect-ensure-login');
const CreditSale = require('../models/CreditSale');
const User = require('../models/Signup');

// Director's dashboard route
router.get('/directorDash', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  const user = req.user;
  if (user.role !== 'Director') {
    return res.status(403).send('Access denied');
  }

  try {
    const totalRevenue = await CreditSale.aggregate([
      { $match: { status: 'paid' } },
      {
        $group: {
          _id: null,
          totalsale: { $sum: '$totalAmount' },
          totalquantitysold: { $sum: '$quantity' }
        }
      }
    ]);

    const creditSales = await CreditSale.aggregate([
      { $match: { status: 'pending' } },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$totalAmount' },
          totalQuantity: { $sum: '$quantity' }
        }
      }
    ]);

    const branchSales = await CreditSale.aggregate([
      {
        $group: {
          _id: '$branch',
          totalAmount: { $sum: '$totalAmount' },
          totalQuantity: { $sum: '$quantity' }
        }
      }
    ]);

    res.render('directordash', {
      totalRevenue: totalRevenue[0] || { totalsale: 0, totalquantitysold: 0 },
      creditSales: creditSales[0] || { totalAmount: 0, totalQuantity: 0 },
      branchSales
    });
  } catch (err) {
    console.error('Error loading director dashboard:', err);
    res.status(500).send('Failed to load dashboard');
  }
});
router.get('/overview', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  const user = req.user;
  if (user.role !== 'Director') {
    return res.status(403).send('Access denied');
  }

  try {
    const branchStats = await CreditSale.aggregate([
      {
        $group: {
          _id: '$branch',
          totalSales: { $sum: '$totalAmount' },
          totalQuantity: { $sum: '$quantity' },
          orders: { $sum: 1 }
        }
      }
    ]);

    // Rename _id to name for clarity in template
    const formattedStats = branchStats.map(stat => ({
      name: stat._id,
      totalSales: stat.totalSales,
      totalQuantity: stat.totalQuantity,
      orders: stat.orders
    }));

    res.render('overview', { branchStats: formattedStats });
  } catch (err) {
    console.error('Error loading overview:', err);
    res.status(500).send('Failed to load overview');
  }
});
//  //routes to view users 
//  router.get('/userlist', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
//   const user = req.user;
//   if (user.role !== 'Director') return res.status(403).send('Access denied');

//   try {
//     const users = await Signup.find({});
//     res.render('userlist', { users });
//   } catch (err) {
//     console.error('Error fetching users:', err);
//     res.status(500).send('Internal Server Error');
//   }
// });


module.exports = router;
