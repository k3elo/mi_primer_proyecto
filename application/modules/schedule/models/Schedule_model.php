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
        } else {
            $availableSlot = array();
        }

        return $availableSlot;
    }
    //Obtener la ranura disponible por doctor por fecha por id de cita
    function getAvailableSlotByDoctorByDateByAppointmentIdDatepicker($date, $doctor, $appointment_id) {
        $weekday = strftime("%A", $date); //Obtener el día de la semana
    
        $this->db->where('date', $date);//Obtener la fecha
        $this->db->where('doctor', $doctor);//Obtener el doctor
        $holiday = $this->db->get('holidays')->result();//Obtener las vacaciones
    
        if (empty($holiday)) {//Si no hay vacaciones
            //Obtener las citas
            $this->db->where('date', $date);//Obtener la fecha
            $this->db->where('doctor', $doctor);//Obtener el doctor
            $query = $this->db->get('appointment')->result();//Obtener las citas
    
            $this->db->where('doctor', $doctor);//Obtener el doctor
            $this->db->where('weekday', $weekday);//Obtener el día de la semana
            $this->db->order_by('s_time_key', 'asc');//Ordenar por la clave de tiempo de inicio
            $query1 = $this->db->get('time_slot')->result();//Obtener las ranuras de tiempo
    
            $availabletimeSlot = array();//Ranura de tiempo disponible
            $bookedTimeSlot = array();//Ranura de tiempo reservada
    
            foreach ($query1 as $timeslot) {//Para cada ranura de tiempo
                $availabletimeSlot[] = $timeslot->s_time . ' To ' . $timeslot->e_time;//Agregar la ranura de tiempo a la ranura de tiempo disponible
            }
            foreach ($query as $bookedTime) {//Para cada ranura de tiempo reservada
                if ($bookedTime->status != 'Cancelled') {//Si la cita no está cancelada
                    if ($bookedTime->id != $appointment_id) {//Si la cita no es la misma
                        $bookedTimeSlot[] = $bookedTime->time_slot;//Agregar la ranura de tiempo a la ranura de tiempo reservada
                    }
                }
            }
    
            $availableSlot = array_diff($availabletimeSlot, $bookedTimeSlot);//Obtener la diferencia entre la ranura de tiempo disponible y la ranura de tiempo reservada
        } else {//Si hay vacaciones
            $availableSlot = array();//Si hay vacaciones, no hay ranura de tiempo disponible
        }
    
        // Obtener los días disponibles
        $this->db->select('weekday');//Seleccionar el día de la semana
        $this->db->where('doctor', $doctor);//Obtener el doctor
        $this->db->group_by('weekday');//Agrupar por día de la semana
        $query_days = $this->db->get('time_slot')->result();//Obtener los días de la semana
    
        $availableDays = array();//Días disponibles
        foreach ($query_days as $day) {//Para cada día
            $availableDays[] = $day->weekday;//Agregar el día a los días disponibles
        }
    
        return array(//Retornar
            'availableSlot' => $availableSlot,//Ranura de tiempo disponible
            'availableDays' => $availableDays//Días disponibles
        );
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
        // Obtener los días disponibles
        $this->db->select('weekday');//Seleccionar el día de la semana
        $this->db->where('doctor', $doctor);//Obtener el doctor
        $this->db->group_by('weekday');//Agrupar por día de la semana
        $query_days = $this->db->get('time_slot')->result();//Obtener los días de la semana
    
        $availableDays = array();//Días disponibles
        foreach ($query_days as $day) {//Para cada día
            $availableDays[] = $day->weekday;//Agregar el día a los días disponibles
        }
    
        return array(//Retornar
            'availableSlot' => $availableSlot,//Ranura de tiempo disponible
            'availableDays' => $availableDays//Días disponibles
        );

        //return $availableSlot;
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
