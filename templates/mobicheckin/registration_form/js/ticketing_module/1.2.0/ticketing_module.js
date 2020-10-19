// No message if all guests are deleted
// <script type="text/javascript">window.display_message = false;</script>

// change the message if all guests are deleted
// <script type="text/javascript">window.display_message = "New message";</script>
$(function() {
  // handle remove button by linked guests
  $("form").on('click', ".remove-button", function() {
    var quantity_fields = $(this).closest("tr").find(".quantity").find(".quantity_fields");
    quantity_fields.val( quantity_fields.val() - 1 );
    $(this).closest("div[id|='linked-person']").find(".remove-linked-guest").click();
  });

  // checks if the quantity is an integer
  var reg = new RegExp("^[0-9]+$");
  function isInteger(val) {
    return (reg.test(val));
  }

  //add guests on change of select
  $("form").on("change", ".quantity_fields", function() {
    // Au change -> Pause la MAJ du caddie
    if (window.caddie != undefined) {
      window.caddie.pause();
    }
    var $quantity = $(this);
    var quantity = parseInt( $quantity.val() );
    var article_cell = $quantity.closest('tr').find(".article");
    var currentNbOfLinkedGuests = article_cell.find("div[id|='linked-person']").length;

    if(quantity == 0 && currentNbOfLinkedGuests != 0){

      var remove_linked_guest = article_cell.find('.remove-linked-guest');

      if (window.display_message) {
        if(window.display_message === undefined) {
          window.display_message = "Êtes-vous sûr de vouloir supprimer toutes les personnes inscrites pour cet article ?";
        }
        var result = confirm(window.display_message);
        if(result){
          remove_linked_guest.click();
        } else {
          $quantity.val(currentNbOfLinkedGuests);
        }
      } else {
        remove_linked_guest.click();
      }
    } else if(quantity != "" && quantity != undefined && isInteger(quantity)){
      // add linked guests
      if(quantity > currentNbOfLinkedGuests){
        var add_linked_guest = article_cell.find('.add-linked-guest');
        var diff = quantity - currentNbOfLinkedGuests;
        // var result = confirm("Êtes-vous sûr de vouloir ajouter " + diff + " personne(s) ?");
        // if(result){
        for (var i = 1; i <= diff; i++) {
          add_linked_guest.click();
        }
        // }else{
        //   $quantity.val(currentNbOfLinkedGuests);
        // }
      }
      // remove linked guests
      if(quantity < currentNbOfLinkedGuests){
        var diff = currentNbOfLinkedGuests - quantity;
        var result = diff > 1 ? confirm("Vous êtes sur le point de supprimer les " + diff + " dernières personnes renseignées.\nÊtes-vous sûr ?") : confirm("Vous êtes sur le point de supprimer la dernière personne renseignée.\nÊtes-vous sûr ?");
        if(result){
          for (var i = 1; i <= diff; i++) {
            var remove_linked_guest = article_cell.find('.remove-linked-guest');
            remove_linked_guest.last().click();
          }
        } else {
          $quantity.val(currentNbOfLinkedGuests);
        }
      }
    } else {
      $quantity.val(currentNbOfLinkedGuests);
    }
    // On reprend la MAJ du caddie
    if (window.caddie != undefined) {
      window.caddie.resume();
      window.caddie.trigger();
    }
  });

  function handleSelectArticle() {
    var count = 0;
    $(".quantity_fields").each(function() {
      if ($(this).find("option:selected").val() != "0")
        count = count + 1;
    });
    return (count > 0);
  }

  $("[type=submit]").on("click", function() {
    if ($("table").length > 0) {
      valid = handleSelectArticle();
      if (!valid) {
        alert("Veuillez sélectionner un article");
        return false;
      }
    }
    if ('parentIFrame' in window) {
      parentIFrame.scrollTo(0,0);
      parentIFrame.size(550);
    }
  });

  //display guests on document load
  $(".quantity_fields").each( function() {
    var $quantity = $(this);
    var quantity = parseInt( $quantity.val() );
    var article_cell = $quantity.closest('tr').find(".article");
    var currentNbOfLinkedGuests = article_cell.find("div[id|='linked-person']").length;
    if (currentNbOfLinkedGuests != 0) {
      $quantity.val(currentNbOfLinkedGuests);
    }
  });
});
