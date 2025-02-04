-- Trigger that will automatically set the sales_commission and purchases_commission values in the ledger table based on the latest entry in the commission table when a new ledger record is inserted.
-- Create a function for the trigger
CREATE
OR REPLACE FUNCTION set_commission_values()
RETURNS TRIGGER AS $$
DECLARE
latest_commission RECORD;
BEGIN
    -- Get the latest commission values
SELECT *
INTO latest_commission
FROM commission
ORDER BY id DESC LIMIT 1;

-- If a commission record exists, set the values in the new ledger entry
IF
FOUND THEN
        NEW.sales_commission := latest_commission.sales_commission;
        NEW.purchases_commission
:= latest_commission.purchases_commission;
ELSE
        -- If no commission record exists, set defaults (optional)
        NEW.sales_commission := 0.00;
        NEW.purchases_commission
:= 0.00;
END IF;

RETURN NEW;
END;
$$
LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER trigger_set_commission_values
    BEFORE INSERT
    ON ledger
    FOR EACH ROW
    EXECUTE FUNCTION set_commission_values();