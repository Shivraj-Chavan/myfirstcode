import pool from "../config/db.js";

export const getStudentProfile = async (req, res) => {
    try {
  
      const { id } = req.params;
  
      const [student] = await pool.execute(
        `
        SELECT
          s.*,
  
          sp.gender,
          sp.dob,
          sp.whatsapp_number,
  
          sp.father_name,
          sp.father_mobile,
  
          sp.mother_name,
          sp.mother_mobile,
  
          sp.guardian_name,
          sp.guardian_contact,
  
          sp.parent_email,
          sp.occupation,
  
          sp.school_college,
          sp.board,
          sp.division,
          sp.academic_year,
          sp.admission_date,
  
          sp.address_line1,
          sp.address_line2,
          sp.area,
          sp.city,
          sp.state,
          sp.pincode,
          sp.country
  
        FROM students s
  
        LEFT JOIN student_profiles sp
        ON sp.student_id = s.id
  
        WHERE s.id = ?
        `,
        [id]
      );
  
      if (!student.length) {
        return res.status(404).json({
          success: false,
          message: "Student not found"
        });
      }
  
      res.status(200).json({
        success: true,
        student: student[0]
      });
  
    } catch (error) {
  
      console.error(error);
  
      res.status(500).json({
        success: false,
        message: "Server Error"
      });
    }
  };


  export const saveStudentProfile = async (req, res) => {

    try {
  
      const { id } = req.params;
  
      const {
  
        gender,
        dob,
        whatsapp_number,
  
        father_name,
        father_mobile,
  
        mother_name,
        mother_mobile,
  
        guardian_name,
        guardian_contact,
  
        parent_email,
        occupation,
  
        school_college,
        board,
        division,
        academic_year,
        admission_date,
  
        address_line1,
        address_line2,
  
        area,
        city,
        state,
        pincode,
        country
  
      } = req.body;
  
      const [existing] = await pool.execute(
        `
        SELECT id
        FROM student_profiles
        WHERE student_id = ?
        `,
        [id]
      );
  
      if (existing.length) {
  
        await pool.execute(
          `
          UPDATE student_profiles
          SET
  
            gender=?,
            dob=?,
            whatsapp_number=?,
  
            father_name=?,
            father_mobile=?,
  
            mother_name=?,
            mother_mobile=?,
  
            guardian_name=?,
            guardian_contact=?,
  
            parent_email=?,
            occupation=?,
  
            school_college=?,
            board=?,
            division=?,
            academic_year=?,
            admission_date=?,
  
            address_line1=?,
            address_line2=?,
  
            area=?,
            city=?,
            state=?,
            pincode=?,
            country=?
  
          WHERE student_id=?
          `,
          [
  
            gender,
            dob,
            whatsapp_number,
  
            father_name,
            father_mobile,
  
            mother_name,
            mother_mobile,
  
            guardian_name,
            guardian_contact,
  
            parent_email,
            occupation,
  
            school_college,
            board,
            division,
            academic_year,
            admission_date,
  
            address_line1,
            address_line2,
  
            area,
            city,
            state,
            pincode,
            country,
  
            id
          ]
        );
  
      } else {
  
        await pool.execute(
          `
          INSERT INTO student_profiles
          (
            student_id,
  
            gender,
            dob,
            whatsapp_number,
  
            father_name,
            father_mobile,
  
            mother_name,
            mother_mobile,
  
            guardian_name,
            guardian_contact,
  
            parent_email,
            occupation,
  
            school_college,
            board,
            division,
            academic_year,
            admission_date,
  
            address_line1,
            address_line2,
  
            area,
            city,
            state,
            pincode,
            country
          )
          VALUES
          (
            ?,?,?,?,?,?,
            ?,?,?,?,?,?,
            ?,?,?,?,?,?,
            ?,?,?,?,?,?,
            ?
          )
          `,
          [
            id,
  
            gender,
            dob,
            whatsapp_number,
  
            father_name,
            father_mobile,
  
            mother_name,
            mother_mobile,
  
            guardian_name,
            guardian_contact,
  
            parent_email,
            occupation,
  
            school_college,
            board,
            division,
            academic_year,
            admission_date,
  
            address_line1,
            address_line2,
  
            area,
            city,
            state,
            pincode,
            country
          ]
        );
      }
  
      res.status(200).json({
        success: true,
        message: "Profile saved successfully"
      });
  
    } catch (error) {
  
      console.error(error);
  
      res.status(500).json({
        success: false,
        message: "Server Error"
      });
    }
  };