-- Insérer des comptes de test pour les 3 rôles

-- Parent de test
INSERT INTO public.profiles (
  id, 
  first_name, 
  last_name, 
  email, 
  role,
  phone,
  address,
  city,
  postal_code
) VALUES 
(
  '11111111-1111-1111-1111-111111111111',
  'Marie',
  'Parent',
  'parent@test.com',
  'parent',
  '0123456789',
  '123 Rue des Parents',
  'Paris',
  '75001'
);

-- Professeur de test
INSERT INTO public.profiles (
  id,
  first_name,
  last_name, 
  email,
  role,
  phone,
  address,
  city,
  postal_code
) VALUES 
(
  '22222222-2222-2222-2222-222222222222',
  'Jean',
  'Professeur',
  'prof@test.com',
  'prof',
  '0123456790',
  '456 Avenue des Profs',
  'Lyon',
  '69001'
);

-- Administrateur de test
INSERT INTO public.profiles (
  id,
  first_name,
  last_name,
  email, 
  role,
  phone,
  address,
  city,
  postal_code
) VALUES 
(
  '33333333-3333-3333-3333-333333333333',
  'Admin',
  'Système',
  'admin@test.com',
  'admin',
  '0123456791',
  '789 Boulevard des Admins',
  'Marseille',
  '13001'
);

-- Ajouter le professeur dans la table teachers
INSERT INTO public.teachers (
  id,
  subjects,
  hourly_rate_displayed,
  hourly_rate_net,
  is_verified,
  iban,
  bic,
  bank_name
) VALUES 
(
  '22222222-2222-2222-2222-222222222222',
  '{"Mathématiques", "Physique"}',
  50.00,
  25.00,
  true,
  'FR7630001007941234567890185',
  'BDFEFRPPCCT',
  'Banque de France'
);

-- Créer un étudiant pour le parent de test
INSERT INTO public.students (
  id,
  first_name,
  last_name,
  parent_id,
  birth_date,
  school_level
) VALUES 
(
  '44444444-4444-4444-4444-444444444444',
  'Pierre',
  'Enfant',
  '11111111-1111-1111-1111-111111111111',
  '2010-05-15',
  'Collège'
);

-- Créer un pack d'heures pour l'étudiant
INSERT INTO public.packs (
  id,
  parent_id,
  student_id,
  total_hours,
  remaining_hours,
  price_displayed,
  price_net_parent,
  purchase_date,
  expires_at
) VALUES 
(
  '55555555-5555-5555-5555-555555555555',
  '11111111-1111-1111-1111-111111111111',
  '44444444-4444-4444-4444-444444444444',
  10.0,
  8.5,
  500.00,
  400.00,
  NOW(),
  NOW() + INTERVAL '6 months'
);

-- Créer une assignation prof-étudiant
INSERT INTO public.assignments (
  id,
  teacher_id,
  student_id,
  subject
) VALUES 
(
  '66666666-6666-6666-6666-666666666666',
  '22222222-2222-2222-2222-222222222222',
  '44444444-4444-4444-4444-444444444444',
  'Mathématiques'
);

-- Créer quelques sessions
INSERT INTO public.sessions (
  id,
  assignment_id,
  pack_id,
  session_date,
  duration_hours,
  status,
  notes
) VALUES 
(
  '77777777-7777-7777-7777-777777777777',
  '66666666-6666-6666-6666-666666666666',
  '55555555-5555-5555-5555-555555555555',
  CURRENT_DATE - INTERVAL '2 days',
  1.5,
  'validated',
  'Cours de révision sur les équations'
),
(
  '88888888-8888-8888-8888-888888888888',
  '66666666-6666-6666-6666-666666666666',
  '55555555-5555-5555-5555-555555555555',
  CURRENT_DATE,
  1.0,
  'pending',
  'Cours prévu aujourd''hui'
);