<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Schedule_model extends CI_model {

    function __construct() {
        parent::__construct();
        $this->load->database();
    }

    function getSchedule() {
        $query = $this->db->get('time_schedule');
        return $query->result();
    }

    // funcion para obtener los días disponibles para un doctor específico
    public function getAvailableDatesByDoctor($doctor_id) {
        try {
            if (empty($doctor_id)) {
                //log_message('error', 'Doctor ID no proporcionado');
                return [];
            }
    
            // Obtener los días de la semana disponibles para el doctor
            $this->db->select('DISTINCT(weekday)', false);
            $this->db->from('time_slot');
            $this->db->where('doctor', $doctor_id);
            $query = $this->db->get();
    
            if (!$query) {
                //log_message('error', 'Error en consulta de días disponibles');
                return [];
            }
    
            $available_weekdays = [];
            foreach ($query->result() as $row) {
                $available_weekdays[] = $row->weekday;
            }
    
            if (empty($available_weekdays)) {
                //log_message('debug', 'No hay días configurados para el doctor');
                return [];
            }
    
            // Calcular las fechas futuras basadas en los días de la semana disponibles
            $available_dates = [];
            $today = new DateTime();
    
            for ($i = 0; $i < 30; $i++) {
                $date = clone $today;
                $date->modify("+$i day");
                $weekday = $date->format('l');
                $date_formatted_ymd = $date->format('Y-m-d');
                $date_timestamp = strtotime($date_formatted_ymd); // Convertir a timestamp al inicio del día
                //log_message('debug', 'Verificando día $date_timestamp : ' . $date_timestamp);
                if (in_array($weekday, $available_weekdays)) {
                    // Verificar si hay slots disponibles para este día
                    $slots = $this->getAvailableSlotByDoctorByDate2($date_timestamp, $doctor_id); // Pasar el timestamp
    
                    // Agregar esta línea para ver el resultado
                    //log_message('debug', 'Resultado de getAvailableSlotByDoctorByDate2 para (timestamp) ' . $date_timestamp . ': ' . json_encode($slots));
    
                    // Validación más estricta de slots disponibles
                    if ($slots && count($slots) > 0) {
                        $available_dates[] = $date->format('d-m-Y'); // Devolver en formato para el datepicker
                        //log_message('debug', 'Fecha (d-m-Y) ' . $date->format('d-m-Y') . ' agregada con slots: ' . json_encode($slots));
                    } else {
                        //log_message('debug', 'Fecha (Y-m-d) ' . $date_formatted_ymd . ' descartada por no tener slots disponibles');
                    }
                }
            }
    
            return $available_dates;
    
        } catch (Exception $e) {
            log_message('error', 'Error en getAvailableDatesByDoctor: ' . $e->getMessage());
            return [];
        }
    }
    
    // Modificar también el método getAvailableSlotByDoctorByDate2
    public function getAvailableSlotByDoctorByDate2($date, $doctor) {
        try {
            $dateTime = new DateTime('@' . $date, new DateTimeZone('America/Santiago'));
            $weekday = $dateTime->format('l');
            //$weekday = date('l', strtotime($date));
            //log_message('debug', 'Weekday para el timestamp ' . $date . ': ' . $weekday);
            // 1. Verificar si es un día festivo
            $this->db->where('date', $date);
            $this->db->where('doctor', $doctor);
            $holiday = $this->db->get('holidays')->result();
            
            if (!empty($holiday)) {
                //log_message('debug', 'Día festivo encontrado para fecha ' . $date);
                return [];
            }
    
            // 2. Obtener los slots configurados para ese día
            $this->db->where('doctor', $doctor);
            $this->db->where('weekday', $weekday);
            $this->db->order_by('s_time_key', 'asc');
            $query1 = $this->db->get('time_slot')->result();
            //log_message('debug', 'Slots configurados para ' . $date . ': ' . json_encode($query1));
    
            // Si no hay slots configurados para este día, retornar array vacío
            if (empty($query1)) {
                //log_message('debug', 'No hay slots configurados para el día ' . $date . ' y doctor ' . $doctor);
                return [];
            }
    
            // 3. Obtener citas existentes para ese día
            $this->db->where('date', $date);
            $this->db->where('doctor', $doctor);
            //$this->db->where('status !=', 'Cancelled');
            $query = $this->db->get('appointment')->result();
            //log_message('debug', 'fechas de citas medicas query ' . $date . ': ' . json_encode($query));
    
            $availabletimeSlot = [];
            $bookedTimeSlot = [];
    
            // 4. Recopilar slots configurados y validar que no estén vacíos
            foreach ($query1 as $timeslot) {
                $slot = $timeslot->s_time . ' To ' . $timeslot->e_time;
                if (!empty($slot)) {
                    $availabletimeSlot[] = $slot;
                }
            }
            //log_message('debug', 'availabletimeSlot después del primer foreach: ' . json_encode($availabletimeSlot));
    
            // Si no hay slots configurados válidos, retornar array vacío
            if (empty($availabletimeSlot)) {
                //log_message('debug', 'No hay slots configurados válidos para el día ' . $date);
                return [];
            }
    
            // 5. Recopilar slots reservados válidos
            foreach ($query as $bookedTime) {
                if ($bookedTime->status != 'Cancelled') {
                    $bookedTimeSlot[] = $bookedTime->time_slot;
                }
            }
            //log_message('debug', 'bookedTimeSlot después del segundo foreach: ' . json_encode($bookedTimeSlot));
    
            // 6. Encontrar slots realmente disponibles
            $availableSlot = array_diff($availabletimeSlot, $bookedTimeSlot);
    
            // 7. Verificar si hay slots disponibles después de filtrar
            if (empty($availableSlot)) {
                //log_message('debug', 'No quedan slots disponibles para el día ' . $date . ' después de filtrar reservas');
                return [];
            }

            // 8. Verificar si la fecha es futura (COMPARANDO SOLO LA FECHA)
            if (date('Y-m-d', $date) < date('Y-m-d', time())) {
                //log_message('debug', 'La fecha (timestamp) ' . $date . ' es anterior a hoy');
                return [];
            }
    
            /* // 8. Verificar si la fecha es futura
            if (strtotime($date) < strtotime(date('Y-m-d'))) {
                log_message('debug', 'La fecha ' . $date . ' es anterior a hoy');
                return [];
            } */
    
            // 9. Si la fecha es hoy, verificar horarios pasados
            /* if (date('Y-m-d', $date) == date('Y-m-d')) {
                $currentTime = date('H:i');
                log_message('debug', 'Hora actual del servidor (H:i): ' . $currentTime);
            
                $availabletimeSlot = array_filter($availabletimeSlot, function ($slot) use ($currentTime) {
                    $parts = explode(' To ', $slot);
                    if (isset($parts[0])) {
                        $startTimeString = trim($parts[0]);
                        $startTime24 = date('H:i', strtotime($startTimeString));
                        log_message('debug', 'Hora de inicio del slot (24h): ' . $startTime24 . ', Slot original: ' . $slot);
                        return strtotime($startTime24) >= strtotime($currentTime);
                    }
                    return false;
                });
            } */
    
            // 10. Reindexar array y loggear resultado
            $availableSlot = array_values($availableSlot);
            //log_message('debug', 'Slots disponibles para fecha ' . $date . ': ' . json_encode($availableSlot));
            
            return $availableSlot;
    
        } catch (Exception $e) {
            //log_message('error', 'Error en getAvailableSlotByDoctorByDate2: ' . $e->getMessage());
            return [];
        }
    } 

    function getAvailableDoctorByDate($date) {

        $weekday = strftime("%A", $date);
        $this->db->where('date', $date);
        $query1 = $this->db->get('holidays')->result();
        if (!empty($query1)) {
            $doctor = array();
            foreach ($query1 as $q1) {
                $doctor[] = $q1->doctor;
            }
            $this->db->where_not_in('id', $staff);
        }

        $query = $this->db->get('doctor')->result();
        foreach ($query as $availableDoctor) {
            $this->db->where('doctor', $availableDoctor->id);
            $this->db->where('weekday', $weekday);
            $query_slot = $this->db->get('time_slot')->result();

            if (!empty($query_slot)) {
                $doctor_avail[] = $availableDoctor->id;
            }
        }
        $this->db->where_in('id', $doctor_avail);
        $query_avail_doctor = $this->db->get('doctor');
        return $query_avail_doctor->result();
    }

    function getAvailableDoctorsByDateBySlot($date, $slot) {

        $weekday = strftime("%A", $date);
        $this->db->where('date', $date);
        $query1 = $this->db->get('holidays')->result();
        if (!empty($query1)) {
            $doctor = array();
            foreach ($query1 as $q1) {
                $doctor[] = $q1->doctor;
            }
            $this->db->where_not_in('id', $doctor);
        }

        $query = $this->db->get('doctor')->result();
        foreach ($query as $availableDoctor) {
            $this->db->where('doctor', $availableDoctor->id);
            $this->db->where('weekday', $weekday);
            $query_slot = $this->db->get('time_slot')->result();

            if (!empty($query_slot)) {
                $doctor_avail[] = $availableDoctor->id;
            }
        }

        foreach ($doctor_avail as $key => $value) {
            $this->db->where('doctor', $value);
            $this->db->where('date', $date);
            $this->db->where('time_slot', $slot);
            $query_appointment = $this->db->get('appointment')->result();

            if (empty($query_appointment)) {
                $most_probable_avail_doctor[] = $value;
            }
        }
        $this->db->where_in('id', $most_probable_avail_doctor);
        $query_avail_doctor = $this->db->get('staff');
        return $query_avail_doctor->result();
    }
        //esta funcion es para obtener los slots segun dias seleccionado
    function getAvailableSlotByDoctorByDate($date, $doctor) {
        //$newDate = date("m-d-Y", strtotime($date));
        $weekday = strftime("%A", $date);

        $this->db->where('date', $date);
        $this->db->where('doctor', $doctor);
        $holiday = $this->db->get('holidays')->result();

        if (empty($holiday)) {
            $this->db->where('date', $date);
            $this->db->where('doctor', $doctor);
            $query = $this->db->get('appointment')->result();


            $this->db->where('doctor', $doctor);
            $this->db->where('weekday', $weekday);
            $this->db->order_by('s_time_key', 'asc');
            $query1 = $this->db->get('time_slot')->result();

            $availabletimeSlot = array();
            $bookedTimeSlot = array();

            foreach ($query1 as $timeslot) {
                $availabletimeSlot[] = $timeslot->s_time . ' To ' . $timeslot->e_time;
            }
            foreach ($query as $bookedTime) {
                if ($bookedTime->status != 'Cancelled') {
                    $bookedTimeSlot[] = $bookedTime->time_slot;
                }
            }

            $availableSlot = array_diff($availabletimeSlot, $bookedTimeSlot);
            //log_message('debug', 'Slots disponibles para fecha ' . $date . ': ' . json_encode($availableSlot));
        } else {
            $availableSlot = array();
            //log_message('debug', 'Slots NO disponibles para fecha por ser dia de vacaciones ' . $date . ': ' . json_encode($availableSlot));
        }
        
        return $availableSlot;
    }

    function getAvailableSlotByDoctorByDateByAppointmentId($date, $doctor, $appointment_id) {
       
        $weekday = strftime("%A", $date);

        $this->db->where('date', $date);
        $this->db->where('doctor', $doctor);
        $holiday = $this->db->get('holidays')->result();

        if (empty($holiday)) {

            $this->db->where('date', $date);
            $this->db->where('doctor', $doctor);
            $query = $this->db->get('appointment')->result();


            $this->db->where('doctor', $doctor);
            $this->db->where('weekday', $weekday);
            $this->db->order_by('s_time_key', 'asc');
            $query1 = $this->db->get('time_slot')->result();

            $availabletimeSlot = array();
            $bookedTimeSlot = array();

            foreach ($query1 as $timeslot) {
                $availabletimeSlot[] = $timeslot->s_time . ' To ' . $timeslot->e_time;
            }
            foreach ($query as $bookedTime) {
                if ($bookedTime->status != 'Cancelled') {
                    if ($bookedTime->id != $appointment_id) {
                        $bookedTimeSlot[] = $bookedTime->time_slot;
                    }
                }
            }

            $availableSlot = array_diff($availabletimeSlot, $bookedTimeSlot);
        } else {
            $availableSlot = array();
        }

        return $availableSlot;
    }

    function updateIonUser($username, $email, $password, $ion_user_id) {
        $uptade_ion_user = array(
            'username' => $username,
            'email' => $email,
            'password' => $password
        );
        $this->db->where('id', $ion_user_id);
        $this->db->update('users', $uptade_ion_user);
    }

    function getDoctorByIonUserId($id) {
        $this->db->where('ion_user_id', $id);
        $query = $this->db->get('doctor');
        return $query->row();
    }

    function insertTimeSlot($data) {
        $this->db->insert('time_slot', $data);
    }

    function getTimeSlot() {
        $query = $this->db->get('time_slot');
        return $query->result();
    }

    function getTimeSlotById($id) {
        $this->db->where('id', $id);
        $query = $this->db->get('time_slot');
        return $query->row();
    }

    function getTimeSlotByDoctor($id) {
        $this->db->order_by('s_time_key', 'asc');
        $this->db->where('doctor', $id);
        $query = $this->db->get('time_slot');
        return $query->result();
    }

    function updateTimeSlot($id, $data) {
        $this->db->where('id', $id);
        $this->db->update('time_slot', $data);
    }

    function deleteTimeSlot($id) {
        $this->db->where('id', $id);
        $this->db->delete('time_slot');
    }

    function insertSchedule($data) {
        $this->db->insert('time_schedule', $data);
    }

    function getScheduleByDoctor($doctor) {
        $this->db->where('doctor', $doctor);
        $query = $this->db->get('time_schedule');
        return $query->result();
    }

    function getScheduleById($id) {
        $this->db->where('id', $id);
        $query = $this->db->get('time_schedule');
        return $query->row();
    }

    function getScheduleByDoctorByWeekday($doctor, $weekday) {
        $this->db->where('doctor', $doctor);
        $this->db->where('weekday', $weekday);
        $query = $this->db->get('time_schedule');
        return $query->result();
    }

    function getScheduleByDoctorByWeekdayById($doctor, $weekday, $id) {
        $this->db->where_not_in('id', $id);
        $this->db->where('doctor', $doctor);
        $this->db->where('weekday', $weekday);
        $query = $this->db->get('time_schedule');
        return $query->result();
    }

    function updateSchedule($id, $data) {
        $this->db->where('id', $id);
        $this->db->update('time_schedule', $data);
    }

    function deleteSchedule($id) {
        $this->db->where('id', $id);
        $this->db->delete('time_schedule');
    }

    function deleteTimeSlotByDoctorByWeekday($doctor, $weekday) {
        $this->db->where('doctor', $doctor);
        $this->db->where('weekday', $weekday);
        $this->db->delete('time_slot');
    }

    function insertHoliday($data) {
        $this->db->insert('holidays', $data);
    }

    function getHolidays() {
        $query = $this->db->get('holidays');
        return $query->result();
    }

    function getHolidayById($id) {
        $this->db->where('id', $id);
        $query = $this->db->get('holidays');
        return $query->row();
    }

    function getHolidaysByDoctor($id) {
        $this->db->order_by('id', 'asc');
        $this->db->where('doctor', $id);
        $query = $this->db->get('holidays');
        return $query->result();
    }

    function getHolidayByDoctorByDate($doctor, $date) {
        $this->db->where('doctor', $doctor);
        $this->db->where('date', $date);
        $query = $this->db->get('holidays');
        return $query->row();
    }

    function getTimeSlotByDoctorByWeekday($doctor, $weekday) {
        $this->db->where('doctor', $doctor);
        $this->db->where('weekday', $weekday);
        $query = $this->db->get('time_slot');
        return $query->result();
    }

    function getTimeSlotByDoctorByWeekdayById($doctor, $weekday, $id) {
        $this->db->where_not_in('id', $id);
        $this->db->where('doctor', $doctor);
        $this->db->where('weekday', $weekday);
        $query = $this->db->get('time_slot');
        return $query->result();
    }

    function updateHoliday($id, $data) {
        $this->db->where('id', $id);
        $this->db->update('holidays', $data);
    }

    function deleteHoliday($id) {
        $this->db->where('id', $id);
        $this->db->delete('holidays');
    }
    function getAvailableScheduleWithoutEdata($s_time,$weekday,$doctor){
        return $this->db->where('doctor',$doctor)
                 ->where('weekday',$weekday)
                 ->where('s_time >= ',$s_time)
                 ->where('e_time <=',$s_time)
                 ->get('time_schedule')->result();
    }
    function getAvailableScheduleWithEdata($s_time,$e_time,$weekday,$doctor){
        return $this->db->where('doctor',$doctor)
                        ->where('weekday',$weekday)
                        ->where('s_time >= ',$s_time)
                        ->where('e_time <=',$e_time)
                        ->get('time_schedule')->result();
    }
}
