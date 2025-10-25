-- ==========================================
-- PLATEFORME PARENTS ↔ PROFS - AIA/URSSAF
-- ==========================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- ==========================================
-- ENUMS
-- ==========================================

CREATE TYPE user_role AS ENUM ('admin', 'parent', 'prof');
CREATE TYPE session_status AS ENUM ('pending', 'validated', 'expired', 'cancelled');
CREATE TYPE aia_status AS ENUM ('pending', 'submitted', 'accepted', 'rejected', 'paid');
CREATE TYPE doc_type AS ENUM ('invoice', 'payslip', 'tax_certificate', 'contract', 'other');

-- ==========================================
-- CORE FUNCTIONS
-- ==========================================

-- Function to update timestamps
CREATE OR REPLACE FUNCTION set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Generate 6-digit OTP
CREATE OR REPLACE FUNCTION generate_otp()
RETURNS TEXT AS $$
BEGIN
  RETURN LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- TABLES
-- ==========================================

-- Profiles (linked to auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'parent',
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  aia_eligible BOOLEAN DEFAULT false,
  aia_registration_number TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Students
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  birth_date DATE,
  school_level TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Teachers
CREATE TABLE public.teachers (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  subjects TEXT[] NOT NULL DEFAULT '{}',
  hourly_rate_displayed DECIMAL(10,2) DEFAULT 50.00,
  hourly_rate_net DECIMAL(10,2) DEFAULT 25.00,
  iban TEXT,
  bic TEXT,
  bank_name TEXT,
  social_security_number TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Student-Teacher assignments
CREATE TABLE public.assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, teacher_id, subject)
);

-- Hour packs
CREATE TABLE public.packs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  total_hours DECIMAL(4,2) NOT NULL CHECK (total_hours > 0),
  remaining_hours DECIMAL(4,2) NOT NULL CHECK (remaining_hours >= 0),
  price_displayed DECIMAL(10,2) NOT NULL,
  price_net_parent DECIMAL(10,2) NOT NULL,
  purchase_date TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Sessions
CREATE TABLE public.sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  pack_id UUID NOT NULL REFERENCES public.packs(id) ON DELETE CASCADE,
  duration_hours DECIMAL(3,2) NOT NULL CHECK (duration_hours > 0),
  session_date DATE NOT NULL,
  status session_status DEFAULT 'pending',
  otp_code TEXT,
  otp_generated_at TIMESTAMPTZ,
  otp_attempts INTEGER DEFAULT 0,
  validated_at TIMESTAMPTZ,
  validated_by UUID REFERENCES public.profiles(id),
  aia_status aia_status DEFAULT 'pending',
  aia_amount DECIMAL(10,2),
  aia_reference TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- AIA API logs
CREATE TABLE public.aia_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  request_payload JSONB,
  response_payload JSONB,
  status_code INTEGER,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Documents
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.sessions(id) ON DELETE SET NULL,
  doc_type doc_type NOT NULL,
  title TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Messages
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.sessions(id) ON DELETE SET NULL,
  subject TEXT,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Audit logs
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- TRIGGERS FOR TIMESTAMPS
-- ==========================================

CREATE TRIGGER set_timestamp_profiles BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION set_timestamp();
CREATE TRIGGER set_timestamp_students BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION set_timestamp();
CREATE TRIGGER set_timestamp_teachers BEFORE UPDATE ON public.teachers FOR EACH ROW EXECUTE FUNCTION set_timestamp();
CREATE TRIGGER set_timestamp_assignments BEFORE UPDATE ON public.assignments FOR EACH ROW EXECUTE FUNCTION set_timestamp();
CREATE TRIGGER set_timestamp_packs BEFORE UPDATE ON public.packs FOR EACH ROW EXECUTE FUNCTION set_timestamp();
CREATE TRIGGER set_timestamp_sessions BEFORE UPDATE ON public.sessions FOR EACH ROW EXECUTE FUNCTION set_timestamp();
CREATE TRIGGER set_timestamp_documents BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE FUNCTION set_timestamp();
CREATE TRIGGER set_timestamp_messages BEFORE UPDATE ON public.messages FOR EACH ROW EXECUTE FUNCTION set_timestamp();

-- ==========================================
-- SESSION OTP FUNCTIONS
-- ==========================================

-- Generate OTP for session validation
CREATE OR REPLACE FUNCTION sessions_generate_otp(session_id UUID)
RETURNS JSON AS $$
DECLARE
  session_record public.sessions;
  new_otp TEXT;
  result JSON;
BEGIN
  -- Check if session exists and is pending
  SELECT * INTO session_record FROM public.sessions WHERE id = session_id;
  
  IF NOT FOUND THEN
    RETURN JSON_BUILD_OBJECT('success', false, 'error', 'Session not found');
  END IF;
  
  IF session_record.status != 'pending' THEN
    RETURN JSON_BUILD_OBJECT('success', false, 'error', 'Session already processed');
  END IF;
  
  -- Generate new OTP
  new_otp := generate_otp();
  
  -- Update session with new OTP
  UPDATE public.sessions 
  SET 
    otp_code = new_otp,
    otp_generated_at = now(),
    otp_attempts = 0,
    updated_at = now()
  WHERE id = session_id;
  
  -- Log action
  INSERT INTO public.audit_logs (action, table_name, record_id, new_values)
  VALUES ('generate_otp', 'sessions', session_id, JSON_BUILD_OBJECT('otp_generated', true));
  
  RETURN JSON_BUILD_OBJECT('success', true, 'otp', new_otp, 'expires_at', now() + INTERVAL '24 hours');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Validate OTP and process session
CREATE OR REPLACE FUNCTION sessions_validate_otp(session_id UUID, provided_otp TEXT, validator_id UUID)
RETURNS JSON AS $$
DECLARE
  session_record public.sessions;
  pack_record public.packs;
  assignment_record public.assignments;
  validator_record public.profiles;
  result JSON;
BEGIN
  -- Check validator exists
  SELECT * INTO validator_record FROM public.profiles WHERE id = validator_id;
  IF NOT FOUND THEN
    RETURN JSON_BUILD_OBJECT('success', false, 'error', 'Invalid validator');
  END IF;
  
  -- Get session with lock
  SELECT * INTO session_record FROM public.sessions WHERE id = session_id FOR UPDATE;
  
  IF NOT FOUND THEN
    RETURN JSON_BUILD_OBJECT('success', false, 'error', 'Session not found');
  END IF;
  
  -- Check session status
  IF session_record.status != 'pending' THEN
    RETURN JSON_BUILD_OBJECT('success', false, 'error', 'Session already processed');
  END IF;
  
  -- Check OTP exists
  IF session_record.otp_code IS NULL THEN
    RETURN JSON_BUILD_OBJECT('success', false, 'error', 'No OTP generated for this session');
  END IF;
  
  -- Check OTP expiry (24h)
  IF session_record.otp_generated_at < now() - INTERVAL '24 hours' THEN
    UPDATE public.sessions SET status = 'expired' WHERE id = session_id;
    RETURN JSON_BUILD_OBJECT('success', false, 'error', 'OTP expired');
  END IF;
  
  -- Check max attempts
  IF session_record.otp_attempts >= 5 THEN
    UPDATE public.sessions SET status = 'expired' WHERE id = session_id;
    RETURN JSON_BUILD_OBJECT('success', false, 'error', 'Maximum attempts exceeded');
  END IF;
  
  -- Increment attempts
  UPDATE public.sessions SET otp_attempts = otp_attempts + 1 WHERE id = session_id;
  
  -- Check OTP match
  IF session_record.otp_code != provided_otp THEN
    RETURN JSON_BUILD_OBJECT('success', false, 'error', 'Invalid OTP', 'attempts_remaining', 5 - session_record.otp_attempts - 1);
  END IF;
  
  -- Get pack and assignment info
  SELECT * INTO pack_record FROM public.packs WHERE id = session_record.pack_id FOR UPDATE;
  SELECT * INTO assignment_record FROM public.assignments WHERE id = session_record.assignment_id;
  
  -- Check pack has enough hours
  IF pack_record.remaining_hours < session_record.duration_hours THEN
    RETURN JSON_BUILD_OBJECT('success', false, 'error', 'Insufficient hours in pack');
  END IF;
  
  -- Process validation
  UPDATE public.sessions 
  SET 
    status = 'validated',
    validated_at = now(),
    validated_by = validator_id,
    aia_status = 'pending',
    aia_amount = session_record.duration_hours * 25.00, -- 25€ URSSAF part
    updated_at = now()
  WHERE id = session_id;
  
  -- Deduct hours from pack
  UPDATE public.packs 
  SET 
    remaining_hours = remaining_hours - session_record.duration_hours,
    updated_at = now()
  WHERE id = session_record.pack_id;
  
  -- Log AIA submission (mock)
  INSERT INTO public.aia_logs (session_id, action, request_payload, status_code)
  VALUES (
    session_id, 
    'submit_declaration',
    JSON_BUILD_OBJECT(
      'amount', session_record.duration_hours * 25.00,
      'duration', session_record.duration_hours,
      'date', session_record.session_date
    ),
    200
  );
  
  -- Audit log
  INSERT INTO public.audit_logs (user_id, action, table_name, record_id, new_values)
  VALUES (
    validator_id,
    'validate_session',
    'sessions',
    session_id,
    JSON_BUILD_OBJECT('validated', true, 'hours_deducted', session_record.duration_hours)
  );
  
  RETURN JSON_BUILD_OBJECT(
    'success', true, 
    'message', 'Session validated successfully',
    'hours_deducted', session_record.duration_hours,
    'remaining_hours', pack_record.remaining_hours - session_record.duration_hours
  );
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN JSON_BUILD_OBJECT('success', false, 'error', 'Validation failed: ' || SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Mark expired OTP sessions
CREATE OR REPLACE FUNCTION sessions_mark_expired()
RETURNS INTEGER AS $$
DECLARE
  expired_count INTEGER;
BEGIN
  UPDATE public.sessions 
  SET status = 'expired', updated_at = now()
  WHERE status = 'pending' 
    AND otp_generated_at IS NOT NULL 
    AND otp_generated_at < now() - INTERVAL '24 hours';
  
  GET DIAGNOSTICS expired_count = ROW_COUNT;
  
  INSERT INTO public.audit_logs (action, table_name, new_values)
  VALUES ('expire_sessions', 'sessions', JSON_BUILD_OBJECT('expired_count', expired_count));
  
  RETURN expired_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- ENABLE ROW LEVEL SECURITY
-- ==========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aia_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- RLS POLICIES
-- ==========================================

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Students policies
CREATE POLICY "Parents can manage their students" ON public.students FOR ALL USING (
  parent_id = auth.uid()
);
CREATE POLICY "Teachers can view assigned students" ON public.students FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.assignments a 
    WHERE a.student_id = students.id AND a.teacher_id = auth.uid() AND a.is_active = true
  )
);
CREATE POLICY "Admins can manage all students" ON public.students FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Teachers policies
CREATE POLICY "Teachers can view own profile" ON public.teachers FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Teachers can update own profile" ON public.teachers FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Everyone can view active teachers" ON public.teachers FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage all teachers" ON public.teachers FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Assignments policies
CREATE POLICY "Parents can view student assignments" ON public.assignments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.students WHERE id = assignments.student_id AND parent_id = auth.uid())
);
CREATE POLICY "Teachers can view own assignments" ON public.assignments FOR SELECT USING (teacher_id = auth.uid());
CREATE POLICY "Admins can manage all assignments" ON public.assignments FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Packs policies
CREATE POLICY "Parents can manage their packs" ON public.packs FOR ALL USING (parent_id = auth.uid());
CREATE POLICY "Teachers can view related packs" ON public.packs FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.assignments a 
    WHERE a.student_id = packs.student_id AND a.teacher_id = auth.uid() AND a.is_active = true
  )
);
CREATE POLICY "Admins can manage all packs" ON public.packs FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Sessions policies (no direct access to OTP/AIA fields)
CREATE POLICY "Parents can view student sessions" ON public.sessions FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.assignments a
    JOIN public.students s ON s.id = a.student_id
    WHERE a.id = sessions.assignment_id AND s.parent_id = auth.uid()
  )
);
CREATE POLICY "Teachers can view own sessions" ON public.sessions FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.assignments a
    WHERE a.id = sessions.assignment_id AND a.teacher_id = auth.uid()
  )
);
CREATE POLICY "Admins can view all sessions" ON public.sessions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- AIA logs (admin only)
CREATE POLICY "Admins can view AIA logs" ON public.aia_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Documents policies
CREATE POLICY "Users can view own documents" ON public.documents FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can manage own documents" ON public.documents FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Admins can view all documents" ON public.documents FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Messages policies
CREATE POLICY "Users can view own messages" ON public.messages FOR SELECT USING (
  sender_id = auth.uid() OR receiver_id = auth.uid()
);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (sender_id = auth.uid());
CREATE POLICY "Users can update own messages" ON public.messages FOR UPDATE USING (sender_id = auth.uid());
CREATE POLICY "Admins can view all messages" ON public.messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Audit logs (admin only)
CREATE POLICY "Admins can view audit logs" ON public.audit_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ==========================================
-- DASHBOARD VIEWS
-- ==========================================

-- Parent dashboard view
CREATE VIEW public.view_parent_dashboard AS
SELECT 
  p.id as parent_id,
  p.first_name,
  p.last_name,
  COUNT(DISTINCT s.id) as total_students,
  COUNT(DISTINCT pk.id) as total_packs,
  COALESCE(SUM(pk.total_hours), 0) as total_hours_purchased,
  COALESCE(SUM(pk.remaining_hours), 0) as total_hours_remaining,
  COUNT(DISTINCT CASE WHEN sess.status = 'validated' THEN sess.id END) as completed_sessions,
  COUNT(DISTINCT CASE WHEN sess.status = 'pending' THEN sess.id END) as pending_sessions
FROM public.profiles p
LEFT JOIN public.students s ON s.parent_id = p.id AND s.is_active = true
LEFT JOIN public.packs pk ON pk.parent_id = p.id AND pk.is_active = true
LEFT JOIN public.sessions sess ON sess.pack_id = pk.id
WHERE p.role = 'parent'
GROUP BY p.id, p.first_name, p.last_name;

-- Teacher dashboard view
CREATE VIEW public.view_prof_dashboard AS
SELECT 
  t.id as teacher_id,
  p.first_name,
  p.last_name,
  t.subjects,
  COUNT(DISTINCT a.student_id) as assigned_students,
  COUNT(DISTINCT CASE WHEN sess.status = 'validated' THEN sess.id END) as total_sessions_validated,
  COALESCE(SUM(CASE WHEN sess.status = 'validated' THEN sess.duration_hours ELSE 0 END), 0) as total_hours_worked,
  COALESCE(SUM(CASE 
    WHEN sess.status = 'validated' AND EXTRACT(MONTH FROM sess.validated_at) = EXTRACT(MONTH FROM CURRENT_DATE)
    THEN sess.duration_hours ELSE 0 END), 0) as current_month_hours,
  COALESCE(SUM(CASE WHEN sess.status = 'validated' THEN sess.duration_hours * t.hourly_rate_net ELSE 0 END), 0) as total_earnings,
  COALESCE(SUM(CASE 
    WHEN sess.status = 'validated' AND EXTRACT(MONTH FROM sess.validated_at) = EXTRACT(MONTH FROM CURRENT_DATE)
    THEN sess.duration_hours * t.hourly_rate_net ELSE 0 END), 0) as current_month_earnings
FROM public.teachers t
JOIN public.profiles p ON p.id = t.id
LEFT JOIN public.assignments a ON a.teacher_id = t.id AND a.is_active = true
LEFT JOIN public.sessions sess ON sess.assignment_id = a.id
WHERE t.is_active = true
GROUP BY t.id, p.first_name, p.last_name, t.subjects, t.hourly_rate_net;

-- Admin dashboard view
CREATE VIEW public.view_admin_overview AS
SELECT 
  COUNT(DISTINCT CASE WHEN p.role = 'parent' THEN p.id END) as total_parents,
  COUNT(DISTINCT CASE WHEN p.role = 'prof' THEN p.id END) as total_teachers,
  COUNT(DISTINCT s.id) as total_students,
  COUNT(DISTINCT CASE WHEN sess.status = 'validated' THEN sess.id END) as total_sessions_completed,
  COUNT(DISTINCT CASE WHEN sess.status = 'pending' THEN sess.id END) as total_sessions_pending,
  COALESCE(SUM(CASE WHEN sess.status = 'validated' THEN sess.duration_hours * 50 ELSE 0 END), 0) as total_revenue_gross,
  COALESCE(SUM(CASE WHEN sess.status = 'validated' THEN sess.duration_hours * 25 ELSE 0 END), 0) as total_revenue_net,
  COALESCE(SUM(CASE WHEN sess.aia_status = 'pending' THEN sess.aia_amount ELSE 0 END), 0) as aia_pending_amount,
  COALESCE(SUM(CASE WHEN sess.aia_status = 'accepted' THEN sess.aia_amount ELSE 0 END), 0) as aia_accepted_amount,
  COALESCE(SUM(CASE WHEN sess.aia_status = 'rejected' THEN sess.aia_amount ELSE 0 END), 0) as aia_rejected_amount,
  ROUND(
    COUNT(DISTINCT CASE WHEN sess.aia_status = 'accepted' THEN sess.id END) * 100.0 / 
    NULLIF(COUNT(DISTINCT CASE WHEN sess.aia_status IN ('accepted', 'rejected') THEN sess.id END), 0), 
    2
  ) as aia_success_rate
FROM public.profiles p
LEFT JOIN public.students s ON s.parent_id = p.id AND p.role = 'parent'
LEFT JOIN public.assignments a ON a.student_id = s.id
LEFT JOIN public.sessions sess ON sess.assignment_id = a.id;

-- ==========================================
-- STORAGE BUCKETS & POLICIES
-- ==========================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('documents', 'documents', false),
  ('payslips', 'payslips', false),
  ('invoices', 'invoices', false);

-- Documents bucket policies
CREATE POLICY "Users can view own documents" ON storage.objects FOR SELECT USING (
  bucket_id = 'documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can upload own documents" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Payslips bucket policies  
CREATE POLICY "Teachers can view own payslips" ON storage.objects FOR SELECT USING (
  bucket_id = 'payslips' AND 
  auth.uid()::text = (storage.foldername(name))[1] AND
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'prof')
);

CREATE POLICY "Admins can manage payslips" ON storage.objects FOR ALL USING (
  bucket_id = 'payslips' AND
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Invoices bucket policies
CREATE POLICY "Parents can view own invoices" ON storage.objects FOR SELECT USING (
  bucket_id = 'invoices' AND 
  auth.uid()::text = (storage.foldername(name))[1] AND
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'parent')
);

CREATE POLICY "Admins can manage invoices" ON storage.objects FOR ALL USING (
  bucket_id = 'invoices' AND
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ==========================================
-- CRON JOB FOR OTP EXPIRY
-- ==========================================

SELECT cron.schedule(
  'expire-otp-sessions',
  '0 */6 * * *', -- Every 6 hours
  $$SELECT sessions_mark_expired();$$
);