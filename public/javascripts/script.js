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
      }
    },
  });
}
