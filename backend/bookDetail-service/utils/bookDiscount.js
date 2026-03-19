// utils/discount.js
const applyBookDiscount = (book, discount) => {
  let discountedPrice = book.price;
  let discountValue = 0;

  if (discount) {
    discountValue = discount.value;
    if (discount.discountType === "percentage") {
      discountedPrice = book.price * (1 - discount.value / 100);
    } else if (discount.discountType === "fixed") {
      discountedPrice = book.price - discount.value;
      if (discountedPrice < 0) discountedPrice = 0;
    }
  }

  return { ...book, discountedPrice, discountValue };
};

module.exports = { applyBookDiscount };
