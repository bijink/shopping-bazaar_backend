function addToCart(prodId) {
  $.ajax({
    url: `/add-to-cart/${prodId}`,
    method: "get",
    success: res => {
      if (res.status) {
        let count = $("#cart-count").html();
        count = parseInt(count) + 1;
        $("#cart-count").html(count);
      }
    },
  });
}
function changeCartItemQuantity(cartId, prodId, count) {
  let quantityElement = $(`#cart-item-quantity_${prodId}`).html();
  $.ajax({
    url: "/change-cart-item-quantity",
    method: "post",
    data: {
      cartId,
      prodId,
      quantity: parseInt(quantityElement),
      count,
    },
    success: res => {
      if (res.status) {
        if (res.itemRemoved) {
          // #user cart 'document || product_object' deleted
          $(`#cart-list-item_${prodId}`).css("display", "none");
          alert("Product removed from Cart");
        } else {
          // #user cart product quantity change
          quantityElement = parseInt(quantityElement) + parseInt(count);
          $(`#cart-item-quantity_${prodId}`).html(quantityElement);
        }
        $(`#cart-total-amount`).html(res.cartTotalAmount);
        if (res.cartTotalAmount === 0) {
          $("#cart-actions").replaceWith(`
            <div id="empty-cart-actions" class="d-flex justify-content-center mt-5">
              <div class="d-flex flex-column text-center">
                <p class="fs-4">Cart is Empty</p>
                <a href="/" id="place-order-btn" class="btn btn-primary float-end">Go to
                  Products</a>
              </div>
            </div>
          `);
        }
      }
    },
  });
}
function removeCartItem(cartId, prodId) {
  $.ajax({
    url: `/remove-from-cart?cartId=${cartId}&prodId=${prodId}`,
    method: "get",
    success: res => {
      if (res.status) {
        alert("Product removed from Cart");
        $(`#cart-list-item_${prodId}`).css("display", "none");
        $(`#cart-total-amount`).html(res.cartTotalAmount);
        if (res.cartTotalAmount === 0) {
          $("#cart-actions").replaceWith(`
            <div id="empty-cart-actions" class="d-flex justify-content-center mt-5">
              <div class="d-flex flex-column text-center">
                <p class="fs-4">Cart is Empty</p>
                <a href="/" id="place-order-btn" class="btn btn-primary float-end">Go to
                  Products</a>
              </div>
            </div>
          `);
        }
      }
    },
  });
}
function verifyPayment(payment, order) {
  $.ajax({
    url: "/verify-payment",
    method: "post",
    data: { payment, order },
    success: ({ status }) => {
      if (status) {
        location.href = "/order-success";
      } else {
        alert("Payment failed");
        location.href = "/orders";
      }
    },
  });
}
function razorpayPayment(user, order) {
  var options = {
    key: "rzp_test_Yn82FeG4kWvrqt", // Enter the Key ID generated from the Dashboard
    amount: order.amount.toString(), // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    currency: "INR",
    name: "Shopping Cart", //your business name
    description: "Test Transaction",
    image: "https://example.com/your_logo",
    order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    handler: function (response) {
      // alert(response.razorpay_payment_id);
      // alert(response.razorpay_order_id);
      // alert(response.razorpay_signature);
      verifyPayment(response, order);
    },
    prefill: {
      //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
      name: user.name, //your customer's name
      email: user.email,
      contact: user.contact, //Provide the customer's phone number for better conversion rates
    },
    notes: {
      address: "Razorpay Corporate Office",
    },
    theme: {
      color: "#3399cc",
    },
  };
  var rzp1 = new Razorpay(options);
  // rzp1.on("payment.failed", function (response) {
  //   alert(response.error.code);
  //   alert(response.error.description);
  //   alert(response.error.source);
  //   alert(response.error.step);
  //   alert(response.error.reason);
  //   alert(response.error.metadata.order_id);
  //   alert(response.error.metadata.payment_id);
  // });
  rzp1.open();
}
$("#checkout-form").submit(e => {
  e.preventDefault();
  $.ajax({
    url: "/place-order",
    method: "post",
    data: $("#checkout-form").serialize(),
    success: ({ status, user, order }) => {
      if (status === "redirect") {
        location.href = "/orders";
      } else if (status === "cod-success") {
        location.href = "/order-success";
      } else if (status === "online-pending") {
        razorpayPayment(user, order);
      }
    },
  });
});
function payPendingOrders(orderId, amount, userMobileNo) {
  // console.log({ orderId, amount, userMobileNo });
  $.ajax({
    url: "/pay-pending-orders",
    method: "post",
    data: { orderId, amount, mobile: userMobileNo },
    success: ({ status, user, order }) => {
      if (status === "online-pending") {
        razorpayPayment(user, order);
      }
    },
  });
}

$(document).ready(function () {
  $("#admin-view-product-table").DataTable();
});
