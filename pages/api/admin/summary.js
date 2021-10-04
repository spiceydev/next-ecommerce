import { format } from 'date-fns';
import nc from 'next-connect';
import Order from '../../../models/Order';
import Product from '../../../models/Product';
import User from '../../../models/User';
import { isAdmin, isAuth } from '../../../utils/auth';
import db from '../../../utils/db';
import { onError } from '../../../utils/error';

const handler = nc({
  onError,
});
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const ordersCount = await Order.countDocuments();
  const productsCount = await Product.countDocuments();
  const usersCount = await User.countDocuments();
  const ordersPriceGroup = await Order.aggregate([
    { $match: { isPaid: true } },
    {
      $group: {
        _id: null,
        sales: { $sum: '$totalPrice' },
      },
    },
  ]);
  const ordersPrice =
    ordersPriceGroup.length > 0 ? ordersPriceGroup[0].sales : 0;

  const orders = await Order.find({});
  const correctSalesData = [];
  orders.forEach((order) => {
    if (order.isPaid) {
      const orderDate = format(order.createdAt, 'MM-yyyy');
      const existOrder = correctSalesData.find((o) => o._id === orderDate);
      if (!existOrder) {
        correctSalesData.push({
          _id: orderDate,
          totalSales: order.totalPrice,
        });
      } else {
        existOrder.totalSales += order.totalPrice;
      }
    }
  });

  await db.disconnect();
  res.send({
    ordersCount,
    productsCount,
    usersCount,
    ordersPrice,
    correctSalesData,
  });
});

export default handler;
