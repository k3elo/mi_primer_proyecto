<?php

$lang['db_invalid_connection_str'] = 'No se pudieron determinar las configuraciones de la base de datos basándose en la cadena de conexión que envió.';
$lang['db_unable_to_connect'] = 'No se pudo conectar a su servidor de base de datos utilizando la configuración proporcionada.';
$lang['db_unable_to_select'] = 'No se pudo seleccionar la base de datos especificada: %s';
$lang['db_unable_to_create'] = 'No se pudo crear la base de datos especificada: %s';
$lang['db_invalid_query'] = 'La consulta que envió no es válida.';
$lang['db_must_set_table'] = 'Debe establecer la tabla de la base de datos que se utilizará con su consulta.';
$lang['db_must_use_set'] = 'Debe utilizar el método "set" para actualizar una entrada.';
$lang['db_must_use_index'] = 'Debe especificar un índice para que coincida en las actualizaciones por lotes.';
$lang['db_batch_missing_index'] = 'Una o más filas enviadas para la actualización por lotes carecen del índice especificado.';
$lang['db_must_use_where'] = 'No se permiten actualizaciones a menos que contengan una cláusula "where".';
$lang['db_del_must_use_where'] = 'No se permiten eliminaciones a menos que contengan una cláusula "where" o "like".';
$lang['db_field_param_missing'] = 'Para obtener campos, se requiere el nombre de la tabla como parámetro.';
$lang['db_unsupported_function'] = 'Esta función no está disponible para la base de datos que está utilizando.';
$lang['db_transaction_failure'] = 'Fallo en la transacción: se realizó un rollback.';
$lang['db_unable_to_drop'] = 'No se pudo eliminar la base de datos especificada.';
$lang['db_unsuported_feature'] = 'Característica no compatible de la plataforma de base de datos que está utilizando.';
$lang['db_unsuported_compression'] = 'El formato de compresión de archivos que eligió no es compatible con su servidor.';
$lang['db_filepath_error'] = 'No se pudieron escribir datos en la ruta de archivo que ha enviado.';
$lang['db_invalid_cache_path'] = 'La ruta de caché que envió no es válida o no tiene permisos de escritura.';
$lang['db_table_name_required'] = 'Se requiere un nombre de tabla para esa operación.';
$lang['db_column_name_required'] = 'Se requiere un nombre de columna para esa operación.';
$lang['db_column_definition_required'] = 'Se requiere una definición de columna para esa operación.';
$lang['db_unable_to_set_charset'] = 'No se pudo establecer el conjunto de caracteres de la conexión del cliente: %s';
$lang['db_error_heading'] = 'Se produjo un error en la base de datos';

/* End of file db_lang.php */
/* Location: ./system/language/english/db_lang.php */