const midtransClient = require("midtrans-client");

let snap = new midtransClient.Snap({
  isProduction: false,
  serverKey:
    process.env.MIDTRANS_SECRET || "SB-Mid-server-bSPXP7KlM_dSVSfihj6TF9zH",
  clientKey: process.env.MIDTRANS_CLIENT || "SB-Mid-client-g-RBovCUTfOO6Uq2",
});

class TransactionController {
  static async payment(req, res, next) {
    try {
      const { amount, fullName, email } = req.body;

      let parameter = {
        transaction_details: {
          order_id: "FlysKitchen__" + Math.floor(Math.random() * 1000000),
          gross_amount: amount,
        },
        customer_details: {
          //   first_name: fullName.split(" ")[0],
          //   last_name: fullName.split(" ")[1],
          email: email,
          phone: "628819101837",
        },                                 
        enabled_payments: [
          "credit_card",
          "cimb_clicks",
          "bca_klikbca",
          "bca_klikpay",
          "bri_epay",
          "echannel",
          "permata_va",
          "bca_va",
          "bni_va",
          "bri_va",
          "other_va",
          "gopay",
          "indomaret",
          "danamon_online",
          "akulaku",
          "shopeepay",
        ],
        credit_card: {
          secure: true,
          channel: "migs",
          bank: "bca",
          installment: {
            required: false,
            terms: {
              bni: [3, 6, 12],
              mandiri: [3, 6, 12],
              cimb: [3],
              bca: [3, 6, 12],
              offline: [6, 12],
            },
          },
          whitelist_bins: ["48111111", "41111111"],
        },
      };

      const transaction = await snap.createTransaction(parameter);

      res.status(200).json({
        token: transaction.token,
        redirect_url: transaction.redirect_url,
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

module.exports = TransactionController;
