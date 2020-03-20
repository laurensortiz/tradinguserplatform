CREATE OR REPLACE FUNCTION public."marketMovement_after_update"()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$

declare
consolidado numeric(10,2);
currentBehavior integer;
newAmount numeric(10,2);

    begin
	    consolidado := (Select "amount"
						From "MarketOperation"
                        Where id = old."marketOperationId");

	newAmount := consolidado - old."gpAmount" + new."gpAmount";



	UPDATE "MarketOperation"
    SET "amount" = newAmount
 	Where id = old."marketOperationId";


    RETURN NEW;
    END;
$function$
;

-- CREATE TRIGGER

CREATE TRIGGER marketmovement_after_update
AFTER UPDATE
ON "MarketMovement" FOR EACH ROW
EXECUTE PROCEDURE public."marketMovement_after_update"()
;
