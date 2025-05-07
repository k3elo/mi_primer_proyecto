"use strict";
$(".default-date-picker").datepicker({
  format: "dd-mm-yyyy",
  autoclose: true,
});
$("#date").on("changeDate", function () {
  "use strict";
  $("#date").datepicker("hide");
});
$("#date1").on("changeDate", function () {
  "use strict";
  $("#date1").datepicker("hide");
});
$(document).ready(function () {
  "use strict";
  $(".timepicker-default").timepicker({ defaultTime: "value" });
});
$(document).ready(function () {
  "use strict";
  $(".pos_client").hide();
  $(".pos_client_id").hide();
  $(document.body).on("change", "#pos_select", function () {
    "use strict";
    var v = $("select.pos_select option:selected").val();
    if (v === "add_new") {
      $(".pos_client").show();
      $(".pos_client_id").hide();
    } else if (v === "patient_id") {
      $(".pos_client_id").show();
      $(".pos_client").hide();
    } else {
      $(".pos_client_id").hide();
      $(".pos_client").hide();
    }
  });
});
$(document).ready(function () {
  "use strict";
  $(".appointment").hide();
  $(document.body).on("click", "#appointment", function () {
    "use strict";
    if ($(".appointment").is(":hidden")) {
      $(".appointment").show();
    } else {
      $(".appointment").hide();
    }
  });
});

/* $(document).ready(function () {
  "use strict";
  $(".doctor_div").on("change", "#adoctors", function () {
    "use strict";

    var id = $("#appointment_id").val();
    var date = $("#date").val();
    var doctorr = $("#adoctors").val();
    $("#visit_description").html(" ");
    $("#aslots").find("option").remove();

    $.ajax({
      url:
        "frontend/getAvailableSlotByDoctorByDateByJason?date=" +
        date +
        "&doctor=" +
        doctorr,
      method: "GET",
      data: "",
      dataType: "json",
    }).done(function (response) {
      "use strict";
      var slots = response.aslots;
      $.each(slots, function (key, value) {
        $("#aslots").append($("<option>").text(value).val(value)).end();
      });

      if ($("#aslots").has("option").length === 0) {
        $("#aslots")
          .append(
            $("<option>").text("No Available Time Slots").val("Not Selected")
          )
          .end();
      }
      $("#visit_charges").val(" ");
      $.ajax({
        url: "frontend/getDoctorVisit?id=" + doctorr,
        method: "GET",
        data: "",
        dataType: "json",
      }).done(function (response) {
        $("#visit_description").html(response.response).end();
      });
    });
  });
}); */

$(document).ready(function () {
  $("#visit_description").change(function () {
    // Get the record's ID via attribute
    var id = $(this).val();

    $("#visit_charges").val(" ");
    $("#grand_total").val(" ");
    // $('#default').trigger("reset");

    $.ajax({
      url: "frontend/getDoctorVisitCharges?id=" + id,
      method: "GET",
      data: "",
      dataType: "json",
    }).done(function (response) {
      $("#visit_charges").val(response.response.visit_charges).end();
      var discount = $("#discount").val();
      $("#grand_total")
        .val(parseFloat(response.response.visit_charges - discount))
        .end();
    });
  });
  $(".card1").hide();
  $("#pay_now_appointment").change(function () {
    if (this.checked) {
      $(".card1").show();

      if (
        payment_gateway != "Pay U Money" &&
        payment_gateway != "Paystack" &&
        payment_gateway != "SSLCOMMERZ" &&
        payment_gateway != "Paytm"
      ) {
        $("#expire").prop("required", true);
        $("#cvv").prop("required", true);
      }
    } else {
      $(".card1").hide();
      if (
        payment_gateway != "Pay U Money" &&
        payment_gateway != "Paystack" &&
        payment_gateway != "SSLCOMMERZ" &&
        payment_gateway != "Paytm"
      ) {
        $("#expire").removeAttr("required");
        $("#cvv").removeAttr("required");
      }
    }
  });
});

$(document).ready(function () {
 /*  "use strict";
  var id = $("#appointment_id").val();
  var date = $("#date").val();
  var doctorr = $("#adoctors").val();
  $("#aslots").find("option").remove();

  $.ajax({
    url:
      "frontend/getAvailableSlotByDoctorByDateByJason?date=" +
      date +
      "&doctor=" +
      doctorr,
    method: "GET",
    data: "",
    dataType: "json",
  }).done(function (response) {
    "use strict";
    var slots = response.aslots;
    $.each(response.aslots, function (key, value) {
      "use strict";
      $("#aslots").append($("<option>").text(value).val(value)).end();
    });
    $("#aslots")
      .val(response.current_value)
      .find("option[value=" + response.current_value + "]")
      .attr("selected", true);

    if ($("#aslots").has("option").length === 0) {
      //if it is blank.
      $("#aslots")
        .append(
          $("<option>").text("No Available Time Slots").val("Not Selected")
        )
        .end();
    }
  }); */

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

    // Limpiar el campo #date
    $("#date").val(''); // Restablecer el valor del campo a vacío

    $.ajax({
        url: "frontend/getAvailableDatesByDoctor?doctor=" + doctorId,
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
              $("#date").attr("placeholder", "Seleccione un día disponible");
          } else {
              if ($("#date").data('datepicker')) {// Verificar si el datepicker ya existe
                  $("#date").datepicker('destroy');// Destruir el datepicker existente
                  
              }
              datepickerInitialized = false;
              $("#date").attr("placeholder", "No hay días disponibles");
              // Limpiar las opciones existentes y agregar el mensaje de "No hay horas disponibles"
              $("#aslots").empty(); // Limpiar las opciones existentes
              $("#aslots").append('<option value="" disabled selected>No hay horas disponibles</option>');
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
    console.log("initializeDatePicker llamada con:", availableDatesArray);

    /* // Verificar si hay días disponibles
    if (availableDatesArray.length > 0) {
        // Mostrar mensaje en el campo #date
        $("#date").attr("placeholder", "Seleccione un día disponible");
    } else {
        // Si no hay días disponibles, mostrar mensaje de advertencia
        $("#date").attr("placeholder", "No hay días disponibles");
    } */

    // Inicializar el datepicker
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
          "frontend/getAvailableSlotByDoctorByDateByJason_1?date=" +
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
                $("<option>").text("No hay más horas horarias").val("No seleccionado")
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


  "use strict";
  $(".caption img").removeAttr("style");
  var windowH = $(window).width();
  $(".caption img").css("width", windowH + "px");
  $(".caption img").css("height", "500px");


  $(function () {
    "use strict";
    $(".navoption").on("click", "a[href*=\\#]:not([href=\\#])", function () {
      "use strict";

      if (
        location.pathname.replace(/^\//, "") ==
          this.pathname.replace(/^\//, "") &&
        location.hostname == this.hostname
      ) {
        var target = $(this.hash);
        target = target.length ? target : $("[name=" + this.hash.slice(1) + "]");
        if (target.length) {
          $("html,body").animate(
            {
              scrollTop: target.offset().top,
            },
            1000
          );
          return false;
        }
      }
    });
  });
  $(document).ready(function () {
    "use strict";
    $(".headerSlider").owlCarousel({
      loop: true,
      autoplay: true,
      autoplayTimeout: 5000,
      autoplayHoverPause: false,
      dots: true,
      nav: false,
      navText: [
        "<div class='hd-nav-btn nav-btn-left'><i class='fa fa-chevron-left fa-2x'></i></div>",
        "<div class='hd-nav-btn nav-btn-right'><i class='fa fa-chevron-right fa-2x'></i></div>",
      ],
      navigation: true,
      pagination: true,
      responsiveClass: true,
      responsive: {
        0: {
          items: 1,
          loop: true,
        },
        600: {
          items: 1,
          loop: true,
        },
        1000: {
          items: 1,
          loop: true,
        },
      },
    });
  });
  function cardValidation() {
    var valid = true;
    var cardNumber = $("#card").val();
    var expire = $("#expire").val();
    var cvc = $("#cvv").val();

    $("#error-message").html("").hide();

    if (cardNumber.trim() == "") {
      valid = false;
    }

    if (expire.trim() == "") {
      valid = false;
    }
    if (cvc.trim() == "") {
      valid = false;
    }

    if (valid == false) {
      $("#error-message").html("All Fields are required").show();
    }

    return valid;
  }
  //set your publishable key
  Stripe.setPublishableKey(publish);

  //callback to handle the response from stripe
  function stripeResponseHandler(status, response) {
    if (response.error) {
      //enable the submit button
      $("#submit-btn").show();
      $("#loader").css("display", "none");
      //display the errors on the form
      $("#error-message").html(response.error.message).show();
    } else {
      //get token id
      var token = response["id"];
      //insert the token into the form
      $("#token").val(token);
      $("#addAppointmentForm").append(
        "<input type='hidden' name='token' value='" + token + "' />"
      );
      //submit form to the server
      $("#addAppointmentForm").submit();
    }
  }

  function stripePay(e) {
    e.preventDefault();
    var valid = cardValidation();

    if (valid == true) {
      $("#submit-btn").attr("disabled", true);
      $("#loader").css("display", "inline-block");
      var expire = $("#expire").val();
      var arr = expire.split("/");
      Stripe.createToken(
        {
          number: $("#card").val(),
          cvc: $("#cvv").val(),
          exp_month: arr[0],
          exp_year: arr[1],
        },
        stripeResponseHandler
      );

      //submit from callback
      return false;
    }
  }
  if (payment_gateway == "2Checkout") {
    var successCallback = function (data) {
      "use strict";
      var myForm = document.getElementById("addAppointmentForm");

      $("#addAppointmentForm").append(
        "<input type='hidden' name='token' value='" +
          data.response.token.token +
          "' />"
      );

      myForm.submit();
    };
    // Called when token creation fails.
    var errorCallback = function (data) {
      "use strict";
      if (data.errorCode === 200) {
        tokenRequest();
      } else {
        alert(data.errorMsg);
      }
    };
    var tokenRequest = function () {
      "use strict";
      var expire = $("#expire").val();
      var expiresep = expire.split("/");
      var dateformat = moment(expiresep[1], "YY");
      var year = dateformat.format("YYYY");
      var args = {
        sellerId: merchant,
        publishableKey: publishable,
        ccNo: $("#card").val(),
        cvv: $("#cvv").val(),
        expMonth: expiresep[0],
        expYear: year,
      };
      console.log(
        $("#card").val() + "-" + $("#cvv").val() + expiresep[0] + year + merchant
      );

      TCO.requestToken(successCallback, errorCallback, args);
    };

    function twoCheckoutPay(e) {
      "use strict";
      e.preventDefault();

      TCO.loadPubKey("sandbox", function () {
        // for sandbox environment
        publishableKey = publishable; //your public key
        tokenRequest();
      });

      return false;
    }    
  }

  //campo toma de cita//////////////////////////////////////////////////////////////////////////////////////// 
 
    // Cargar departamentos al cargar la página
    function loadDepartments() {
        //console.log("Cargando departamentos..."); // Log para verificar que la función se ejecuta
        var departmentSelect = $('#department');

        // Limpia el campo de departamentos
        departmentSelect.empty();
        departmentSelect.append('<option value="">Seleccionar .....</option>');

        $.ajax({
            url: 'frontend/getDepartments', // Ruta al método del controlador que devuelve los departamentos
            method: 'GET',
            dataType: 'json',
            success: function (response) {
                if (response.error) {
                    alert(response.error);
                } else {
                    $.each(response, function (index, department) {
                        departmentSelect.append('<option value="' + department.id + '">' + department.name + '</option>');
                    });
                }
            },
            error: function () {
                alert('Error al obtener los médicos. Inténtalo de nuevo.');
            }
        });
    }

    // Llama a la función para cargar los departamentos
    loadDepartments();

    // Filtrar doctores según el departamento seleccionado
    $('#department').on('change', function () {
        var departmentId = $(this).val();
        var doctorSelect = $('#adoctors');

        // Limpia el campo de doctores
        doctorSelect.empty();
        doctorSelect.append('<option value="">Seleccionar Médico .....</option>');

        if (departmentId) {
            $.ajax({
                url: 'frontend/getDoctorsByDepartment',
                method: 'GET',
                data: { department_id: departmentId },
                dataType: 'json',
                success: function (response) {
                    if (response.error) {
                        alert(response.error);
                    } else {
                        $.each(response, function (index, doctor) {
                            doctorSelect.append('<option value="' + doctor.id + '">' + doctor.name + '</option>');
                        });
                    }
                },
                error: function () {
                    alert('Error al obtener los médicos. Inténtalo de nuevo.');
                }
            });
        }
    });

    //valida campo rut y campo email//////////////////////////////////////////////////////////////////////////////////////////

    "use strict";

    // Variables para los campos de RUT y email
    var inputRut = $('#rut'); // Usando jQuery para seleccionar el campo RUT
    var errorSpan = $('#rut-error'); // Asegúrate de tener un elemento con este ID para mostrar errores
    var modalRegister = $('#registerPatientModal'); // Modal para registrar datos del paciente
    var modalAppointment = $('#exampleModal'); // Modal de la cita médica
    var emailInput = $('#email'); // Usando jQuery para seleccionar el campo email
    var emailError = $('#email-error'); // Asegúrate de tener un elemento con este ID para mostrar errores
    const form = $('#miFormulario'); // Usando jQuery para seleccionar el formulario

    // Funciones para validar el RUT
    var Fn = {
        validaRut: function (rutCompleto) {
            rutCompleto = rutCompleto.replace("‐", "-");
            if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rutCompleto))
                return false;
            var tmp = rutCompleto.split('-');
            var digv = tmp[1];
            var rut = tmp[0];
            if (digv == 'K') digv = 'k';

            return (Fn.dv(rut) == digv);
        },
        dv: function (T) {
            var M = 0,
                S = 1;
            for (; T; T = Math.floor(T / 10))
                S = (S + T % 10 * (9 - M++ % 6)) % 11;
            return S ? S - 1 : 'k';
        }
    };

    // Validación del RUT en tiempo real
    inputRut.on('input', function () {
        let rut = $(this).val(); // Obtener el valor del campo RUT

        if (!Fn.validaRut(rut)) {
            errorSpan.text("RUT inválido");
            return;
        } else {
            errorSpan.text("");
        }

        // Verificar si el RUT ya está registrado
        let formData = new FormData();
        formData.append('rut', rut);

        fetch('frontend/check_rut', { // Cambia la URL según tu configuración
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.exists) {
                    errorSpan.text("Este RUT ya está registrado");
                } else {
                    errorSpan.text("");
                    // Mostrar el modal de registro encima del modal actual
                    modalAppointment.modal('hide'); // Ocultar el modal actual
                    modalRegister.modal('show'); // Mostrar el modal de registro
                }
            })
            .catch(error => {
                console.error('Error:', error);
                errorSpan.text("Error al verificar el RUT");
            });
    });

    // Cuando se cierra el modal de registro, volver al modal de cita
    modalRegister.on('hidden.bs.modal', function () {
      modalAppointment.modal('show'); // Mostrar el modal de cita nuevamente
    });

    // Validación del formulario al enviarlo////////////////
    form.on('submit', function (event) {
        event.preventDefault(); // Evitar el envío del formulario por defecto

        // Validación del RUT
        if (!Fn.validaRut(inputRut.val())) {
            errorSpan.text("RUT inválido");
            return;
        } else {
            errorSpan.text("");
        }

        // Validación del email
        $.ajax({
            url: 'frontend/validar_email', // Cambia la URL según tu configuración
            type: 'POST',
            data: { email: emailInput.val() },
            dataType: 'json',
            success: function (response) {
                if (response.status === false) {
                    console.log("Email inválido:", response.message);
                    emailError.text(response.message);
                    return; // Detener el envío si el email es inválido
                } else {
                    emailError.text("");

                    // Si el email es válido, verificar el RUT y enviar el formulario
                    let formData = new FormData();
                    formData.append('rut', inputRut.val());

                    fetch('frontend/check_rut', { // Cambia la URL según tu configuración
                        method: 'POST',
                        body: formData
                    })
                        .then(response => {
                            if (!response.ok) {
                                console.error("Error HTTP:", response.status, response.statusText);
                                throw new Error('Error en la petición');
                            }
                            return response.json();
                        })
                        .then(data => {
                            if (data && data.exists) {
                                errorSpan.text("Este RUT ya está registrado");
                            } else if (data && data.error) {
                                console.error("Error del servidor:", data.error);
                                errorSpan.text(data.error);
                            } else {
                                console.log("RUT válido y no registrado. Enviando formulario.");
                                form[0].submit(); // Enviar el formulario
                            }
                        })
                        .catch(error => {
                            console.error('Error en la petición fetch:', error);
                            errorSpan.text("Error al verificar el RUT (intenta nuevamente)");
                        });
                }
            },
            error: function (error) {
                console.error('Error en la petición AJAX:', error);
                emailError.text("Error al validar el email");
            }
        });
    });
    // Fin de la validación del formulario rut y email//////////////////////////////////////////////////////////////////////////////////////////
    
    //termina el campo toma de cita//////////////////////////////////////////////////////////


}); 
