-- Trigger to send notifications when sacrament request status changes
-- =====================================================================

CREATE OR REPLACE FUNCTION notify_sacrament_status_change()
RETURNS TRIGGER AS $$
DECLARE
  v_title TEXT;
  v_message TEXT;
  v_sacrament_name TEXT;
BEGIN
  -- Only send notification if status changed
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    -- Capitalize sacrament type
    v_sacrament_name := INITCAP(NEW.sacrament_type::TEXT);
    
    -- Set notification based on new status
    CASE NEW.status
      WHEN 'under_review' THEN
        v_title := v_sacrament_name || ' Request Under Review';
        v_message := 'Your ' || NEW.sacrament_type || ' request is being reviewed by our clergy.';
      WHEN 'approved' THEN
        v_title := v_sacrament_name || ' Request Approved';
        v_message := 'Your ' || NEW.sacrament_type || ' request has been approved. We will contact you soon to schedule the service.';
      WHEN 'scheduled' THEN
        v_title := v_sacrament_name || ' Scheduled';
        v_message := 'Your ' || NEW.sacrament_type || ' has been scheduled for ' || 
                     TO_CHAR(NEW.scheduled_date, 'FMDay, FMMonth DD, YYYY at HH12:MI AM') || 
                     ' at ' || COALESCE(NEW.scheduled_location, 'the church') || '.';
      WHEN 'completed' THEN
        v_title := v_sacrament_name || ' Completed';
        v_message := 'Your ' || NEW.sacrament_type || ' service has been completed. Thank you for being part of our parish family.';
      WHEN 'rejected' THEN
        v_title := v_sacrament_name || ' Request Update';
        v_message := 'There is an update regarding your ' || NEW.sacrament_type || ' request. Please contact the parish office.';
      ELSE
        RETURN NEW;
    END CASE;
    
    -- Insert notification
    INSERT INTO notifications (user_id, title, message, type)
    VALUES (NEW.user_id, v_title, v_message, 'sacrament');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS sacrament_status_notification ON sacrament_requests;
CREATE TRIGGER sacrament_status_notification
  AFTER UPDATE ON sacrament_requests
  FOR EACH ROW
  EXECUTE FUNCTION notify_sacrament_status_change();
