$(document).ready(function() {
// function for search box to search records of the table
  $(".myInput").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $(".myTable tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });

// function to hide and show parents of the dropTime and pickTime
  $('.dropdown-menu a.dropdown-toggle').on('click', function(e) {
    if (!$(this).next().hasClass('show')) {
      $(this).parents('.dropdown-menu').first().find('.show').removeClass('show');
    }
    var $subMenu = $(this).next('.dropdown-menu');
    $subMenu.toggleClass('show');


    $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function(e) {
      $('.dropdown-submenu .show').removeClass('show');
    });


    return false;
  });


//click and keydown eventlisteners to hide and show dropTime and pickTime
  $('#presStatus').on('click keydown', function(e) {
    if ($('#presStatus').val() == 'COMPLETED') {
      $('#dTime').show();
      $('#dropTime').attr("required", true);
      $('#pTime').show();
      $('#pickTime').attr("required", true);

    } else if ($('#presStatus').val() == 'CANCELLED') {
      $('#dTime').hide();
      $('#dropTime').attr("required", false);
      $('#pTime').hide();
      $('#pickTime').attr("required", false);
    } else if ($('#presStatus').val() == 'PENDING') {
      $('#dTime').hide();
      $('#dropTime').attr("required", false);
      $('#pTime').hide();
      $('#pickTime').attr("required", false);
    } else if ($('#presStatus').val() == 'READY TO GO') {
      $('#dTime').show();
      $('#dropTime').attr("required", true);
      $('#pTime').hide();
      $('#pickTime').attr("required", false);
    }
  });


//script to make sure only one checkbox is selected for deleting or updating records and enable submit button as necessary

  $('.item-list').on('change', function() {
    $('.item-list').not(this).prop('checked', false);
  });

  var checkboxes = $("input[type='checkbox']");
  var submitButt = $("input[type='submit']");

  checkboxes.click(function() {
    submitButt.attr("disabled", !checkboxes.is(":checked"));
  });

});
