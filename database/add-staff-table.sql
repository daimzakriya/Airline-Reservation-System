-- Run this on Neon to add the missing Staff table and registerStaff procedure
-- Run ONLY if the database already has the other tables (partial migration fix)

DROP TABLE IF EXISTS Staff CASCADE;
DROP PROCEDURE IF EXISTS registerStaff;
DROP TYPE IF EXISTS staff_category;
DROP TYPE IF EXISTS staff_account_state;

CREATE TYPE staff_category AS ENUM('admin', 'manager', 'general');
CREATE TYPE staff_account_state AS ENUM('unverified', 'verified');

CREATE TABLE Staff (
  emp_id VARCHAR(20) NOT NULL,
  category staff_category NOT NULL,
  password varchar(255) NOT NULL,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  contact_no VARCHAR(15) NOT NULL,
  email VARCHAR(127) NOT NULL UNIQUE,
  dob DATE NOT NULL,
  gender gender_enum NOT NULL,
  country VARCHAR(30) NOT NULL,
  assigned_airport varchar(10),
  account_state staff_account_state NOT NULL DEFAULT 'unverified',
  PRIMARY KEY (emp_id),
  FOREIGN KEY(assigned_airport) REFERENCES Airport(airport_code) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE OR REPLACE PROCEDURE registerStaff(
  val_emp_id VARCHAR(20),
  val_category staff_category,
  val_password varchar(255),
  val_first_name VARCHAR(30),
  val_last_name VARCHAR(30),
  val_contact_no VARCHAR(15),
  val_email VARCHAR(127),
  val_dob DATE,
  val_gender gender_enum,
  val_country VARCHAR(30),
  val_airport varchar(10)
)
LANGUAGE plpgsql
AS $$
DECLARE
  var_existing_emp_id varchar(20) := (SELECT emp_id FROM staff WHERE emp_id = val_emp_id);
  var_existing_email varchar(127) := (SELECT email FROM staff WHERE email = val_email);
  val_account_state staff_account_state;
BEGIN
  IF (var_existing_emp_id IS NOT NULL) THEN
    RAISE EXCEPTION 'Employee ID % is already registered', val_emp_id;
  END IF;
  IF (var_existing_email IS NOT NULL) THEN
    RAISE EXCEPTION 'Email % is already registered', val_email;
  END IF;
  IF (val_category = 'admin') THEN
    val_account_state := 'verified';
  ELSE
    val_account_state := 'unverified';
  END IF;
  INSERT INTO Staff(emp_id, category, password, first_name, last_name, contact_no, email, dob, gender, country, assigned_airport, account_state)
  VALUES (val_emp_id, val_category, val_password, val_first_name, val_last_name, val_contact_no, val_email, val_dob, val_gender, val_country, val_airport, val_account_state);
END;
$$;

GRANT ALL ON TABLE public.staff TO database_app;
GRANT EXECUTE ON PROCEDURE public.registerstaff(
  VARCHAR, staff_category, VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, DATE, gender_enum, VARCHAR, VARCHAR
) TO database_app;
