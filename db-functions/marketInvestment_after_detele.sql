CREATE OR REPLACE FUNCTION public."investmentMovement_after_detele"()
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

	newAmount := consolidado - old."gpAmount";



	UPDATE "InvestmentOperation"
    SET "amount" = newAmount
 	Where id = old."investmentOperationId";


    RETURN NEW;
    END;
$function$
;


--Trigger
-- DROP TRIGGER investmentmovement_after_detele ON public."InvestmentMovement";

create trigger investmentmovement_after_detele after
delete
    on
    public."InvestmentMovement" for each row execute procedure "investmentMovement_after_detele"();
