/*
  # AI Smart Complaint Analyzer Schema

  1. New Tables
    - `complaints`
      - `id` (uuid, primary key) - Unique identifier for each complaint
      - `complaint_text` (text) - The actual complaint submitted by the user
      - `category` (text) - AI-detected category (Technical, Billing, Service, Product, etc.)
      - `urgency` (text) - AI-detected urgency level (Low, Medium, High, Critical)
      - `priority_score` (integer) - Numerical priority score (1-10)
      - `user_email` (text) - Optional email of the person submitting
      - `status` (text) - Current status (New, In Progress, Resolved)
      - `created_at` (timestamptz) - Timestamp of complaint submission
      
  2. Security
    - Enable RLS on `complaints` table
    - Add policy for anyone to insert complaints (public submission)
    - Add policy for anyone to read complaints (public viewing)
    - Add policy for authenticated users to update complaint status
*/

CREATE TABLE IF NOT EXISTS complaints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_text text NOT NULL,
  category text NOT NULL,
  urgency text NOT NULL,
  priority_score integer NOT NULL DEFAULT 5,
  user_email text,
  status text NOT NULL DEFAULT 'New',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit complaints"
  ON complaints
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view complaints"
  ON complaints
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can update complaint status"
  ON complaints
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);