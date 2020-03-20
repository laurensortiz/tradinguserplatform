CREATE OR REPLACE FUNCTION public."userAccount_after_update"()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$

declare
currentAmount numeric(10,2);
newAmount numeric(10,2);
currentGuarantee numeric(10,2);
newGuarantee numeric(10,2);
diffNewOldAmount numeric(10,2);


    begin

	 currentAmount := old."accountValue";
	 newAmount := new."accountValue";
	 currentGuarantee := old."guaranteeOperation";
	 newGuarantee := new."guaranteeOperation";

     diffNewOldAmount := newAmount - currentAmount;

    --RAISE EXCEPTION 'Yo there I''m number %', old.id;

	  --RAISE EXCEPTION 'Yo there I''m number %, eso%', currentAmount, newAmount;

--    IF (currentAmount != newAmount) then
--	 UPDATE "UserAccount"
--    SET "guaranteeOperation" = diffNewOldAmount + currentGuarantee where id = old.id;
-- 	end if;

        RETURN NEW;
    END;
$function$
;

- DROP TRIGGER useraccount_after_update ON public."UserAccount";

create trigger useraccount_after_update after
update
    on
    public."UserAccount" for each row execute procedure "userAccount_after_update"();