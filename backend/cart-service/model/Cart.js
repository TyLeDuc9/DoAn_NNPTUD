const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  items: [
    {
      bookdetail_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BookDetail',
        required: true
      },
      quantity: {
        type: Number,
        default: 1,
        min: 1
      },
      price: {
        type: Number,
        required: true,
        min: 0
      },
      total: {
        type: Number,
        default: 0
      }
    }
  ],
  addedAt: {
    type: Date,
    default: Date.now
  },

  notified: {
    type: Boolean,
    default: false
  },
  totalQuantity: { type: Number, default: 0 },
  totalPrice: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['active', 'ordered', 'abandoned'],
    default: 'active'
  }
}, { timestamps: true });

cartSchema.pre('save', function () {
  let totalQty = 0;
  let totalPrice = 0;

  this.items.forEach(item => {
    item.total = item.quantity * item.price;
    totalQty += item.quantity;
    totalPrice += item.total;
  });

  this.totalQuantity = totalQty;
  this.totalPrice = totalPrice;
});

module.exports = mongoose.model('Cart', cartSchema);
