CREATE OR REPLACE FUNCTION public."marketOperation_after_insert"()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$

declare
garatias numeric(10,2);
    begin
	    garatias := (Select "guaranteeOperation"
						From "UserAccount"
                        Where id = new."userAccountId");

	UPDATE "UserAccount"
    SET "guaranteeOperation" = (garatias - NEW."initialAmount" - new."maintenanceMargin")
   	WHERE id = new."userAccountId";


        RETURN NEW;
    END;
$function$
;
