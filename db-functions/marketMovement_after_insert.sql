CREATE OR REPLACE FUNCTION public."marketMovement_after_insert"()
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
                        Where id = new."marketOperationId");

	newAmount := consolidado + NEW."gpAmount";


	IF (newAmount = consolidado) then
		currentBehavior := 0;
    ELSIF (newAmount > consolidado) then
        currentBehavior := 1;
   	ELSIF (newAmount < consolidado) then
        currentBehavior := 2;
   END IF;

	UPDATE "MarketOperation"
    SET "amount" = newAmount,
    	"behavior" = currentBehavior
 	Where id = new."marketOperationId";


    RETURN NEW;
    END;
$function$
;
