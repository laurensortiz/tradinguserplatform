CREATE OR REPLACE FUNCTION public."investmentMovement_after_update"()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$

declare
consolidado numeric(10,2);
currentBehavior integer;
newAmount numeric(10,2);

    begin
	    consolidado := (Select "amount"
						From "InvestmentOperation"
                        Where id = old."investmentOperationId");

	newAmount := consolidado - old."gpAmount" + new."gpAmount";



	UPDATE "InvestmentOperation"
    SET "amount" = newAmount
 	Where id = old."investmentOperationId";


    RETURN NEW;
    END;
$function$
;

-- CREATE TRIGGER

CREATE TRIGGER investmentmovement_after_update
AFTER UPDATE
ON "InvestmentMovement" FOR EACH ROW
EXECUTE PROCEDURE public."investmentMovement_after_update"()
;
