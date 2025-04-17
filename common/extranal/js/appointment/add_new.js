"use strict";
$(document).ready(function () {
  $(".card").hide();
  $(document.body).on("change", "#selecttype", function () {
    var v = $("select.selecttype option:selected").val();
    if (v == "Card") {
      $(".cardsubmit").removeClass("hidden");
      $(".cashsubmit").addClass("hidden");
      // $("#amount_received").prop('required', true);
      // $('#amount_received').attr("required");;
      $(".card").show();
    } else {
      $(".card").hide();
      $(".cashsubmit").removeClass("hidden");
      $(".cardsubmit").addClass("hidden");
      // $("#amount_received").prop('required', false);
      //$('#amount_received').removeAttr('required');
    }
  });
});

$(document).ready(function () {
  $(".doctor_div").on("change", "#adoctors", function () {
    "use strict";
    // $("#visit_description").html(" ");
    var id = $("#appointment_id").val();
    var date = $("#date").val();
    var doctorr = $("#adoctors").val();
    $("#aslots").find("option").remove();

    $.ajax({
      url:
        "schedule/getAvailableSlotByDoctorByDateByJason?date=" +
        date +
        "&doctor=" +
        doctorr,
      method: "GET",
      data: "",
      dataType: "json",
      success: function (response) {
        "use strict";
        var slots = response.aslots;
        $.each(slots, function (key, value) {
          $("#aslots").append($("<option>").text(value).val(value)).end();
        });

        if ($("#aslots").has("option").length == 0) {
          //if it is blank.
          $("#aslots")
            .append(
              $("<option>").text("No Further Time Slots").val("Not Selected")
            )
            .end();
        }
      },
    });
    $("#visit_description").html(" ");
    $("#visit_charges").val(" ");
    $.ajax({
      url: "doctor/getDoctorVisit?id=" + doctorr,
      method: "GET",
      data: "",
      dataType: "json",
      success: function (response1) {
        $("#visit_description").html(response1.response).end();
      },
    });
  });
});

$(document).ready(function () {
  "use strict";
  var id = $("#appointment_id").val();
  var date = $("#date").val();
  var doctorr = $("#adoctors").val();
  $("#aslots").find("option").remove();

  $.ajax({
    url:
      "schedule/getAvailableSlotByDoctorByDateByJason?date=" +
      date +
      "&doctor=" +
      doctorr,
    method: "GET",
    data: "",
    dataType: "json",
    success: function (response) {
      "use strict";
      var slots = response.aslots;
      $.each(slots, function (key, value) {
        $("#aslots").append($("<option>").text(value).val(value)).end();
      });

      $("#aslots")
        .val(response.current_value)
        .find("option[value=" + response.current_value + "]")
        .attr("selected", true);

      if ($("#aslots").has("option").length == 0) {
        //if it is blank.
        $("#aslots")
          .append(
            $("<option>").text("No Further Time Slots").val("Not Selected")
          )
          .end();
      }
    },
  });
});

  //datepicker añadir cita ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  "use strict";
  var availableDates = []; // Variable para almacenar las fechas disponibles
  var datepickerInitialized = false; // Variable para controlar si el datepicker se ha inicializado
  
  // Función para obtener los días disponibles desde el servidor
  function fetchAvailableDates(doctorId) {
    if (!doctorId) {
        console.log("Doctor ID no proporcionado");
        return;
    }

    $.ajax({
        url: "schedule/getAvailableDatesByDoctor?doctor=" + doctorId,
        method: "GET",
        dataType: "json",
        success: function (response) {
            if (response.error) {
                console.error("Error:", response.error);
                return;
            }
            
            console.log("Días disponibles con slots:", response.availableDates);
            availableDates = response.availableDates;

            // Convertir las fechas a objetos Date
            availableDates = availableDates.map(function (dateString) {
                var parts = dateString.split("-");
                return new Date(parts[2], parts[1] - 1, parts[0]); // año, mes, día
            });
            //console.log("Días disponibles con slots:", availableDates);
            console.log("fetchAvailableDates: datepickerInitialized antes del refresh:", datepickerInitialized);   
            // Inicializar o actualizar el datepicker
            
            // Inicializar o re-inicializar el datepicker con los nuevos datos
            if (availableDates.length > 0) {
              initializeDatePicker(availableDates); // Siempre inicializar aquí
          } else {
              if ($("#date").data('datepicker')) {
                  $("#date").datepicker('destroy');
              }
              datepickerInitialized = false;
              alert("No hay días disponibles...");
          }
        },
        error: function (xhr, status, error) {
            //console.error("Error al obtener los días disponibles:", error);
            alert("Error al obtener los días disponibles. Por favor, intente más tarde.");
        }
    });
  }

  function initializeDatePicker(availableDatesArray) {
    //console.log("initializeDatePicker llamada con:", availableDatesArray);
    $("#date").datepicker({
        format: 'dd-mm-yyyy',
        autoclose: true,
        language: 'es',
        beforeShowDay: function(date) {
          // Lógica de DisableDates dentro de la inicialización
          if (!Array.isArray(availableDatesArray)) {
              console.error("availableDatesArray no es un array:", availableDatesArray);
              return { enabled: false, classes: 'unavailable-day' };
          }
          var currentDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
          currentDate.setHours(0,0,0,0);
          var isAvailable = availableDatesArray.some(function(availableDate) {
              var compareDate = new Date(availableDate);
              compareDate.setHours(0,0,0,0);
              return currentDate.getTime() === compareDate.getTime();
          });
          return { enabled: isAvailable, classes: isAvailable ? 'available-day' : 'unavailable-day' };
        },
        todayHighlight: true,
        startDate: new Date()
    }).off("changeDate").on("changeDate", dateChanged); // Remover y adjuntar el evento
    datepickerInitialized = true;
  }
 
  // Función para manejar el cambio de fecha
  function dateChanged() {
    var iid = $("#date").val();
    var doctorr = $("#adoctors").val();

    if (!iid || !doctorr) {
      alert("Por favor, seleccione una fecha y un médico.");
      return;
    }
    //console.log("Fecha seleccionada:", iid);
    //console.log("Doctor seleccionado:", doctorr);
    $("#loading-spinner").show(); // Mostrar spinner
    $("#aslots").find("option").remove(); // Limpiar opciones existentes

     // *AGREGAR IF AQUÍ*
    if (iid && doctorr) {
      $.ajax({
        url:
          "schedule/getAvailableSlotByDoctorByDateByJason?date=" +
          iid +
          "&doctor=" +
          doctorr,
        method: "GET",
        dataType: "json",
        success: function (response) {
          var slots = response.aslots;
          if (slots && slots.length > 0) {
            $.each(slots, function (key, value) {
              $("#aslots").append($("<option>").text(value).val(value)).end();
            });
          } else {
            $("#aslots")
              .append(
                $("<option>").text("No hay más franjas horarias").val("No seleccionado")
              )
              .end();
          }
        },
        error: function (xhr, status, error) {
          console.error("Error en la solicitud AJAX:", error);
          $("#aslots")
            .append(
              $("<option>").text("Error al cargar horarios").val("Error")
            )
            .end();
        },
        complete: function () {
          $("#loading-spinner").hide(); // Ocultar spinner
        },
      });
    }
  }
  
  // Escuchar cambios en el médico seleccionado
  $("#adoctors").on("change", function () {
    var doctorId = $(this).val();
    $("#aslots").find("option").remove();

    if ($("#date").data('datepicker')) { // Verificar si el datepicker ya existe
        $("#date").datepicker('destroy');
    }
    datepickerInitialized = false; // Resetear la variable

    fetchAvailableDates(doctorId); // fetchAvailableDates llamará a initializeDatePicker
  });

  // Inicializar al cargar la página (si hay un doctor seleccionado)
  var initialDoctorId = $("#adoctors").val();
  if (initialDoctorId) {
      fetchAvailableDates(initialDoctorId);
  }

  /////////////////////////////////////////termina el datepicker añadir cita////////////////////////////////////////////////////////////////////////////////////////

$(document).ready(function () {
  $("#pay_now_appointment").change(function () {
    if ($(this).prop("checked") == true) {
      $(".deposit_type").removeClass("hidden");
      $("#addAppointmentForm").find('[name="deposit_type"]').trigger("reset");
      // $('#editAppointmentForm').find('[name="status"]').val("Confirmed").end()
    } else {
      $("#addAppointmentForm").find('[name="deposit_type"]').val("").end();
      $(".deposit_type").addClass("hidden");
      //  $('#editAppointmentForm').find('[name="status"]').val("").end()

      $(".card").hide();
    }
  });
});
