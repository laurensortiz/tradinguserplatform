CREATE OR REPLACE FUNCTION public."investmentOperation_after_update"()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$

declare
garatias numeric(10,2);
totalOperationAmount numeric(10,2);

    begin
	    garatias := (Select "guaranteeOperation"
						From "UserAccount"
                        Where id = new."userAccountId");

        totalOperationAmount := (Select sum("amount")
						From "InvestmentOperation"
                        Where "userAccountId" = new."userAccountId");




--	UPDATE "UserAccount"
--    SET "accountValue" = (garatias + totalOperationAmount)
--   	WHERE id = new."userAccountId";


        RETURN NEW;
    END;
$function$
;
