<!--sidebar end-->
<!--main content start-->
<section id="main-content">
    <section class="wrapper site-min-height">
        <link href="common/extranal/css/patient/patient.css" rel="stylesheet">
       <link href="common/extranal/campo_telefono/css/intlTelInput.css" rel="stylesheet"> <!-- aqui inicializa la funcion para el campo de validacion telefono -->
       
        <section class="">

            <header class="panel-heading">
                <?php echo lang('patient'); ?> <?php echo lang('database'); ?>
                <div class="col-md-4 no-print pull-right"> 
                    <a data-toggle="modal" href="#myModal">
                        <div class="btn-group pull-right">
                            <button id="" class="btn green btn-xs">
                                <i class="fa fa-plus-circle"></i> <?php echo lang('add_new'); ?>
                            </button>
                        </div>
                    </a>
                </div>
            </header>
            <div class="panel-body">

                <div class="adv-table editable-table ">

                    <div class="space15"></div>
                    <table class="table table-striped table-hover table-bordered" id="editable-sample">
                        <thead>
                            <tr>
                                <th><?php echo lang('patient_id'); ?></th>                        
                                <th><?php echo lang('name'); ?></th>
                                <th><?php echo lang('phone'); ?></th>
                                <?php if ($this->ion_auth->in_group(array('admin', 'Accountant', 'Receptionist'))) { ?>
                                    <th><?php echo lang('due_balance'); ?></th>
                                <?php } ?>
                                <th class="no-print"><?php echo lang('options'); ?></th>
                            </tr>
                        </thead>
                        <tbody>
                        
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
        <!-- page end-->
    </section>
</section>
<!--main content end-->
<!--footer start-->

<!-- Add Patient Modal-->
<div class="modal fade" id="myModal" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h4 class="modal-title">  <?php echo lang('register_new_patient'); ?></h4>
            </div>
            <div class="modal-body row">
                <form role="form" id="miFormulario" action="patient/addNew" class="clearfix" method="post" enctype="multipart/form-data">
                    <!-- modificacion de campo rut -->
                    <div class="form-group col-md-6">
                        <label for="rut"><?php echo lang('patient_id'); ?> &#42;</label>
                        <input type="text" class="form-control" name="rut" id="rut" value='' placeholder="Ej: 12345678-k" required="">
                        <span id="rut-error" class="text-danger small"></span>
                    </div>           
                    <div class="form-group col-md-6">
                        <label for="exampleInputEmail1"><?php echo lang('name'); ?> &#42;</label>
                        <input type="text" class="form-control" name="name"  value='' placeholder="" required="">
                    </div>
                   
                    <div class="form-group col-md-6">
                        <label for="email"><?php echo lang('email'); ?> &#42;</label>
                        <input type="email" class="form-control" name="email" id="email" value='' placeholder="Ej: email@email.com" required="">
                        <span id="email-error" class="text-danger small"></span> 
                    </div>
                    <div class="form-group col-md-6">
                        <label for="exampleInputEmail1"><?php echo lang('password'); ?> &#42;</label>
                        <input type="password" class="form-control" name="password"  placeholder="" required="">
                    </div>
                    <div class="form-group col-md-6">
                        <label for="exampleInputEmail1"><?php echo lang('address'); ?> &#42;</label>
                        <input type="text" class="form-control" name="address"  value='' placeholder="" required="">
                    </div>
                    <!-- modificacion del campo texto telefono con gemini -->
                    <div class="form-group col-md-6">
                        <label for="phone"><?php echo lang('phone'); ?> *</label>
                        <input type="tel" class="form-control" id="phone" name="phone" required>
                        <input type="hidden" id="country_code" name="country_code">
                    </div>
                    <div class="form-row">
                        <!-- modificacion del campo select sexo con gemini --> 
                        <div class="form-group col-md-4">
                            <label for="sex"><?php echo lang('sex'); ?></label>
                            <select class="form-control m-bot15" id="sex" name="sex" value="">
                                <option value="Male" <?php echo (!empty($patient->sex) && $patient->sex == 'Male') ? 'selected' : ''; ?>><?php echo lang('male'); ?></option>
                                <option value="Female" <?php echo (!empty($patient->sex) && $patient->sex == 'Female') ? 'selected' : ''; ?>><?php echo lang('female'); ?></option>
                                <option value="Others" <?php echo (!empty($patient->sex) && $patient->sex == 'Others') ? 'selected' : ''; ?>><?php echo lang('others'); ?></option>
                            </select>
                        </div>

                        <div class="form-group col-md-4">
                            <label><?php echo lang('birth_date'); ?></label>
                            <input class="form-control form-control-inline input-medium default-date-picker" type="text" name="birthdate" value="" placeholder="Seleccionar fecha" required="" onkeypress="return false;">      
                        </div>
                    


                        <div class="form-group col-md-4">
                            <label for="exampleInputEmail1"><?php echo lang('blood_group'); ?></label>
                            <select class="form-control m-bot15" name="bloodgroup" value=''>
                                <?php foreach ($groups as $group) { ?>
                                    <option value="<?php echo $group->group; ?>" <?php
                                    if (!empty($patient->bloodgroup)) {
                                        if ($group->group == $patient->bloodgroup) {
                                            echo 'selected';
                                        }
                                    }
                                    ?> > <?php echo $group->group; ?> </option>
                                        <?php } ?> 
                            </select>
                        </div>
                    </div>

                    <div class="form-group col-md-6">    
                        <label for="exampleInputEmail1"><?php echo lang('doctor'); ?></label>
                        <select class="form-control m-bot15" id="doctorchoose1" name="doctor" value=''>

                        </select>
                    </div>



                    <div class="form-group last col-md-6">
                        <label class="control-label">Image Upload</label>
                        <div class="">
                            <div class="fileupload fileupload-new" data-provides="fileupload">
                                <div class="fileupload-new thumbnail img_class">
                                    <img src=""  alt="" />

                                </div>
                                <div class="fileupload-preview fileupload-exists thumbnail img_thumb"></div>
                                <div>
                                    <span class="btn btn-white btn-file">
                                        <span class="fileupload-new"><i class="fa fa-paper-clip"></i> Select image</span>
                                        <span class="fileupload-exists"><i class="fa fa-undo"></i> Change</span>
                                        <input type="file" class="default" name="img_url"/>
                                    </span>
                                    <a href="#" class="btn btn-danger fileupload-exists" data-dismiss="fileupload"><i class="fa fa-trash"></i> Remove</a>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div class="form-group col-md-6">
                        <input type="checkbox" name="sms" value="sms"> <?php echo lang('send_sms') ?><br>
                    </div>


                    <section class="col-md-12">
                        <button type="submit" name="submit" class="btn btn-info pull-right"><?php echo lang('submit'); ?></button>
                    </section>
                </form>

            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div>
<!-- END Add Patient Modal-->

<!-- Edit Patient Modal-->
<div class="modal fade" id="myModal2" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h4 class="modal-title">  <?php echo lang('edit_patient'); ?></h4>
            </div>
            <div class="modal-body row">
                <form role="form" id="editPatientForm" action="patient/addNew" class="clearfix" method="post" enctype="multipart/form-data">

                    <div class="form-group col-md-6">
                        <label for="exampleInputEmail1"><?php echo lang('name'); ?> &#42;</label>
                        <input type="text" class="form-control" name="name"  value='' placeholder="" required="">
                    </div>

                    <div class="form-group col-md-6">
                        <label for="exampleInputEmail1"><?php echo lang('email'); ?> &#42;</label>
                        <input type="text" class="form-control" name="email"  value='' placeholder="" required="">
                    </div>

                    <div class="form-group col-md-6">
                        <label for="exampleInputEmail1"><?php echo lang('change'); ?><?php echo lang('password'); ?></label>
                        <input type="password" class="form-control" name="password"  placeholder="">
                    </div>



                    <div class="form-group col-md-6">
                        <label for="exampleInputEmail1"><?php echo lang('address'); ?> &#42;</label>
                        <input type="text" class="form-control" name="address"  value='' placeholder="" required="">
                    </div>
                    <div class="form-group col-md-6">
                        <label for="exampleInputEmail1"><?php echo lang('phone'); ?> &#42;</label>
                        <input type="text" class="form-control" name="phone"  value='' placeholder="" required="">
                    </div>
                    <div class="form-group col-md-6">
                        <label for="exampleInputEmail1"><?php echo lang('sex'); ?></label>
                        <select class="form-control m-bot15" name="sex" value=''>

                            <option value="Male" <?php
                            if (!empty($patient->sex)) {
                                if ($patient->sex == 'Male') {
                                    echo 'selected';
                                }
                            }
                            ?> ><?php echo lang('male'); ?>  </option>
                            <option value="Female" <?php
                            if (!empty($patient->sex)) {
                                if ($patient->sex == 'Female') {
                                    echo 'selected';
                                }
                            }
                            ?> ><?php echo lang('female'); ?>  </option>
                            <option value="Others" <?php
                            if (!empty($patient->sex)) {
                                if ($patient->sex == 'Others') {
                                    echo 'selected';
                                }
                            }
                            ?> ><?php echo lang('others'); ?>  </option>
                        </select>
                    </div>

                    <div class="form-group col-md-6">
                        <label><?php echo lang('birth_date'); ?></label>
                        <input class="form-control form-control-inline input-medium default-date-picker" type="text" name="birthdate" value="" placeholder="" required="" onkeypress="return false;">      
                    </div>


                    <div class="form-group col-md-6">
                        <label for="exampleInputEmail1"><?php echo lang('blood_group'); ?></label>
                        <select class="form-control m-bot15" name="bloodgroup" value=''>
                            <?php foreach ($groups as $group) { ?>
                                <option value="<?php echo $group->group; ?>" <?php
                                if (!empty($patient->bloodgroup)) {
                                    if ($group->group == $patient->bloodgroup) {
                                        echo 'selected';
                                    }
                                }
                                ?> > <?php echo $group->group; ?> </option>
                                    <?php } ?> 
                        </select>
                    </div>

                    <div class="form-group col-md-6">    
                        <label for="exampleInputEmail1"><?php echo lang('doctor'); ?></label>
                        <select class="form-control m-bot15" id="doctorchoose" name="doctor" value=''>

                        </select>
                    </div>



                    <div class="form-group last col-md-6">
                        <label class="control-label">Image Upload</label>
                        <div class="">
                            <div class="fileupload fileupload-new" data-provides="fileupload">
                                <div class="fileupload-new thumbnail img_class">
                                    <img src="" id="img" alt="" />

                                </div>
                                <div class="fileupload-preview fileupload-exists thumbnail img_thumb"></div>
                                <div>
                                    <span class="btn btn-white btn-file">
                                        <span class="fileupload-new"><i class="fa fa-paper-clip"></i> Select image</span>
                                        <span class="fileupload-exists"><i class="fa fa-undo"></i> Change</span>
                                        <input type="file" class="default" name="img_url"/>
                                    </span>
                                    <a href="#" class="btn btn-danger fileupload-exists" data-dismiss="fileupload"><i class="fa fa-trash"></i> Remove</a>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div class="form-group col-md-6">
                        <input type="checkbox" name="sms" value="sms"> <?php echo lang('send_sms') ?><br>
                    </div>

                    <input type="hidden" name="id" value=''>
                    <input type="hidden" name="p_id" value='<?php
                    if (!empty($patient->patient_id)) {
                        echo $patient->patient_id;
                    }
                    ?>'>
                    <section class="col-md-12">
                        <button type="submit" name="submit" class="btn btn-info pull-right"><?php echo lang('submit'); ?></button>
                    </section>

                </form>

            </div><!-- /.modal-content -->
        </div><!-- /.modal-dialog -->
    </div>
</div>
<!-- END Edit Patient Modal-->

<!-- info Modal -->
<div class="modal fade" id="infoModal" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg"> 
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h4 class="modal-title">  <?php echo lang('patient'); ?>  <?php echo lang('info'); ?></h4>
            </div>
            <div class="modal-body row">
                <form role="form"  action="patient/addNew" class="clearfix" method="post" enctype="multipart/form-data">

                    <div class="form-group last col-md-4">
                        <div class="">
                            <div class="fileupload fileupload-new" data-provides="fileupload">
                                <div class="fileupload-new thumbnail img_class">
                                <img src="" id="img1" alt="" />
                                </div>
                                <div class="fileupload-preview fileupload-exists thumbnail img_thumb"></div>
                            </div>
                            <div class="col-md-12">
                                <label for="exampleInputEmail1"><?php echo lang('patient_id'); ?>: <span class="patientIdClass"></span></label>
                            </div>
                        </div>

                    </div>
                    <div class="form-group col-md-4">
                        <label for="exampleInputEmail1"><?php echo lang('name'); ?></label>
                        <div class="nameClass"></div>
                    </div>


                    <div class="form-group col-md-4">
                        <label for="exampleInputEmail1"><?php echo lang('email'); ?></label>
                        <div class="emailClass"></div>
                    </div>

                    <div class="form-group col-md-4">
                        <label><?php echo lang('age'); ?></label>
                        <div class="ageClass"></div>     
                    </div>

                    <div class="form-group col-md-4">
                        <label for="exampleInputEmail1"><?php echo lang('address'); ?></label>
                        <div class="addressClass"></div>
                    </div>

                    <div class="form-group col-md-4">
                        <label for="exampleInputEmail1"><?php echo lang('gender'); ?></label>
                        <div class="genderClass"></div>
                    </div>

                    <div class="form-group col-md-4">
                        <label for="exampleInputEmail1"><?php echo lang('phone'); ?></label>
                        <div class="phoneClass"></div>
                    </div>

                    <div class="form-group col-md-4">
                        <label for="exampleInputEmail1"><?php echo lang('blood_group'); ?></label>
                        <div class="bloodgroupClass"></div>
                    </div>

                    <div class="form-group col-md-4">
                        <label><?php echo lang('birth_date'); ?></label>
                        <div class="birthdateClass"></div>     
                    </div>


                    <div class="form-group col-md-4">    
                    </div>
                    <div class="form-group col-md-4">    
                    </div>
                    <div class="form-group col-md-4">    
                        <label for="exampleInputEmail1"><?php echo lang('doctor'); ?></label>
                        <div class="doctorClass"></div>
                    </div>







                </form>

            </div><!-- /.modal-content -->
        </div><!-- /.modal-dialog -->
    </div>
</div>
<!-- END info Modal -->


<!-- <script src="common/js/jquery-3.6.0.min.js"></script> -->
<!-- <script src="common/js/popper.min.js"></script> -->
<script src="common/js/codearistos.min.js"></script>
<script type="text/javascript">var select_doctor = "<?php echo lang('select_doctor'); ?>";</script>
<script type="text/javascript">var language = "<?php echo $this->language; ?>";</script>
<script src="common/extranal/js/patient/patient.js"></script>
<script src="common/extranal/campo_telefono/js/utils.js"></script> <!-- aqui inicializo utils.js para que el campo telefono funcione -->
<script src="common/extranal/campo_telefono/js/intlTelInputWithUtils.min.js"></script>
<script>
    var translations = {
        male: "<?php echo lang('male'); ?>",
        female: "<?php echo lang('female'); ?>",
        other: "<?php echo lang('others'); ?>"
    };
</script>


<!-- para validar el campo telefono -->
<script>
  var input = document.querySelector("#phone");
  var iti = window.intlTelInput(input, {
    initialCountry: "CL", // Código de país por defecto (puedes personalizarlo)
    separateDialCode: true, // Mostrar el código de país separado
    utilsScript: "common/extranal/campo_telefono/js/utils.js", // Ruta al archivo utils.js de intl-tel-input (necesario para la validación)
    nationalMode: false,
    formatOnDisplay: false
  });
 
  // Escucha el evento "countrychange" para actualizar el campo oculto
  input.addEventListener("countrychange", function() {
    var countryCode = iti.getSelectedCountryData().iso2;
    document.querySelector("#country_code").value = countryCode;
  });
</script>
<script>

$(document).ready(function() {
    var inputRut = document.getElementById('rut');
    var errorSpan = document.getElementById('rut-error');
    var emailInput = document.getElementById('email');
    var emailError = document.getElementById('email-error');
    const form = document.getElementById('miFormulario');

    var Fn = {
        validaRut: function(rutCompleto) {
            rutCompleto = rutCompleto.replace("‐", "-");
            if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rutCompleto))
                return false;
            var tmp = rutCompleto.split('-');
            var digv = tmp[1];
            var rut = tmp[0];
            if (digv == 'K') digv = 'k';

            return (Fn.dv(rut) == digv);
        },
        dv: function(T) {
            var M = 0,
                S = 1;
            for (; T; T = Math.floor(T / 10))
                S = (S + T % 10 * (9 - M++ % 6)) % 11;
            return S ? S - 1 : 'k';
        }
    };

    inputRut.addEventListener('input', function() {
        let rut = this.value;

        if (!Fn.validaRut(rut)) {
            errorSpan.textContent = "RUT inválido";
            return;
        } else {
            errorSpan.textContent = "";
        }

        let formData = new FormData();
        formData.append('rut', rut);

        fetch('<?php echo base_url('patient/check_rut'); ?>', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.exists) {
                errorSpan.textContent = "Este RUT ya está registrado";
            } else {
                errorSpan.textContent = "";
            }
        })
        .catch(error => {
            console.error('Error:', error);
            errorSpan.textContent = "Error al verificar el RUT";
        });
    });

    $(form).on('submit', function(event) {
        event.preventDefault();

        // Validación del RUT
        if (!Fn.validaRut(inputRut.value)) {
            errorSpan.textContent = "RUT inválido";
            return;
        } else {
            errorSpan.textContent = "";
        }

        // Validación del email (en el backend)
        const emailInput = document.getElementById('email');
        const emailError = document.getElementById('email-error');

        $.ajax({
            url: '<?php echo base_url('patient/validar_email'); ?>', // Reemplaza con la URL correcta
            type: 'POST',
            data: { email: emailInput.value },
            dataType: 'json',
            success: function(response) {
                if (response.status === false) {
                    console.log("Email inválido:", response.message); // Mensaje en la consola
                    emailError.textContent = response.message;
                    return; // Detiene el envío si el email es inválido
                } else {
                    emailError.textContent = "";
                    // Si el email es válido, continúa con la petición AJAX del RUT y el envío del formulario
                    let formData = new FormData();
                    formData.append('rut', inputRut.value);

                    const url = '<?php echo base_url('patient/check_rut'); ?>';

                    fetch(url, {
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
                            errorSpan.textContent = "Este RUT ya está registrado";
                        } else if (data && data.error) {
                            console.error("Error del servidor:", data.error);
                            errorSpan.textContent = data.error;
                        } else {
                            console.log("RUT válido y no registrado. Enviando formulario.");
                            form.__proto__.submit.call(form);
                        }
                    })
                    .catch(error => {
                        console.error('Error en la petición fetch:', error);
                        errorSpan.textContent = "Error al verificar el RUT (intenta nuevamente)";
                    });
                }
            },
            error: function(error) {
                console.error('Error en la petición AJAX:', error);
                emailError.textContent = "Error al validar el email";
            }
        });
    });
});

</script>