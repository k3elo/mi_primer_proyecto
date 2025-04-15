"use strict";

  var availableDates = [];

  

$(document).ready(function () {
  "use strict";
  $(".table").on("click", ".editbutton", function () {
    "use strict";
    var iid = $(this).attr("data-id");
    $("#editAppointmentForm").trigger("reset");
    $(".consultant_fee_div").addClass("hidden");
    $(".pay_now").addClass("hidden");
    $(".payment_status").addClass("hidden");
    $(".deposit_type1").addClass("hidden");
    $("#myModal2").modal("show");
    $.ajax({
      url: "appointment/editAppointmentByJason?id=" + iid,
      method: "GET",
      data: "",
      dataType: "json",
      success: function (response) {
        "use strict";
        var de = response.appointment.date * 1000;
        var d = new Date(de);

        var da = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
        // Populate the form fields with the data returned from server
        $("#editAppointmentForm")
          .find('[name="id"]')
          .val(response.appointment.id)
          .end();
        $("#editAppointmentForm")
          .find('[name="patient"]')
          .val(response.appointment.patient)
          .end();
        $("#editAppointmentForm")
          .find('[name="doctor"]')
          .val(response.appointment.doctor)
          .end();
        $("#editAppointmentForm")
          .find('[name="date"]')
          .val(da)
          .trigger("change");
        $("#editAppointmentForm")
          .find('[name="status"]')
          .val(response.appointment.status)
          .end();
        $("#editAppointmentForm")
          .find('[name="remarks"]')
          .val(response.appointment.remarks)
          .end();

        var option = new Option(
          response.patient.name + "-" + response.patient.id,
          response.patient.id,
          true,
          true
        );
        $("#editAppointmentForm")
          .find('[name="patient"]')
          .append(option)
          .trigger("change");
        var option1 = new Option(
          response.doctor.name + "-" + response.doctor.id,
          response.doctor.id,
          true,
          true
        );
        $("#editAppointmentForm")
          .find('[name="doctor"]')
          .append(option1)
          .trigger("change");
        $("#visit_description1").html("");
        $.ajax({
          url:
            "doctor/getDoctorVisitForEdit?id=" +
            response.doctor.id +
            "&description=" +
            response.appointment.visit_description,
          method: "GET",
          data: "",
          dataType: "json",
          success: function (response1) {
            $("#visit_description1").html(response1.response).end();
            // $('#editAppointmentForm').find('[name="visit_description"]').val(response.appointment.visit_description).trigger('change').end();
          },
        });
        if (response.appointment.payment_status == "unpaid") {
          $(".consultant_fee_div").removeClass("hidden");
          $(".pay_now").removeClass("hidden");
          $(".payment_status").addClass("hidden");
          // $('.deposit_type1').removeClass('hidden');
          $("#editAppointmentForm")
            .find('[name="visit_charges"]')
            .val(response.appointment.visit_charges)
            .end();
          $("#editAppointmentForm")
            .find('[name="discount"]')
            .val(response.appointment.discount)
            .end();
          $("#editAppointmentForm")
            .find('[name="grand_total"]')
            .val(response.appointment.grand_total)
            .end();
        } else {
          $(".payment_status").removeClass("hidden");
          $(".pay_now").addClass("hidden");
          $(".consultant_fee_div").addClass("hidden");
          //  $('.deposit_type1').addClass('hidden');
          $("#editAppointmentForm")
            .find('[id="adoctors1"]')
            .select2([
              {
                id: response.doctor.id,
                text: response.doctor.name + "-" + response.doctor.id,
                locked: true,
              },
            ]);
          $("#editAppointmentForm")
            .find('[id="pos_select"]')
            .select2([
              {
                id: response.patient.id,
                text: response.patient.name + "-" + response.patient.id,
                locked: true,
              },
            ]);
        }
         // Las siguientes líneas cargan los horarios disponibles.
         var id = $("#appointment_id").val();
         var iid = $("#date1").val();
         var doctorr = $("#adoctors1").val();
       
         console.log("appointment_id:", id);
         console.log("date:", iid);
         console.log("doctor:", doctorr);
       
         $("#aslots1").find("option").remove();
       
         // *AGREGAR IF AQUÍ*
         if (id && iid && doctorr) {
           $.ajax({
             url:
               "schedule/getAvailableSlotByDoctorByDateByAppointmentIdByJason?date=" +
               iid +
               "&doctor=" +
               doctorr +
               "&appointment_id=" +
               id,
             method: "GET",
             data: "",
             dataType: "json",
             success: function (response) {
               "use strict";
               var slots = response.aslots;
               $.each(slots, function (key, value) {
                 "use strict";
                 $("#aslots1").append($("<option>").text(value).val(value)).end();
               });
       
               if ($("#aslots1").has("option").length == 0) {
                 //if it is blank.
                 $("#aslots1")
                   .append(
                     $("<option>").text("No hay más franjas horarias").val("No seleccionado")
                   )
                   .end();
               }
             },
           });
         } else {
           console.log("Faltan parámetros: No se realiza la llamada AJAX");
           // *AGREGA UN MENSAJE DE ERROR AL USUARIO AQUÍ*
           // *POR EJEMPLO: alert("Por favor, seleccione una fecha, un doctor y un ID de cita.");*
         }
      },
    });
  });
 

  "use strict";
  $(".table").on("click", ".history", function () {
    "use strict";

    var iid = $(this).attr("data-id");

    $("#editAppointmentForm").trigger("reset");
    $.ajax({
      url: "patient/getMedicalHistoryByjason?id=" + iid,
      method: "GET",
      data: "",
      dataType: "json",
      success: function (response) {
        "use strict";
        $("#medical_history").html("");
        $("#medical_history").append(response.view);
      },
    });
    $("#cmodal").modal("show");
  });

  //seleccionar un médico y luego actualizar los horarios disponibles y los detalles de la .-
  // visita según el médico y la fecha seleccionados 

  "use strict";
  $(".doctor_div").on("change", "#adoctors", function () {
    "use strict";
    var iid = $("#fechadisponible").val();
    var doctorr = $("#adoctors").val();
    $("#aslots").find("option").remove();

    // *AGREGAR IF AQUÍ*
    if (iid && doctorr) {
      $.ajax({
        url:
          "schedule/getAvailableSlotByDoctorByDateByJason?date=" +
          iid +
          "&doctor=" +
          doctorr,
        method: "GET",
        data: "",
        dataType: "json",
        success: function (response) {
          "use strict";
          var slots = response.aslots;
          $.each(slots, function (key, value) {
            "use strict";
            $("#aslots").append($("<option>").text(value).val(value)).end();
          });

          if ($("#aslots").has("option").length == 0) {
            //if it is blank.
            $("#aslots")
              .append(
                $("<option>")
                  .text("No hay más franjas horarias")
                  .val("No seleccionado")
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
    }
  });



  "use strict";
  var iid = $("#fechadisponible").val();
  var doctorr = $("#adoctors").val();
  $("#aslots").find("option").remove();

  // *AGREGAR IF AQUÍ*
  if (iid && doctorr) {
    $.ajax({
      url:
        "schedule/getAvailableSlotByDoctorByDateByJason?date=" +
        iid +
        "&doctor=" +
        doctorr,
      method: "GET",
      data: "",
      dataType: "json",
      success: function (response) {
        "use strict";
        var slots = response.aslots;
        $.each(slots, function (key, value) {
          "use strict";
          $("#aslots").append($("<option>").text(value).val(value)).end();
        });

        if ($("#aslots").has("option").length == 0) {
          //if it is blank.
          $("#aslots")
            .append(
              $("<option>")
                .text("No hay más franjas horarias")
                .val("No seleccionado ")
            )
            .end();
        }
      },
    });
  }


  //datepicker

  "use strict";

  var datepickerInitialized = false; // Variable para controlar si el datepicker se ha inicializado


  function DisableDates(date) {
    console.log("Verificando disponibilidad para:", date);

    // Verificar que tengamos datos válidos
    if (!Array.isArray(availableDates)) {
        console.error("availableDates no es un array:", availableDates);
        return {
            enabled: false,
            classes: 'unavailable-day'
        };
    }

    // Convertir la fecha a formato YYYY-MM-DD para comparar
    var currentDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    currentDate.setHours(0,0,0,0);

    var isAvailable = availableDates.some(function(availableDate) {
        var compareDate = new Date(availableDate);
        compareDate.setHours(0,0,0,0);
        return currentDate.getTime() === compareDate.getTime();
    });

    console.log("¿Está disponible?:", isAvailable, "para fecha:", date);

    if (isAvailable) {
        return {
            enabled: true,
            classes: 'available-day'
        };
    } else {
        return {
            enabled: false,
            classes: 'unavailable-day'
        };
    }
  }
  
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

            // Inicializar o actualizar el datepicker
            if (availableDates.length > 0) {
                if (!datepickerInitialized) {
                    $("#fechadisponible").datepicker({
                        format: 'dd-mm-yyyy',
                        autoclose: true,
                        language: 'es',
                        beforeShowDay: DisableDates,
                        todayHighlight: true,
                        startDate: new Date()
                    }).on("changeDate", dateChanged);
                    datepickerInitialized = true;
                } else {
                    $("#fechadisponible").datepicker('option', 'beforeShowDay', DisableDates);
                    $("#fechadisponible").datepicker("refresh");
                }
            } else {
                // Si no hay días disponibles
                if (datepickerInitialized) {
                    $("#fechadisponible").datepicker('destroy');
                    datepickerInitialized = false;
                }
                alert("No hay días disponibles con slots libres para este doctor");
            }
        },
        error: function (xhr, status, error) {
            console.error("Error al obtener los días disponibles:", error);
            alert("Error al obtener los días disponibles. Por favor, intente más tarde.");
        }
    });
  }

  
  // Función para manejar el cambio de fecha
  function dateChanged() {
    var iid = $("#fechadisponible").val();
    var doctorr = $("#adoctors").val();

    if (!iid || !doctorr) {
      alert("Por favor, seleccione una fecha y un médico.");
      return;
    }
    console.log("Fecha seleccionada:", iid);
    console.log("Doctor seleccionado:", doctorr);
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
    fetchAvailableDates(doctorId); // Obtener los días disponibles del médico
  });

  // Obtener los días disponibles al cargar la página
  var initialDoctorId = $("#adoctors").val();
  fetchAvailableDates(initialDoctorId);

  //terminar el datepicker

  //datepicker para la edición de citas
  "use strict";
  $("#date1")
    .datepicker({
      format: "dd-mm-yyyy",
      autoclose: true,
    })
    //Listen for the change even on the input
    // .change(dateChanged1)
    .on("changeDate", dateChanged1);

  // Función para manejar el cambio de fecha en la edición de citas
  function dateChanged1() {
    "use strict";
    var id = $("#appointment_id").val();
    var iid = $("#date1").val();
    var doctorr = $("#adoctors1").val();  
  
    $("#aslots1").find("option").remove();
  
    // *AGREGAR IF AQUÍ*
    if (id && iid && doctorr) {
      $.ajax({
        url:
          "schedule/getAvailableSlotByDoctorByDateByAppointmentIdByJason?date=" +
          iid +
          "&doctor=" +
          doctorr +
          "&appointment_id=" +
          id,
        method: "GET",
        data: "",
        dataType: "json",
        success: function (response) {
          "use strict";
          var slots = response.aslots;
          $.each(slots, function (key, value) {
            "use strict";
            $("#aslots1").append($("<option>").text(value).val(value)).end();
          });
  
          if ($("#aslots1").has("option").length == 0) {
            //if it is blank.
            $("#aslots1")
              .append(
                $("<option>").text("No hay más franjas horarias").val("No seleccionado")
              )
              .end();
          }
        },
      });
    } else {
      console.log("Faltan parámetros: No se realiza la llamada AJAX");
      // *AGREGA UN MENSAJE DE ERROR AL USUARIO AQUÍ*
      // *POR EJEMPLO: alert("Por favor, seleccione una fecha, un doctor y un ID de cita.");*
    }
  }


  "use strict";
  $(".doctor_div1").on("change", "#adoctors1", function () {
    "use strict";

    var id = $("#appointment_id").val();
    var date = $("#date1").val();
    var doctorr = $("#adoctors1").val();
    $("#aslots1").find("option").remove();

    $.ajax({
      url:
        "schedule/getAvailableSlotByDoctorByDateByAppointmentIdByJason?date=" +
        date +
        "&doctor=" +
        doctorr +
        "&appointment_id=" +
        id,
      method: "GET",
      data: "",
      dataType: "json",
      success: function (response) {
        "use strict";
        var slots = response.aslots;
        $.each(slots, function (key, value) {
          "use strict";
          $("#aslots1").append($("<option>").text(value).val(value)).end();
        });

        if ($("#aslots1").has("option").length == 0) {
          //if it is blank.
          $("#aslots1")
            .append(
              $("<option>").text("No hay más franjas horarias").val("No seleccionado")
            )
            .end();
        }
      },
    });
    $("#visit_description1").html(" ");
    $("#visit_charges1").val(" ");
    $.ajax({
      url: "doctor/getDoctorVisit?id=" + doctorr,
      method: "GET",
      data: "",
      dataType: "json",
      success: function (response1) {
        $("#visit_description1").html(response1.response).end();
      },
    });
  });



  "use strict";
  var id = $("#appointment_id").val();
  var iid = $("#date1").val();
  var doctorr = $("#adoctors1").val();

  

  $("#aslots1").find("option").remove();

  // *AGREGAR IF AQUÍ*
  if (id && iid && doctorr) {
    $.ajax({
      url:
        "schedule/getAvailableSlotByDoctorByDateByAppointmentIdByJason?date=" +
        iid +
        "&doctor=" +
        doctorr +
        "&appointment_id=" +
        id,
      method: "GET",
      data: "",
      dataType: "json",
      success: function (response) {
        "use strict";
        var slots = response.aslots;
        $.each(slots, function (key, value) {
          "use strict";
          $("#aslots1").append($("<option>").text(value).val(value)).end();
        });

        if ($("#aslots1").has("option").length == 0) {
          //if it is blank.
          $("#aslots1")
            .append(
              $("<option>").text("No hay más franjas horarias").val("No seleccionado")
            )
            .end();
        }
      },
    });
  } else {
    console.log("Faltan parámetros: No se realiza la llamada AJAX");
    // *AGREGA UN MENSAJE DE ERROR AL USUARIO AQUÍ*
    // *POR EJEMPLO: alert("Por favor, seleccione una fecha, un doctor y un ID de cita.");*
  }



  "use strict";
  $('a[data-toggle="tab"]').on("shown.bs.tab", function (e) {
    "use strict";
    $.fn.dataTable
      .tables({ visible: true, api: true })
      .columns.adjust()
      .responsive.recalc();
  });


  "use strict";
  var table = $("#editable-sample5").DataTable({
    responsive: true,

    processing: true,
    serverSide: true,
    searchable: true,
    ajax: {
      url: "appointment/getAppoinmentList",
      type: "POST",
    },
    scroller: {
      loadingIndicator: true,
    },
    dom:
      "<'row'<'col-sm-3'l><'col-sm-5 text-center'B><'col-sm-4'f>>" +
      "<'row'<'col-sm-12'tr>>" +
      "<'row'<'col-sm-5'i><'col-sm-7'p>>",
    buttons: [
      { extend: "copyHtml5", exportOptions: { columns: [0, 1, 2, 3, 4, 5] } },
      { extend: "excelHtml5", exportOptions: { columns: [0, 1, 2, 3, 4, 5] } },
      { extend: "csvHtml5", exportOptions: { columns: [0, 0, 1, 2, 3, 4, 5] } },
      { extend: "pdfHtml5", exportOptions: { columns: [0, 1, 2, 3, 4, 5] } },
      { extend: "print", exportOptions: { columns: [0, 1, 2, 3, 4, 5] } },
    ],
    aLengthMenu: [
      [10, 25, 50, 100, -1],
      [10, 25, 50, 100, "All"],
    ],
    iDisplayLength: 100,
    order: [[0, "desc"]],
    language: {
      lengthMenu: "_MENU_",
      search: "_INPUT_",
      searchPlaceholder: "Search...",
      url: "common/assets/DataTables/languages/" + language + ".json",
    },
  });
  table.buttons().container().appendTo(".custom_buttons");



  "use strict";
  var table = $("#editable-sample6").DataTable({
    responsive: true,

    processing: true,
    serverSide: true,
    searchable: true,
    ajax: {
      url: "appointment/getRequestedAppointmentList",
      type: "POST",
    },
    scroller: {
      loadingIndicator: true,
    },
    dom:
      "<'row'<'col-sm-3'l><'col-sm-5 text-center'B><'col-sm-4'f>>" +
      "<'row'<'col-sm-12'tr>>" +
      "<'row'<'col-sm-5'i><'col-sm-7'p>>",

    buttons: [
      {
        extend: "copyHtml5",
        exportOptions: { columns: [0, 0, 1, 2, 3, 4, 5, 5] },
      },
      {
        extend: "excelHtml5",
        exportOptions: { columns: [0, 0, 1, 2, 3, 4, 5, 5] },
      },
      {
        extend: "csvHtml5",
        exportOptions: { columns: [0, 0, 1, 2, 3, 4, 5, 5] },
      },
      {
        extend: "pdfHtml5",
        exportOptions: { columns: [0, 0, 1, 2, 3, 4, 5, 5] },
      },
      { extend: "print", exportOptions: { columns: [0, 0, 1, 2, 3, 4, 5, 5] } },
    ],
    aLengthMenu: [
      [10, 25, 50, 100, -1],
      [10, 25, 50, 100, "All"],
    ],
    iDisplayLength: 100,
    order: [[0, "desc"]],
    language: {
      lengthMenu: "_MENU_",
      search: "_INPUT_",
      searchPlaceholder: "Search...",
      url: "common/assets/DataTables/languages/" + language + ".json",
    },
  });
  table.buttons().container().appendTo(".custom_buttons");



  "use strict";
  var table = $("#editable-sample1").DataTable({
    responsive: true,

    processing: true,
    serverSide: true,
    searchable: true,
    ajax: {
      url: "appointment/getPendingAppoinmentList",
      type: "POST",
    },
    scroller: {
      loadingIndicator: true,
    },
    dom:
      "<'row'<'col-sm-3'l><'col-sm-5 text-center'B><'col-sm-4'f>>" +
      "<'row'<'col-sm-12'tr>>" +
      "<'row'<'col-sm-5'i><'col-sm-7'p>>",

    buttons: [
      {
        extend: "copyHtml5",
        exportOptions: { columns: [0, 0, 1, 2, 3, 4, 5, 5] },
      },
      {
        extend: "excelHtml5",
        exportOptions: { columns: [0, 0, 1, 2, 3, 4, 5, 5] },
      },
      {
        extend: "csvHtml5",
        exportOptions: { columns: [0, 0, 1, 2, 3, 4, 5, 5] },
      },
      {
        extend: "pdfHtml5",
        exportOptions: { columns: [0, 0, 1, 2, 3, 4, 5, 5] },
      },
      { extend: "print", exportOptions: { columns: [0, 0, 1, 2, 3, 4, 5, 5] } },
    ],
    aLengthMenu: [
      [10, 25, 50, 100, -1],
      [10, 25, 50, 100, "All"],
    ],
    iDisplayLength: 100,
    order: [[0, "desc"]],
    language: {
      lengthMenu: "_MENU_",
      search: "_INPUT_",
      searchPlaceholder: "Search...",
      url: "common/assets/DataTables/languages/" + language + ".json",
    },
  });
  table.buttons().container().appendTo(".custom_buttons");

  

  "use strict";
  var table = $("#editable-sample2").DataTable({
    responsive: true,

    processing: true,
    serverSide: true,
    searchable: true,
    ajax: {
      url: "appointment/getConfirmedAppoinmentList",
      type: "POST",
    },
    scroller: {
      loadingIndicator: true,
    },
    dom:
      "<'row'<'col-sm-3'l><'col-sm-5 text-center'B><'col-sm-4'f>>" +
      "<'row'<'col-sm-12'tr>>" +
      "<'row'<'col-sm-5'i><'col-sm-7'p>>",

    buttons: [
      {
        extend: "copyHtml5",
        exportOptions: { columns: [0, 0, 1, 2, 3, 4, 5, 5] },
      },
      {
        extend: "excelHtml5",
        exportOptions: { columns: [0, 0, 1, 2, 3, 4, 5, 5] },
      },
      {
        extend: "csvHtml5",
        exportOptions: { columns: [0, 0, 1, 2, 3, 4, 5, 5] },
      },
      {
        extend: "pdfHtml5",
        exportOptions: { columns: [0, 0, 1, 2, 3, 4, 5, 5] },
      },
      { extend: "print", exportOptions: { columns: [0, 0, 1, 2, 3, 4, 5, 5] } },
    ],
    aLengthMenu: [
      [10, 25, 50, 100, -1],
      [10, 25, 50, 100, "All"],
    ],
    iDisplayLength: 100,
    order: [[0, "desc"]],
    language: {
      lengthMenu: "_MENU_",
      search: "_INPUT_",
      searchPlaceholder: "Search...",
      url: "common/assets/DataTables/languages/" + language + ".json",
    },
  });
  table.buttons().container().appendTo(".custom_buttons");

  

  "use strict";
  var table = $("#editable-sample3").DataTable({
    responsive: true,

    processing: true,
    serverSide: true,
    searchable: true,
    ajax: {
      url: "appointment/getTreatedAppoinmentList",
      type: "POST",
    },
    scroller: {
      loadingIndicator: true,
    },
    dom:
      "<'row'<'col-sm-3'l><'col-sm-5 text-center'B><'col-sm-4'f>>" +
      "<'row'<'col-sm-12'tr>>" +
      "<'row'<'col-sm-5'i><'col-sm-7'p>>",

    buttons: [
      {
        extend: "copyHtml5",
        exportOptions: { columns: [0, 0, 1, 2, 3, 4, 5, 5] },
      },
      {
        extend: "excelHtml5",
        exportOptions: { columns: [0, 0, 1, 2, 3, 4, 5, 5] },
      },
      {
        extend: "csvHtml5",
        exportOptions: { columns: [0, 0, 1, 2, 3, 4, 5, 5] },
      },
      {
        extend: "pdfHtml5",
        exportOptions: { columns: [0, 0, 1, 2, 3, 4, 5, 5] },
      },
      { extend: "print", exportOptions: { columns: [0, 0, 1, 2, 3, 4, 5, 5] } },
    ],
    aLengthMenu: [
      [10, 25, 50, 100, -1],
      [10, 25, 50, 100, "All"],
    ],
    iDisplayLength: 100,
    order: [[0, "desc"]],
    language: {
      lengthMenu: "_MENU_",
      search: "_INPUT_",
      searchPlaceholder: "Search...",
      url: "common/assets/DataTables/languages/" + language + ".json",
    },
  });
  table.buttons().container().appendTo(".custom_buttons");

  

  "use strict";
  var table = $("#editable-sample4").DataTable({
    responsive: true,

    processing: true,
    serverSide: true,
    searchable: true,
    ajax: {
      url: "appointment/getCancelledAppoinmentList",
      type: "POST",
    },
    scroller: {
      loadingIndicator: true,
    },
    dom:
      "<'row'<'col-sm-3'l><'col-sm-5 text-center'B><'col-sm-4'f>>" +
      "<'row'<'col-sm-12'tr>>" +
      "<'row'<'col-sm-5'i><'col-sm-7'p>>",

    buttons: [
      {
        extend: "copyHtml5",
        exportOptions: { columns: [0, 0, 1, 2, 3, 4, 5, 5] },
      },
      {
        extend: "excelHtml5",
        exportOptions: { columns: [0, 0, 1, 2, 3, 4, 5, 5] },
      },
      {
        extend: "csvHtml5",
        exportOptions: { columns: [0, 0, 1, 2, 3, 4, 5, 5] },
      },
      {
        extend: "pdfHtml5",
        exportOptions: { columns: [0, 0, 1, 2, 3, 4, 5, 5] },
      },
      { extend: "print", exportOptions: { columns: [0, 0, 1, 2, 3, 4, 5, 5] } },
    ],
    aLengthMenu: [
      [10, 25, 50, 100, -1],
      [10, 25, 50, 100, "All"],
    ],
    iDisplayLength: 100,
    order: [[0, "desc"]],
    language: {
      lengthMenu: "_MENU_",
      search: "_INPUT_",
      searchPlaceholder: "Search...",
      url: "common/assets/DataTables/languages/" + language + ".json",
    },
  });
  table.buttons().container().appendTo(".custom_buttons");


  
  "use strict";
  $(".flashmessage").delay(3000).fadeOut(100);

  

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
  $(".card1").hide();
  $(document.body).on("change", "#selecttype1", function () {
    var v = $("select.selecttype1 option:selected").val();
    if (v == "Card") {
      $(".cardsubmit1").removeClass("hidden");
      $(".cashsubmit1").addClass("hidden");
      // $("#amount_received").prop('required', true);
      // $('#amount_received').attr("required");;
      $(".card1").show();
    } else {
      $(".card1").hide();
      $(".cashsubmit1").removeClass("hidden");
      $(".cardsubmit1").addClass("hidden");
      // $("#amount_received").prop('required', false);
      //$('#amount_received').removeAttr('required');
    }
  });
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
  $("#pay_now_appointment1").change(function () {
    if ($(this).prop("checked") == true) {
      $(".deposit_type1").removeClass("hidden");
      $("#editAppointmentForm").find('[name="deposit_type"]').trigger("reset");
      // $('#editAppointmentForm').find('[name="status"]').val("Confirmed").end()
    } else {
      $("#editAppointmentForm").find('[name="deposit_type"]').val("").end();
      $(".deposit_type1").addClass("hidden");
      //  $('#editAppointmentForm').find('[name="status"]').val("").end()

      $(".card1").hide();
    }
  });

  

});
