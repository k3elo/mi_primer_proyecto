<?php

$lang['email_must_be_array'] = "El método de validación de correo electrónico debe recibir un array.";
$lang['email_invalid_address'] = "Dirección de correo electrónico no válida: %s";
$lang['email_attachment_missing'] = "No se pudo encontrar el siguiente archivo adjunto al correo electrónico: %s";
$lang['email_attachment_unreadable'] = "No se pudo abrir este archivo adjunto: %s";
$lang['email_no_recipients'] = "Debe incluir destinatarios: Para, Cc o Cco"; // Cco = Copia oculta
$lang['email_send_failure_phpmail'] = "No se pudo enviar el correo electrónico usando PHP mail(). Es posible que su servidor no esté configurado para enviar correo usando este método.";
$lang['email_send_failure_sendmail'] = "No se pudo enviar el correo electrónico usando PHP Sendmail. Es posible que su servidor no esté configurado para enviar correo usando este método.";
$lang['email_send_failure_smtp'] = "No se pudo enviar el correo electrónico usando PHP SMTP. Es posible que su servidor no esté configurado para enviar correo usando este método.";
$lang['email_sent'] = "Su mensaje ha sido enviado correctamente usando el siguiente protocolo: %s";
$lang['email_no_socket'] = "No se pudo abrir un socket a Sendmail. Por favor, revise la configuración.";
$lang['email_no_hostname'] = "No especificó un nombre de host SMTP.";
$lang['email_smtp_error'] = "Se encontró el siguiente error SMTP: %s";
$lang['email_no_smtp_unpw'] = "Error: Debe asignar un nombre de usuario y contraseña SMTP.";
$lang['email_failed_smtp_login'] = "No se pudo enviar el comando AUTH LOGIN. Error: %s";
$lang['email_smtp_auth_un'] = "Falló la autenticación del nombre de usuario. Error: %s";
$lang['email_smtp_auth_pw'] = "Falló la autenticación de la contraseña. Error: %s";
$lang['email_smtp_data_failure'] = "No se pudieron enviar los datos: %s";
$lang['email_exit_status'] = "Código de estado de salida: %s";


/* End of file email_lang.php */
/* Location: ./system/language/english/email_lang.php */