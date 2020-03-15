CREATE OR REPLACE FUNCTION public."investmentMovement_after_insert"()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$

declare
consolidado numeric(10,2);
    begin
	    consolidado := (Select "amount"
						From "InvestmentOperation"
                        Where id = new."investmentOperationId");

	UPDATE "InvestmentOperation"
    SET "amount" = consolidado + NEW."gpAmount"
   	Where id = new."investmentOperationId";

        RETURN NEW;
    END;
$function$
;
