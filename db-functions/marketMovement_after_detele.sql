CREATE OR REPLACE FUNCTION public."marketMovement_after_detele"()
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

	newAmount := consolidado - old."gpAmount";



	UPDATE "MarketOperation"
    SET "amount" = newAmount
 	Where id = old."marketOperationId";


    RETURN NEW;
    END;
$function$
;


--Trigger
-- DROP TRIGGER marketmovement_after_detele ON public."MarketMovement";

create trigger marketmovement_after_detele after
delete
    on
    public."MarketMovement" for each row execute procedure "marketMovement_after_detele"();
