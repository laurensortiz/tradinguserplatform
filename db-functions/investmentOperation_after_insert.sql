CREATE OR REPLACE FUNCTION public."investmentOperation_after_insert"()
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
    SET "guaranteeOperation" = (garatias - NEW."initialAmount")
   	WHERE id = new."userAccountId";


        RETURN NEW;
    END;
$function$
;
