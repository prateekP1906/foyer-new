CREATE TABLE appointments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_name text NOT NULL,
  phone_number text NOT NULL,
  issue_description text,
  appointment_time timestamp with time zone NOT NULL,
  status text DEFAULT 'confirmed',
  created_at timestamp with time zone DEFAULT now()
);
