CREATE OR REPLACE FUNCTION public."marketOperation_after_update"()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$

declare
garatias numeric(10,2);
currentAccountAmount numeric(10,2);
totalOperationAmount numeric(10,2);
operationAmount numeric(10,2);


    begin
	    garatias := (Select "guaranteeOperation"
						From "UserAccount"
                        Where id = new."userAccountId");

   		currentAccountAmount := (Select "accountValue"
						From "UserAccount"
                        Where id = new."userAccountId");

       /* totalOperationAmount := (Select sum("amount")
						From "MarketOperation"
                        Where "userAccountId" = new."userAccountId");
      */

                       totalOperationAmount := (Select sum("gpAmount")
						From "MarketMovement"
                        Where "marketOperationId" = new."id");

--	UPDATE "UserAccount"
--    SET "accountValue" = (currentAccountAmount + garatias + totalOperationAmount)
--   	WHERE id = new."userAccountId";


        RETURN NEW;
    END;
$function$
;
