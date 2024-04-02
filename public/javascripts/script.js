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
  $.ajax({
    url: "/change-cart-item-quantity",
    method: "post",
    data: {
      cartId,
      prodId,
      count,
    },
    success: res => {
      if (res.status) {
        let quantity = $(`#cart-item-quantity_${prodId}`).html();
        if (res.countValue == 1) quantity = parseInt(quantity) + 1;
        else if (res.countValue == -1) quantity = parseInt(quantity) - 1;
        $(`#cart-item-quantity_${prodId}`).html(quantity);
        // alert(quantity);
        if (parseInt(quantity) == 1) {
          $(`#cart-item-quantity-plus-button_${prodId}`).css("visibility", "hidden");
        } else {
          $(`#cart-item-quantity-plus-button_${prodId}`).css("visibility", "visible");
        }
      }
    },
  });
}
